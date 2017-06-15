define('cube',function(require, exports, module) {
	'use strict';
var camera, scene, renderer;

			var mesh;

			var	texture_placeholder = document.createElement( 'canvas' );

			init();

			animate();

			function loadTexture( path ) {



				var texture = new THREE.Texture( texture_placeholder );

				var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );



				var image = new Image();

				image.onload = function () {



					texture.image = this;

					texture.needsUpdate = true;



				};

				image.src = path;



				return material;



			}

			function getMaterials(){
				var materials = [];
				var tmp;
				for(var i =0; i< 6; i++){
					// tmp =  loadTexture( __uri('../../img/crate.gif') );
					tmp = new THREE.MeshBasicMaterial( { color:  Math.random()* 0xffffff , overdraw: 0.5} );
					materials.push(tmp);
				}
				return materials;
			}

			function init() {



				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );

				camera.position.z = 400;



				scene = new THREE.Scene();






				var geometry = new THREE.BoxGeometry( 200, 200, 200 );
				var material = getMaterials();
				mesh = new THREE.Mesh( geometry, material );


				var geometry2 = new THREE.PlaneGeometry( 200, 200 );
				geometry2.rotateX( - Math.PI / 3 );
				geometry2.translate ( 0, -200, 0 );
				var material2 = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );
				var plane = new THREE.Mesh( geometry2, material2 );


				scene.add( plane );
				scene.add( mesh );



				renderer = new THREE.WebGLRenderer();

				renderer.setPixelRatio( window.devicePixelRatio );

				renderer.setSize( window.innerWidth, window.innerHeight );

				document.getElementById('app').appendChild( renderer.domElement );



				//



				window.addEventListener( 'resize', onWindowResize, false );



			}



			function onWindowResize() {



				camera.aspect = window.innerWidth / window.innerHeight;

				camera.updateProjectionMatrix();



				renderer.setSize( window.innerWidth, window.innerHeight );



			}



			function animate() {



				requestAnimationFrame( animate );



				mesh.rotation.x += 0.005;

				mesh.rotation.y += 0.01;
				if (mesh.rotation.x > Math.PI*2) {
					mesh.rotation.x = 0;
				}
				if (mesh.rotation.y > Math.PI*2) {
					mesh.rotation.y = 0;
				}				


				renderer.render( scene, camera );



			}
});