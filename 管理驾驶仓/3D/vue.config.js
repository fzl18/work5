const path = require("path");
const resolve = (dir) => {
  return path.join(__dirname, dir);
};
let proxyURL = process.env.VUE_APP_URL || `https://home.boton-tech.com/`;
let proxy = {
  "/frame": {
    target: proxyURL,
    // target: `https://home.boton-tech.com`,
    changeOrigin: true,
    // pathRewrite: {
    //   '/login': '',
    // },
  },

  "/base": {
    target: proxyURL,
    // target: `https://home.boton-tech.com`,
    changeOrigin: true,
    // pathRewrite: {
    //   ['^' + baseURL]: '',
    // },
  },
  "/framework": {
    target: proxyURL,
    // target: `https://home.boton-tech.com`,
    // pathRewrite: {
    //   '/api/admin': '',
    // },
    // cookiePathRewrite: {
    //   '/framework/': '/api',
    // },
  },
  "/api/admin": {
    target: proxyURL + "/framework/system",
    // target: `https://home.boton-tech.com` + "/framework/system",
    pathRewrite: {
      "/api/admin": "/",
    },
    cookiePathRewrite: {
      "/framework/": "/api",
    },
  },
  "/project": {
    target: proxyURL,
    // target: `https://home.boton-tech.com`,
    changeOrigin: true,
  },
  "/cockpit-api/chart": {
    target: proxyURL, //proxyURL,
    pathRewrite: {
      "/cockpit-api/chart": "/cockpit-api/chart",
    },
    changeOrigin: true,
  },
  "/cockpit-api/config": {
    target: proxyURL, //proxyURL,
    pathRewrite: {
      "/cockpit-api/config": "/cockpit-api/config",
    },
    changeOrigin: true,
  },
  "/cockpit-api/monitor": {
    target: proxyURL, //proxyURL,
    pathRewrite: {
      "/cockpit-api/monitor": "/cockpit-api/monitor",
    },
    changeOrigin: true,
  },
  "/am-app-api-mobile/dash": {
    target: proxyURL, //proxyURL,
    pathRewrite: {
      "/am-app-api-mobile/dash": "/am-app-api-mobile/dash",
    },
    changeOrigin: true,
  },
  "/staticfiles": {
    target: proxyURL,
    pathRewrite: {
      "/staticfiles": "/staticfiles",
    },
    changeOrigin: true,
  },
};
module.exports = {
  publicPath: "./",
  devServer: {
    hot: true,
    port: "8080",
    open: false,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy,
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("_c", resolve("src/components")); // key,value自行定义，比如.set('@@', resolve('src/components'))
  },
};
