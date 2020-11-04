var proxyConfig = require("./config/proxyConfig");
module.exports = {
  transpileDependencies: ["vuetify"],

  devServer: {
    // proxy: proxyConfig.proxyList,
    disableHostCheck: true,
    host: "budingcc.cn",
    port: 13000
  }
};
