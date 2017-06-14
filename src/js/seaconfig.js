  // Set configuration
  seajs.config({
    //设置路径
    paths: {
        'cdn': 'https://cdn.bootcss.com'
    },

    // 设置别名，方便调用   
    alias: {
      '$': 'cdn/zepto/1.0rc1/zepto.min.js',
      'app': __uri('./app.js'),
      'loader': __uri('./module/loader.js')
    },
    preload: ["$"]
  });

    seajs.use(['$','app']);
