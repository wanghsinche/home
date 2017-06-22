define('cube', function(require, exports, module) {
	'use strict';
	var camera, scene, renderer;

	var mesh;

	var texture_placeholder = document.createElement('canvas');

	init();

	animate();

	function loadTexture(path) {



		var texture = new THREE.Texture(texture_placeholder);

		var material = new THREE.MeshBasicMaterial({
			map: texture,
			overdraw: 0.5
		});



		var image = new Image();

		image.onload = function() {



			texture.image = this;

			texture.needsUpdate = true;



		};

		image.src = path;



		return material;



	}

	function getMaterials() {
		var materials = [];
		var tmp;
		for (var i = 0; i < 6; i++) {
			// tmp =  loadTexture( __uri('../../img/crate.gif') );
			tmp = new THREE.MeshBasicMaterial({
				color: Math.random() * 0xffffff,
				overdraw: 0.5
			});
			materials.push(tmp);
		}
		return materials;
	}

	exports.init = function init(ID) {
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.z = 400;
		scene = new THREE.Scene();
		var geometry = new THREE.BoxGeometry(100, 100, 100);
		var material = getMaterials();
		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
		renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();

		// renderer = new THREE.WebGLRenderer();

		renderer.setPixelRatio(window.devicePixelRatio);

		renderer.setSize(window.innerWidth, window.innerHeight);

		document.getElementById('ID').appendChild(renderer.domElement);



		//



		window.addEventListener('resize', onWindowResize, false);



	}



	function onWindowResize() {



		camera.aspect = window.innerWidth / window.innerHeight;

		camera.updateProjectionMatrix();



		renderer.setSize(window.innerWidth, window.innerHeight);



	}



	function animate() {



		requestAnimationFrame(animate);



		mesh.rotation.x += 0.005;

		mesh.rotation.y += 0.01;
		if (mesh.rotation.x > Math.PI * 2) {
			mesh.rotation.x = 0;
		}
		if (mesh.rotation.y > Math.PI * 2) {
			mesh.rotation.y = 0;
		}


		renderer.render(scene, camera);



	}
});