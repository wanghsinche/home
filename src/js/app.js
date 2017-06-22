__inline('./module/loader.js');
__inline('./module/vr.js');

// 所有模块都通过 define 来定义
(function(require, $) {
  'use strict';
  // 通过 require 引入依赖
  var loader = require('loader');
  var vr = require('vr');
  loader.init({
    CB: function() {
      console.log($);
    }
  });
  vr.loadThreeJS(function() {
    vr.loadClickEles([{
      //首饰
      className: 'vrclickele',
      id: 'vrele0',
      position: [-450, -110, 20],
      rotation: [0, Math.PI / 2, 0], //vr.lookAtOri([-450, -110, 10]),
      cb: function() {
        alert('css渲染元素');
      }
    }, {
      //鼓
      className: 'vrclickele',
      id: 'vrele1',
      position: [-80, -100, 400],
      rotation: [0, 0, 0], //vr.lookAtOri([-120, -100, 400]),
      cb: function() {
        alert('css渲染元素');
      }
    }, {
      //桌
      className: 'vrclickele',
      id: 'vrele2',
      position: [0, -100, -400],
      rotation: [0, 0, 0], //vr.lookAtOri([-350, -0, 400]),//[0,Math.PI/6,0],
      cb: function() {
        alert('css渲染元素');
      }
    }, {
      //琴
      className: 'vrclickele',
      id: 'vrele3',
      position: [-120, -200, 450],
      rotation: [0, -Math.PI / 18, 0], //vr.lookAtOri([-120, -100, 400]),
      cb: function() {
        alert('css渲染元素');
      }
    }]);
    try {
      vr.init('vrbox');
    } catch (e) {
      alert('该浏览器不支持threejs，请换个浏览器打开');
    }

    vr.toggleDevice();
  });

  // 通过 exports 对外提供接口
  // exports.doSomething = function(){

  // };

})(require, $);