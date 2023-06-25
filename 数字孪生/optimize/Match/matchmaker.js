var enableRedirectionLinks = true;
var enableRESTAPI = true;

const defaultConfig = {
  // The port clients connect to the matchmaking service over HTTP
  HttpPort: 90,
  UseHTTPS: false,
  // The matchmaking port the signaling service connects to the matchmaker
  MatchmakerPort: 9999,
  // Log to file
  LogToFile: true,
};

// Similar to the Signaling Server (SS) code, load in a config.json file for the MM parameters
const argv = require("yargs").argv;

var configFile =
  typeof argv.configFile != "undefined"
    ? argv.configFile.toString()
    : ".\\config.json";
// console.log(`configFile ${configFile}`);
const config = require("./modules/config.js").init(configFile, defaultConfig);
// console.log("Config: " + JSON.stringify(config, null, "\t"));

const express = require("express");
var cors = require("cors");
const app = express();
const http = require("http").Server(app);
const fs = require("fs");
const path = require("path");
const logging = require("./modules/logging.js");
logging.RegisterConsoleLogger();
const maxLoginNum = 1;
if (config.LogToFile) {
  logging.RegisterFileLogger("./logs");
}

// A list of all the Cirrus server which are connected to the Matchmaker.
var cirrusServers = new Map();

//
// Parse command line.
//

if (typeof argv.HttpPort != "undefined") {
  config.HttpPort = argv.HttpPort;
}
if (typeof argv.MatchmakerPort != "undefined") {
  config.MatchmakerPort = argv.MatchmakerPort;
}

http.listen(config.HttpPort, () => {
  console.log("HTTP 侦听端口:" + config.HttpPort);
});

if (config.UseHTTPS) {
  //HTTPS certificate details
  const options = {
    key: fs.readFileSync(path.join(__dirname, "./certificates/client-key.pem")),
    cert: fs.readFileSync(
      path.join(__dirname, "./certificates/client-cert.pem")
    ),
  };

  var https = require("https").Server(options, app);

  //Setup http -> https redirect
  console.log("Redirecting http->https");
  app.use(function (req, res, next) {
    if (!req.secure) {
      if (req.get("Host")) {
        var hostAddressParts = req.get("Host").split(":");
        var hostAddress = hostAddressParts[0];
        if (httpsPort != 443) {
          hostAddress = `${hostAddress}:${httpsPort}`;
        }
        return res.redirect(
          ["https://", hostAddress, req.originalUrl].join("")
        );
      } else {
        console.error(
          `unable to get host name from header. Requestor ${
            req.ip
          }, url path: '${req.originalUrl}', available headers ${JSON.stringify(
            req.headers
          )}`
        );
        return res.status(400).send("Bad Request");
      }
    }
    next();
  });

  https.listen(443, function () {
    console.log("Https listening on 443");
  });
}

