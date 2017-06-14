// 所有模块都通过 define 来定义
define(function(require, exports, module) {
	'use strict';
  // 通过 require 引入依赖
  var resls = [];
  // 通过 exports 对外提供接口
  exports.init = function(opts){
  	var loaderEle, app;
  	opts = opts||{};
  	opts.loaderEle = opts.loaderEle || 'loader';
  	opts.app = opts.app || 'app';
  	loaderEle = document.getElementById(opts.loaderEle);
  	app = document.getElementById(opts.app);
  	loaderEle.style.display = loaderEle.style.display === 'none'?'block':loaderEle.style.display;
  	app.style.display = 'none';
  	setTimeout(function(){
	  	loaderEle.style.display = 'none';
	  	app.style.display = 'block';
	  	if(typeof opts.CB === 'function'){
	  		opts.CB();
	  	}
  	},3000);

  };
  exports.load = function(ls){
    resls = ls;
  };


});