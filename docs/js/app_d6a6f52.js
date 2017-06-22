// 所有模块都通过 define 来定义
define('loader', function(require, exports, module) {
  'use strict';
  // 通过 require 引入依赖
  var resls = [];
  // 通过 exports 对外提供接口
  exports.init = function(opts) {
    var loaderEle, app;
    opts = opts || {};
    opts.loaderEle = opts.loaderEle || 'loader';
    opts.app = opts.app || 'app';
    loaderEle = document.getElementById(opts.loaderEle);
    app = document.getElementById(opts.app);
    loaderEle.style.display = loaderEle.style.display === 'none' ? 'block' : loaderEle.style.display;
    app.style.display = 'none';


    var counter = 0,
      tmpscr = null;
    if (resls.length > 0) {
      resls.forEach(function(link) {
        tmpscr = document.createElement('img');
        tmpscr.onload = function() {
          counter++;
          if (counter === resls.length) {
            allloaded();
          }
        };
        tmpscr.src = link;
      });
    } else {
      allloaded();
    }

    function allloaded() {
      loaderEle.className += 'animated zoomOut';
      loaderEle.addEventListener('webkitAnimationEnd', function cb() {
        loaderEle.style.display = 'none';
        app.style.display = 'block';
        loaderEle.removeEventListener('webkitAnimationEnd', cb);
      }); //  Chrome, Safari 和 Opera
      loaderEle.addEventListener('animationend', function cb() {
        loaderEle.style.display = 'none';
        app.style.display = 'block';
        loaderEle.removeEventListener('animationend', cb);
      }); // 标准语法

      if (typeof opts.CB === 'function') {
        opts.CB();
      }

    }
    exports.load = function(ls) {
      resls = ls;
    };
  };
});;
define('vr', function(require, exports, module) {
    var camera, scene, renderer, cssrender, cssscene, texture_placeholder;
    var elels, elelsinfo = [];
    var controls, target;
    var lon = 90,
        lat = 0,
        phi = 0,
        theta = 0;
    var touchX, touchY;
    var deviceOn = false,
        stopAni = false;
    var sides = [{
        url: 'https://wanghsinche.github.io/home//img/cube/px_304901d.jpg',
        length: 1024,
        position: [-512, 0, 0],
        rotation: [0, Math.PI / 2, 0]
    }, {
        url: 'https://wanghsinche.github.io/home//img/cube/nx_37c50a0.jpg',
        length: 1024,
        position: [512, 0, 0],
        rotation: [0, -Math.PI / 2, 0]
    }, {
        url: 'https://wanghsinche.github.io/home//img/cube/py_a7ac7c1.jpg',
        length: 1024,
        position: [0, 512, 0],
        rotation: [Math.PI / 2, 0, Math.PI]
    }, {
        url: 'https://wanghsinche.github.io/home//img/cube/ny_557a926.jpg',
        length: 1024,
        position: [0, -512, 0],
        rotation: [-Math.PI / 2, 0, Math.PI]
    }, {
        url: 'https://wanghsinche.github.io/home//img/cube/pz_b267e4b.jpg',
        length: 1024,
        position: [0, 0, 512],
        rotation: [0, Math.PI, 0]
    }, {
        url: 'https://wanghsinche.github.io/home//img/cube/nz_d59231f.jpg',
        length: 1024,
        position: [0, 0, -512],
        rotation: [0, 0, 0]
    }];


    //@params [{className:'...',id:'..',position:[0,0,100],rotation:[0,0,0]:cb:function(){}}]
    function loadClickEles(arg) {
        elelsinfo = arg;
    }

    function lookAtOri(pos) {
        var rot = [0, 0, 0];
        var minor = 0;

        var x = pos[0],
            y = pos[1],
            z = pos[2];
        //坐标系很奇怪，算不出来，干脆不算了
        minor = x*x+z*z;
        if(minor === 0){
            if(y>0){
                rot[0] = -Math.PI/2;
            }
            else{
                rot[0] = Math.PI/2;
            }
        }
        else{
            rot[0] = -Math.atan(y/Math.sqrt(minor));
        }

        if (x === 0) {
            if (z > 0) {
                rot[1] = -90;
            } else {
                rot[1] = 90;
            }

        } else {
            rot[1] = Math.PI/2-Math.atan(z / x);
        }

        return rot;
    }

    function createClickEles() {
        var elels = [],
            icon, iconChild, i, ele, arg = elelsinfo;
        for (i = 0; i < arg.length; i++) {
            ele = arg[i];
            ele.position = ele.position || [0, 0, 100];
            ele.rotation = ele.rotation || [0, 0, 0];

            icon = document.createElement('div');
            icon.id = ele.id || 'vrele-' + Math.random().toFixed(4);
            icon.className = ele.className || 'vrele';
            iconChild = document.createElement('div');
            iconChild.className = 'vrchild';
            icon.appendChild(iconChild);
            // icon.textContent = 'L';
            // icon.fontSize = '32px';
            if (typeof ele.cb === 'function') {
                icon.addEventListener('touchend', ele.cb);
            }

            elels.push({
                ele: icon,
                position: ele.position,
                rotation: ele.rotation
            });
        }


        return elels;
    }

    function loadThreeJS(cb) {
        var tjs = document.createElement('script');
        var tjsPlugins = [
            'https://wanghsinche.github.io/home//js/lib/DeviceOrientationControls_781a9e5.js',
            'https://wanghsinche.github.io/home//js/lib/CSS3DRenderer_ecc218f.js'
        ];
        tjs.onload = function() {
            var counter = 0,
                tmpscr = null;
            tjsPlugins.forEach(function(link) {
                tmpscr = document.createElement('script');
                tmpscr.onload = function() {
                    counter++;
                    if (counter === tjsPlugins.length && typeof cb === 'function') {
                        cb();
                    }
                };
                tmpscr.src = link;
                document.getElementsByTagName('body')[0].appendChild(tmpscr);
            });
        };
        tjs.src = 'https://wanghsinche.github.io/home//js/lib/three.min_422afa7.js';
        document.getElementsByTagName('body')[0].appendChild(tjs);
    }

    function loadTexture(path) {
        var texture = new THREE.Texture(texture_placeholder);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            overdraw: 0.5
        });
        var image = new Image();
        image.crossOrigin = '';
        image.onload = function() {
            texture.image = this;
            texture.needsUpdate = true;
        };
        image.src = path;
        return material;
    }

    function init(ID) {

        var i;
        target = new THREE.Vector3();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
        controls = new THREE.DeviceOrientationControls(camera);
        scene = new THREE.Scene();
        cssscene = new THREE.Scene();
        //create screen
        texture_placeholder = document.createElement( 'canvas' );
        texture_placeholder.width = 1024;
        texture_placeholder.height = 1024;
        var context = texture_placeholder.getContext( '2d' );
        context.fillStyle = 'rgb( 200, 200, 200 )';
        context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );

        var materials = [
            loadTexture(sides[0].url), // right
            loadTexture(sides[1].url), // left
            loadTexture(sides[2].url), // top
            loadTexture(sides[3].url), // bottom
            loadTexture(sides[4].url), // back
            loadTexture(sides[5].url) // front
        ];
        var mesh = new THREE.Mesh(new THREE.BoxGeometry(1024, 1024, 1024, 1, 1, 1), materials);
        mesh.scale.x = -1;
        scene.add(mesh);


        // clickable elements
        elels = createClickEles();
        var tmpobj = null;
        for (i = 0; i < elels.length; i++) {
            tmpobj = new THREE.CSS3DObject(elels[i].ele);
            tmpobj.position.fromArray(elels[i].position);
            tmpobj.rotation.fromArray(elels[i].rotation);
            cssscene.add(tmpobj);
        }


        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.zIndex = 1;
        cssrender = new THREE.CSS3DRenderer();
        cssrender.setSize(window.innerWidth, window.innerHeight);
        cssrender.domElement.style.position = 'absolute';
        cssrender.domElement.style.top = 0;
        cssrender.domElement.style.zIndex = 2;
        document.getElementById(ID).appendChild(renderer.domElement);
        document.getElementById(ID).appendChild(cssrender.domElement);
        document.getElementById(ID).addEventListener('touchstart', onDocumentTouchStart, false);
        document.getElementById(ID).addEventListener('touchmove', onDocumentTouchMove, false);
        window.addEventListener('resize', onWindowResize, false);
        animate();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentTouchStart(event) {
        event.preventDefault();
        var touch = event.touches[0];
        touchX = touch.screenX;
        touchY = touch.screenY;
    }

    function onDocumentTouchMove(event) {
        event.preventDefault();
        var touch = event.touches[0];
        lon -= (touch.screenX - touchX) * 0.1;
        lat += (touch.screenY - touchY) * 0.1;
        touchX = touch.screenX;
        touchY = touch.screenY;
    }


    function animate() {

        requestAnimationFrame(animate);
        if (stopAni) {
            return;
        } else {
            // lon +=  0.1;
            if (deviceOn) {
                controls.update();
            } else {
                lat = Math.max(-85, Math.min(85, lat));
                phi = THREE.Math.degToRad(90 - lat);
                theta = THREE.Math.degToRad(lon);
                target.x = Math.sin(phi) * Math.cos(theta);
                target.y = Math.cos(phi);
                target.z = Math.sin(phi) * Math.sin(theta);
                camera.lookAt(target);
            }
            renderer.render(scene, camera);
            cssrender.render(cssscene, camera);
        }


    }

    function stopAnimation() {
        stopAni = true;

    }

    function playAnimation() {
        stopAni = false;
    }


    function toggleDevice() {
        deviceOn = !deviceOn;
        if (deviceOn) {
            controls.connect();
        } else {
            controls.disconnect();
        }
        return deviceOn;
    }

    module.exports = {
        loadThreeJS: loadThreeJS,
        init: init,
        stopAnimation: stopAnimation,
        playAnimation: playAnimation,
        toggleDevice: toggleDevice,
        loadClickEles: loadClickEles,
        getDeviceState: function() {
            return deviceOn;
        },
        lookAtOri: lookAtOri
    };
});;

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