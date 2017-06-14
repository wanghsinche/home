// 所有模块都通过 define 来定义
define('app',function(require, exports, module) {
	'use strict';
  // 通过 require 引入依赖
  var loader = require('module/loader');

  loader.init({
  	CB:function(){
  		console.log('done');
  	}
  });
  console.log($);
  // 通过 exports 对外提供接口
  // exports.doSomething = function(){

  // };


});