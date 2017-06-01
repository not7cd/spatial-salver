if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, controls, scene, renderer, cube, line, normal, plane, ellipse, ellipse2, group, gyro, thats = [], constScale;

init();
animate();

function init() {
				normal = new THREE.Vector3(0,1,0);
				constScale = new THREE.Vector3(1,1,1);

				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0xefefefe, 0.1 );

				renderer = new THREE.WebGLRenderer({ antialiasing: true });
			  renderer.setClearColor( scene.fog.color );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				var container = document.getElementById( 'container' );
				container.appendChild( renderer.domElement );

        camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
				camera.position.copy(new THREE.Vector3(0.0,0.0,0.001));
				scene.add( camera );

				camera.plane = new THREE.Plane(new THREE.Vector3( 0, 1, 0 ), 0);
				camera.add(camera.plane);

				controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI / 2;
				controls.minZoom = 0.01;

				// world
				plane = new THREE.Plane(normal, 0);

				loadData();

				for (var i = 0; i < data.length; i++) {
					thats[i] = initThat();
					thats[i].position.set( 	data[i].x/10,
					 												data[i].y/10,
					  											data[i].z/10
																);
					scene.add( thats[i] );
				}

				//controls.autoRotate = true;


				// --------------------------------------
				var material = new THREE.LineBasicMaterial({	color: 0x333333	});
				var curve = new THREE.EllipseCurve(	0, 0, 300, 300, 0, 2 * Math.PI );

				var path = new THREE.Path( curve.getPoints( 50 ) );
				var geometry = path.createPointsGeometry( 50 );

				ellipse = new THREE.Line( geometry, material );
				ellipse.lookAt(normal);

				gyro = new THREE.Gyroscope();

				gyro.add(ellipse);
				camera.add(gyro);

				var axisHelper = new THREE.AxisHelper( 300 );
				gyro.add( axisHelper );


				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				stats.domElement.style.zIndex = 100;
				container.appendChild( stats.domElement );

				window.addEventListener( 'resize', onWindowResize, false );

			}




function animate() {
        requestAnimationFrame( animate );

        controls.update();

				consoleDebug();
        render();
};

function consoleDebug() {
				//console.log(camera.position);
				//console.log(camera.rotation);
				//console.log(controls.object.zoom);
}


function render() {
				camera.plane.constant = -camera.position.y
				var c = 1/camera.zoom
				constScale.set(c,c,c);

				for (var i = 0; i < thats.length; i++) {
					updateThat(thats[i]);
				}

				gyro.scale.copy(constScale);

				renderer.render( scene, camera );
}

function initThat() {
	var that = new THREE.Group();

	var material = new THREE.LineBasicMaterial({	color: 0x333333	});
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(),new THREE.Vector3());

	that.line = new THREE.Line( geometry, material );

	var curve = new THREE.EllipseCurve(0, 0, 5, 5, 0, 2 * Math.PI);
	var path = new THREE.Path( curve.getPoints( 16 ) );
	var geometry = path.createPointsGeometry( 16 );

	that.ellipse2 = new THREE.Line( geometry, material );
	that.ellipse1 = new THREE.Line( geometry, material );
	that.ellipse2.lookAt(normal);
	that.add( that.line );
	that.add( that.ellipse1 );
	that.add( that.ellipse2 );
	updateThat( that );

	return that;
}

function updateThat( that ) {
	that.line.geometry.vertices[0] = camera.plane	.orthoPoint(that.position)
																								.multiply(camera.plane.normal)
																								.negate();
	that.line.geometry.verticesNeedUpdate = true;
	that.ellipse2.position.copy(that.line.geometry.vertices[0]);
	that.ellipse1.quaternion.copy(camera.quaternion);
	that.ellipse1.scale.copy(constScale);
	that.ellipse2.scale.copy(constScale);

	if( that.position.distanceTo(camera.position)<300/camera.zoom) {
		that.line.visible = true;
		that.ellipse2.visible = true;
	} else {
		that.line.visible = false;
		that.ellipse2.visible = false;
	}
}

function onWindowResize() {

  camera.left = window.innerWidth / - 2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / - 2;

  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}
