var proxyConfig = require("./config/proxyConfig");
module.exports = {
  transpileDependencies: ["vuetify"],

  devServer: {
    // proxy: proxyConfig.proxyList,
    host: "budingcc.cn",
    port: 13000
  }
};
