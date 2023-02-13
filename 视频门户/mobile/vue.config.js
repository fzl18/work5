const proxyURL = `https://uatportal.boton-tech.com/`;
// const proxyURL = `http://10.11.0.169:8431/maccess/`;
const baseURL = `/video/`;

module.exports = {
  publicPath: "/videoPortal/mobile",
  devServer: {
    hot: true,
    port: 8080,
    open: true,
    noInfo: false,
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    // 前端配置反向代理访问后端接口
    proxy: {
      [baseURL]: {
        target: proxyURL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          ["^" + baseURL]: "",
        },
      },
    },
  },
  configureWebpack: {
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  },
};