// No servers are available so send some simple JavaScript to the client to make
// it retry after a short period of time.
function sendRetryResponse(res) {
  var sers = [];
  cirrusServers.forEach((value, key) => {
    sers.push(value);
  });
  res.send(`<html><body>
  <div>共 ${
    cirrusServers.size
  } 台服务器开启。单台最大允许访问人数：${maxLoginNum}。将在 <span id="countdown">10</span> 秒后刷新。</div>
  <div id="serve">
  ${sers.map((val, index) => {
    // let html = val.ready
    //   ? `<br /> <a href= 'http://${
    //       !val.url ? val.address + ":" + val.port : val.url
    //     }'> 推流服务器 ${index + 1} （点击进入）</a>`
    //   : ` <br /> 服务器 ${index + 1} 未开启推流 `;
    let html = val.ready
      ? `<br /> 服务器 ${index + 1} 当前登录用户：${
          val.name || ""
        }<a class="link" href="javascript:kick(${true},'${val.address}','${
          val.port
        }','${val.name}')">(踢出)</a> `
      : `<br /> 服务器 ${index + 1} 未开启推流 `;
    return html;
  })}
  </div>
  </body></html>
  <style>
  body{
    margin-top:calc(100vh / 2);
    background:#000;
    color:#fff;
    font-size:14px;
    text-align:center;
  }
  p{
    height:20px;
    line-height:20px;
  }
  a{
    color:#fff;
  }
  </style>
	<script>
  var isAdmin = getUrlParams(window.location.href).admin || false;
  function getUrlParams(url) {
    let urlStr = url.split("?")[1] || "";
    let obj = {};
    let paramsArr = urlStr.split("&");
    for (let i = 0, len = paramsArr.length; i < len; i++) {
      let arr = paramsArr[i].split("=");
      obj[arr[0]] = arr[1];
    }
    return obj;
  }
  function kick(boss,address,port,name){
    if(isAdmin && isAdmin === 'boss'){
      if(boss){
        fetch('http://' + address + ':' + port + '/kick?n=' + name).then(res=>{          
          return res.json()
        }).then(res=>{
          console.log(res)
          if(res.suc){
            countdown = 3
          }
        })
        // alert('已销户！')        
        // window.location.reload(1);
      }
    }else{
      alert('无权限！')
    }
  }
		var countdown = document.getElementById("countdown").textContent;
		var link = document.querySelectorAll("a.link");
    link.forEach((item)=>{
      item.style.display = isAdmin ? 'inline-block' : 'none'
    })
		setInterval(function() {      
			countdown--;
			if (countdown == 0) {
				window.location.reload(1);
			} else {
				document.getElementById("countdown").textContent = countdown;
			}
		}, 1000);

	</script>`);
}

// Get a Cirrus server if there is one available which has no clients connected.
function getAvailableCirrusServer() {
  for (cirrusServer of cirrusServers.values()) {
    if (cirrusServer.numConnectedClients === 0 && cirrusServer.ready === true) {
      // Check if we had at least 45 seconds since the last redirect, avoiding the
      // chance of redirecting 2+ users to the same SS before they click Play.
      if (cirrusServer.lastRedirect) {
        if ((Date.now() - cirrusServer.lastRedirect) / 1000 < 45) continue;
      }
      cirrusServer.lastRedirect = Date.now();

      return cirrusServer;
    }
  }

  console.log("WARNING: No empty Cirrus servers are available");
  return undefined;
}

if (enableRESTAPI) {
  // Handle REST signalling server only request.
  app.options("/signallingserver", cors());
  app.get("/signallingserver", cors(), (req, res) => {
    cirrusServer = getAvailableCirrusServer();
    if (cirrusServer != undefined) {
      res.json({
        signallingServer: `${cirrusServer.address}:${cirrusServer.port}`,
      });
      console.log(`Returning ${cirrusServer.address}:${cirrusServer.port}`);
    } else {
      res.json({
        signallingServer: "",
        error: "No signalling servers available",
      });
    }
  });
}

if (enableRedirectionLinks) {
  // Handle standard URL.
  app.get("/", (req, res) => {
    cirrusServer = getAvailableCirrusServer();
    if (cirrusServer != undefined) {
      res.redirect(
        `http://${
          cirrusServer.url || cirrusServer.address + ":" + cirrusServer.port
        }/#/?ue=lwx`
      );
      //console.log(req);
      console.log(`Redirect to ${cirrusServer.address}:${cirrusServer.port}`);
    } else {
      sendRetryResponse(res);
    }
  });

  // Handle URL with custom HTML.
  app.get("/custom_html/:htmlFilename", (req, res) => {
    cirrusServer = getAvailableCirrusServer();
    if (cirrusServer != undefined) {
      res.redirect(
        `http://${cirrusServer.address}:${cirrusServer.port}/custom_html/${req.params.htmlFilename}`
      );
      console.log(`Redirect to ${cirrusServer.address}:${cirrusServer.port}`);
    } else {
      sendRetryResponse(res);
    }
  });
}

//
// Connection to Cirrus.
//

const net = require("net");

function disconnect(connection) {
  console.log(`正在结束与远程地址的连接 ${connection.remoteAddress}`);
  connection.end();
}

