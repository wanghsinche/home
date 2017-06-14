  // Set configuration
  seajs.config({
    base: './js/',
    //设置路径
    paths: {
        'cdn': 'https://cdn.bootcss.com'
    },

    // 设置别名，方便调用   
    alias: {
      'jquery': 'cdn/jquery/3.2.1/jquery.min.js'
    },
    preload: ["jquery"]
  });


    seajs.use('app',function(app){
        app.doSomething();
    });
