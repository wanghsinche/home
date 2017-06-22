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
        url: __uri('../../img/cube/px.jpg'),
        length: 1024,
        position: [-512, 0, 0],
        rotation: [0, Math.PI / 2, 0]
    }, {
        url: __uri('../../img/cube/nx.jpg'),
        length: 1024,
        position: [512, 0, 0],
        rotation: [0, -Math.PI / 2, 0]
    }, {
        url: __uri('../../img/cube/py.jpg'),
        length: 1024,
        position: [0, 512, 0],
        rotation: [Math.PI / 2, 0, Math.PI]
    }, {
        url: __uri('../../img/cube/ny.jpg'),
        length: 1024,
        position: [0, -512, 0],
        rotation: [-Math.PI / 2, 0, Math.PI]
    }, {
        url: __uri('../../img/cube/pz.jpg'),
        length: 1024,
        position: [0, 0, 512],
        rotation: [0, Math.PI, 0]
    }, {
        url: __uri('../../img/cube/nz.jpg'),
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
            __uri('../lib/DeviceOrientationControls.js'),
            __uri('../lib/CSS3DRenderer.js')
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
        tjs.src = __uri('../lib/three.min.js');
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
});