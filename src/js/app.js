__inline('./module/loader.js');
__inline('./module/cube.js');

// 所有模块都通过 define 来定义
(function(require, $) {
	'use strict';
  // 通过 require 引入依赖
  var loader = require('loader');
  var cube = require('cube');
  loader.init({
  	CB:function(){
  		console.log($);
  	}
  });
  // 通过 exports 对外提供接口
  // exports.doSomething = function(){

  // };

})(require, $);