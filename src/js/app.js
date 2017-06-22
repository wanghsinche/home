__inline('./module/loader.js');
__inline('./module/vr.js');

// 所有模块都通过 define 来定义
(function(require, $) {
  'use strict';
  // 通过 require 引入依赖
  var loader = require('loader');
  var vr = require('vr');
  loader.load([
       __uri('../img/cube/px.jpg'),
       __uri('../img/cube/nx.jpg'),
       __uri('../img/cube/py.jpg'),
       __uri('../img/cube/ny.jpg'),
       __uri('../img/cube/pz.jpg'),
       __uri('../img/cube/nz.jpg')
    ]);
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
      position: [0, 100, 200],
      rotation: [0, Math.PI / 2, 0], //vr.lookAtOri([-450, -110, 10]),
      cb: function() {
        alert('css渲染元素');
      }
    }, {
      //鼓
      className: 'vrclickele',
      id: 'vrele1',
      position: [0, 0, -200],
      rotation: [0, 0, 0], //vr.lookAtOri([-120, -100, 400]),
      cb: function() {
        alert('css渲染元素');
      }
    }, {
      //桌
      className: 'vrclickele',
      id: 'vrele2',
      position: [400, 0, 0],
      rotation: [0, Math.PI / 2, 0], //vr.lookAtOri([-350, -0, 400]),//[0,Math.PI/6,0],
      cb: function() {
        alert('css渲染元素');
      }
    }, {
      //琴
      className: 'vrclickele',
      id: 'vrele3',
      position: [-120, 0, 0],
      rotation: [0, -Math.PI / 2, 0], //vr.lookAtOri([-120, -100, 400]),
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


})(require, $);