const matchmaker = net.createServer((connection) => {
  connection.on("data", (data) => {
    try {
      message = JSON.parse(data);

      if (message) console.log(`消息类型: ${message.type}`);
    } catch (e) {
      console.log(
        `ERROR (${e.toString()}): Failed to parse Cirrus information from data: ${data.toString()}`
      );
      disconnect(connection);
      return;
    }
    if (message.type === "connect") {
      // A Cirrus server connects to this Matchmaker server.
      console.log(JSON.stringify(message));
      cirrusServer = {
        address: message.address,
        port: message.port,
        numConnectedClients: 0,
        lastPingReceived: Date.now(),
        url: message.url,
      };
      cirrusServer.ready = message.ready === true;

      // Handles disconnects between MM and SS to not add dupes with numConnectedClients = 0 and redirect users to same SS
      // Check if player is connected and doing a reconnect. message.playerConnected is a new variable sent from the SS to
      // help track whether or not a player is already connected when a 'connect' message is sent (i.e., reconnect).
      if (message.playerConnected == true) {
        cirrusServer.numConnectedClients = 1;
      }

      // Find if we already have a ciruss server address connected to (possibly a reconnect happening)
      let server = [...cirrusServers.entries()].find(
        ([key, val]) =>
          val.address === cirrusServer.address && val.port === cirrusServer.port
      );

      // if a duplicate server with the same address isn't found -- add it to the map as an available server to send users to.
      if (!server || server.size <= 0) {
        console.log(
          `正在加入连接 ${cirrusServer.address.split(".")[0]} 用户: ${
            message.playerConnected
          }`
        );
        cirrusServers.set(connection, cirrusServer);
      } else {
        console.log(
          `RECONNECT: cirrus server address ${
            cirrusServer.address.split(".")[0]
          } already found--replacing. playerConnected: ${
            message.playerConnected
          }`
        );
        var foundServer = cirrusServers.get(server[0]);

        // Make sure to retain the numConnectedClients from the last one before the reconnect to MM
        if (foundServer) {
          cirrusServers.set(connection, cirrusServer);
          console.log(
            `Replacing server with original with numConn: ${cirrusServer.numConnectedClients}`
          );
          cirrusServers.delete(server[0]);
        } else {
          cirrusServers.set(connection, cirrusServer);
          console.log("Connection not found in Map() -- adding a new one");
        }
      }
    } else if (message.type === "streamerConnected") {
      // The stream connects to a Cirrus server and so is ready to be used
      cirrusServer = cirrusServers.get(connection);
      if (cirrusServer) {
        cirrusServer.ready = true;
        console.log(
          `服务器： ${cirrusServer.address}:${cirrusServer.port} 已准备完毕`
        );
      } else {
        disconnect(connection);
      }
    } else if (message.type === "streamerDisconnected") {
      // The stream connects to a Cirrus server and so is ready to be used
      cirrusServer = cirrusServers.get(connection);
      if (cirrusServer) {
        cirrusServer.ready = false;
        console.log(
          `服务器 ${cirrusServer.address}:${cirrusServer.port} 未准备好`
        );
      } else {
        disconnect(connection);
      }
    } else if (message.type === "clientConnected") {
      // A client connects to a Cirrus server.
      cirrusServer = cirrusServers.get(connection);
      if (cirrusServer) {
        cirrusServer.numConnectedClients++;
        console.log(
          `客户端连接到服务器： ${cirrusServer.address}:${cirrusServer.port}`
        );
      } else {
        disconnect(connection);
      }
    } else if (message.type === "clientDisconnected") {
      // A client disconnects from a Cirrus server.
      cirrusServer = cirrusServers.get(connection);
      if (cirrusServer) {
        cirrusServer.numConnectedClients--;
        console.log(
          `客户端断开服务器连接 ${cirrusServer.address}:${cirrusServer.port}`
        );
      } else {
        disconnect(connection);
      }
    } else if (message.type === "player") {
      cirrusServer = cirrusServers.get(connection);
      if (cirrusServer) {
        cirrusServer.name = message.loginInfo;
        // cirrusServer.id = message.loginInfo;
        // console.log(`userId：${cirrusServer.id}`);
      }
    } else if (message.type === "ping") {
      cirrusServer = cirrusServers.get(connection);
      if (cirrusServer) {
        cirrusServer.lastPingReceived = Date.now();
      } else {
        disconnect(connection);
      }
    } else {
      console.log("ERROR: Unknown data: " + JSON.stringify(message));
      disconnect(connection);
    }
  });

  // A Cirrus server disconnects from this Matchmaker server.
  connection.on("error", () => {
    cirrusServer = cirrusServers.get(connection);
    if (cirrusServer) {
      cirrusServers.delete(connection);
      console.log(
        // `Cirrus server ${cirrusServer.address}:${cirrusServer.port} disconnected from Matchmaker`
        `服务器 ${cirrusServer.Name} 从Matchmaker断开`
      );
    } else {
      console.log(
        `Disconnected machine that wasn't a registered cirrus server, remote address: ${connection.remoteAddress}`
      );
    }
  });
});

matchmaker.listen(config.MatchmakerPort, () => {
  console.log("Matchmaker侦听端口:" + config.MatchmakerPort);
});
