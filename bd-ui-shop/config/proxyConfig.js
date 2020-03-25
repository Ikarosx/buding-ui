// let ApiBaseURL = 'https://easy-mock.com/mock/59802015a1d30433d84f1a02/v1'
// let ApiBaseURL = 'http://plab.itcast.cn:7999'
// let ApiBaseURL = 'http://dev.plab.itcast.cn:7999'
module.exports = {
  proxyList: {
    "/api/oauth": {
      target: "http://budingcc.cn:40000",
      pathRewrite: {
        "^/api/oauth": ""
      }
    },
    "/api/school": {
      target: "http://budingcc.cn:40100",
      pathRewrite: {
        "^/api": ""
      }
    },
    "/api/category": {
      target: "http://budingcc.cn:31001",
      pathRewrite: {
        "^/api": ""
      }
    },
    "/api/good": {
      target: "http://budingcc.cn:31001",
      pathRewrite: {
        "^/api": ""
      }
    },
    "/api/search": {
      target: "http://budingcc.cn:31000",
      pathRewrite: {
        "^/api/search": "es"
      }
    },
    "/api/es": {
      target: "http://budingcc.cn:31000",
      pathRewrite: {
        "^/api/": ""
      }
    },
    "/api/filesystem": {
      target: "http://budingcc.cn:30000",
      pathRewrite: {
        "^/api": ""
      }
    }
  }
};
