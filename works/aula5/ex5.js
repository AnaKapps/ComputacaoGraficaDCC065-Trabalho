import * as THREE from "../build/three.module.js";
import Stats from "../build/jsm/libs/stats.module.js";
import {
  GUI
} from "../build/jsm/libs/dat.gui.module.js";
import {
  TrackballControls
} from "../build/jsm/controls/TrackballControls.js";
import KeyboardState from "../libs/util/KeyboardState.js";
import {
  TeapotGeometry
} from "../build/jsm/geometries/TeapotGeometry.js";
import {
  initRenderer,
  InfoBox,
  SecondaryBox,
  createGroundPlane,
  onWindowResize,
  degreesToRadians,
} from "../libs/util/util.js";

var scene = new THREE.Scene(); // Create main scene
var stats = new Stats(); // To show FPS information

var renderer = initRenderer(); // View function in util/utils
renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.lookAt(0, 0, 0);
camera.position.set(5, 5, 8);
camera.up.set(0, 1, 0);
var objColor = "rgb(255,255,255)";
//var objShininess = 200;

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

// Painel de FPS
function createStats() {
  stats.setMode(0);
  
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0';
  stats.domElement.style.top = '0';

  return stats;
}
// To show FPS
stats = createStats();
document.body.appendChild( stats.domElement );


var groundPlane = createGroundPlane(4.0, 4.0, 50, 50); // width and height
groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(1.5);
axesHelper.visible = false;
scene.add(axesHelper);

// Show text information onscreen
showInformation();

var infoBox = new SecondaryBox("");

// Teapot
var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({
  color: objColor,
  shininess: "200",
});
material.side = THREE.DoubleSide;
var teapot = new THREE.Mesh(geometry, material);
teapot.castShadow = true;
teapot.position.set(0.0, 0.5, 0.0);
scene.add(teapot);

var teaRotation = false;
var speed = 0.0;

//----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Barras limitadoras de movimento
var barra1Position = new THREE.Vector3(groundPlane.geometry.parameters.width / 2, 2, 0);
var barra1 = createSliderBar(scene,0.01,0.01,groundPlane.geometry.parameters.width,barra1Position);

var barra2Position = new THREE.Vector3(0,groundPlane.geometry.parameters.width / 2,2);
var barra2 = createSliderBar(scene,0.01,0.01,groundPlane.geometry.parameters.width,barra2Position);
barra2.rotateZ(Math.PI / 2);

var barra3Position = new THREE.Vector3(-groundPlane.geometry.parameters.width / 2,2,0);
var barra3 = createSliderBar(scene,0.01,0.01,groundPlane.geometry.parameters.width,barra3Position);

var barra4Position = new THREE.Vector3(-groundPlane.geometry.parameters.width / 2,groundPlane.geometry.parameters.width / 2/2, 2);
var barra4 = createSliderBar(scene,0.01,0.01,groundPlane.geometry.parameters.width / 2,barra4Position);
barra4.rotateX(Math.PI / 2);

var barra4Position = new THREE.Vector3(groundPlane.geometry.parameters.width / 2,groundPlane.geometry.parameters.width / 2 / 2,2);
var barra4 = createSliderBar(scene,0.01,0.01,groundPlane.geometry.parameters.width / 2,barra4Position);
barra4.rotateX(Math.PI / 2);

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// Default light position, color, ambient color and intensity
var lightPosition1 = new THREE.Vector3(2, 2, 0);
var lightPosition2 = new THREE.Vector3(0, 2, 2);
var lightPosition3 = new THREE.Vector3(-2, 2, 0);

var lightColorRed = "rgb(255,0,0)";
var lightColorGreen = "rgb(0,255,0)";
var lightColorBlue = "rgb(0,0,255)";
var ambientColor = "rgb(50,50,50)";

// Objects to represent the ligths
var lightSphere = createLightSphere(scene, 0.05, 40, 40, lightPosition1,lightColorRed);
var lightBox = createLightSphere(scene, 0.05, 10, 10, lightPosition2,lightColorGreen);
var lightCone = createLightSphere(scene, 0.05, 10, 10, lightPosition3,lightColorBlue);

// Create and set all lights. Only Spot and ambient will be visible at first
var spotLight1 = new THREE.SpotLight(lightColorRed);
setSpotLight(spotLight1, lightPosition1);

var spotLight2 = new THREE.SpotLight(lightColorGreen);
setSpotLight(spotLight2, lightPosition2);

var spotLight3 = new THREE.SpotLight(lightColorBlue);
setSpotLight(spotLight3, lightPosition3);

// More info here: https://threejs.org/docs/#api/en/lights/AmbientLight
var ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

buildInterface();
render();

// var torus = new THREE.Object3D();
// createTorus();
// scene.add( torus );

function createTorus()
{
	var geometry = new THREE.TorusGeometry(2.0, 0.02, 70, 70, Math.PI * 2);
	var objectMaterial = new THREE.MeshPhongMaterial({
		color:"rgb(0,0,0)",     // Main color of the object
		shininess:"200",            // Shininess of the object
		specular:"rgb(255,255,255)" // Color of the specular component
	});
	var object = new THREE.Mesh(geometry, objectMaterial);
		object.position.set(0.0, 2.0, 0.0);
		object.rotation.x = Math.PI/2;

	torus.add(object);
}

// Set Spotlight
// More info here: https://threejs.org/docs/#api/en/lights/SpotLight
function setSpotLight(spotLight, position) {
  spotLight.position.copy(position);
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.angle = degreesToRadians(40);
  spotLight.castShadow = true;
  spotLight.decay = 2;
  spotLight.penumbra = 0.5;
  spotLight.name = "Spot Light";

  scene.add(spotLight);
}

function removeSpotLight(spotLight, position) {
  scene.remove(spotLight)
}

// Update light position of the current light
function updateLightPosition() {
  setSpotLight(spotLight1, lightPosition1);
  lightSphere.position.copy(lightPosition1);

  setSpotLight(spotLight2, lightPosition2);
  lightBox.position.copy(lightPosition2);

  setSpotLight(spotLight3, lightPosition3);
  lightCone.position.copy(lightPosition3);
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// Create a lot of objects on the scene

function createLightSphere2(scene, radius, widthSegments, heightSegments, position)
{
  var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
  var material = new THREE.MeshBasicMaterial({color: sphereColor});
  var object = new THREE.Mesh(geometry, material);
    object.position.copy(position);
  //scene.add(object);
  return object;
}

function createLightSphere(
  scene,
  radius,
  widthSegments,
  heightSegments,
  position,
  lightColor
) {
  var geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments,
    0,
    Math.PI * 2,
    0,
    Math.PI
  );
  var material = new THREE.MeshBasicMaterial({
    color: lightColor,
  }); //"rgb(255,255,50)"
  var object = new THREE.Mesh(geometry, material);
  object.visible = true;
  object.position.copy(position);
  scene.add(object);

  return object;
}

function createLightBox(scene, width, height, depth, position) {
  var geometry = new THREE.BoxGeometry(width, height, depth);
  var material = new THREE.MeshBasicMaterial({
    color: lightColorGreen,
  });
  var object = new THREE.Mesh(geometry, material);
  object.visible = true;
  object.position.copy(position);
  scene.add(object);

  return object;
}

function createLightCone(scene, radius, height, position) {
  var geometry = new THREE.ConeGeometry(radius, height);
  var material = new THREE.MeshBasicMaterial({
    color: lightColorBlue,
  });
  var object = new THREE.Mesh(geometry, material);
  object.rotateX(Math.PI / 2);
  object.visible = true;
  object.position.copy(position);
  scene.add(object);

  return object;
}

function createSliderBar(scene, radiusTop, radiusBottom, height, position) {
  var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height);
  var material = new THREE.MeshBasicMaterial({
    color: ambientColor,
  });
  var object = new THREE.Mesh(geometry, material);
  object.rotateX(Math.PI / 2);
  object.visible = true;
  object.position.copy(position);
  scene.add(object);

  return object;
}


//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// Interface functions


function rotate() {
  if (teaRotation) {
    teapot.rotation.y += speed;
  }
}

function controlaLuzes() {
  if (onRed) {
    setSpotLight(spotLight1, lightPosition1);
  } else {
    removeSpotLight(spotLight1, lightPosition1);
  }

  if (onGreen) {
    setSpotLight(spotLight2, lightPosition2);
  } else {
    removeSpotLight(spotLight2, lightPosition2);
  }

  if (onBlue) {
    setSpotLight(spotLight3, lightPosition3);
  } else {
    removeSpotLight(spotLight3, lightPosition3);
  }
}

var onRed = true;
var onGreen = true;
var onBlue = true;
function buildInterface() {
  var controls = new function () {
    this.speed = 0.0;
    this.onRed = true;
    this.onGreen = true;
    this.onBlue = true;

    this.onChangeAnimation = function () {
      teaRotation = !teaRotation;
    };
    this.changeSpeed = function () {
      speed = this.speed;
    };

    this.onoffRed = function () {
      onRed = !onRed;
    };
    this.onoffGreen = function () {
      onGreen = !onGreen;
    };
    this.onoffBlue = function () {
      onBlue = !onBlue;
    };

  };

  // GUI interface
  var gui = new GUI();
  // gui.add(controls, "onChangeAnimation", true).name("Rotation animation On/Off");
  // gui.add(controls, "speed", -0.1, 0.1).onChange(function (e) { controls.changeSpeed(); }).name("speed");
  gui.add(controls, "onRed", true).onChange(function (e) { controls.onoffRed(); }).name("RED");
  gui.add(controls, "onGreen", true).onChange(function (e) { controls.onoffGreen(); }).name("GREEN");
  gui.add(controls, "onBlue", true).onChange(function (e) { controls.onoffBlue(); }).name("BLUE");
}

function keyboardUpdate() {
  keyboard.update();
  // SpotLight Vermelho
  if (keyboard.pressed("3")) {
    //X
    if (
      (lightPosition1.x == 2 || lightPosition1.x == -2.0) &&
      lightPosition1.y == 2.0 &&
      lightPosition1.z > -2.0
    ) {
      lightPosition1.z -= 0.05;
      updateLightPosition();
      if (lightPosition1.z < -2.0) lightPosition1.z = -2.0;
    }
  }
  if (keyboard.pressed("4")) {
    //X
    if (
      (lightPosition1.x == 2 || lightPosition1.x == -2.0) &&
      lightPosition1.y == 2.0 &&
      lightPosition1.z < 2.0
    ) {
      lightPosition1.z += 0.05;
      updateLightPosition();
      if (lightPosition1.z > 2.0) lightPosition1.z = 2.0;
    }
  }

  // if (keyboard.pressed("D")) {
  //   //Y
  //   if (
  //     lightPosition1.x < 2.0 &&
  //     lightPosition1.y == 2.0 &&
  //     lightPosition1.z == 2.0
  //   ) {
  //     lightPosition1.x += 0.05;
  //     updateLightPosition();
  //     if (lightPosition1.x > 2.0) lightPosition1.x = 2.0;
  //   }
  // }
  // if (keyboard.pressed("A")) {
  //   //Y
  //   if (
  //     lightPosition1.x >= -2.0 &&
  //     lightPosition1.y == 2.0 &&
  //     lightPosition1.z == 2.0
  //   ) {
  //     lightPosition1.x -= 0.05;
  //     updateLightPosition();
  //     if (lightPosition1.x < -2.0) lightPosition1.x = -2.0;
  //   }
  // }
  // if (keyboard.pressed("W")) {
  //   //Z
  //   if (
  //     (lightPosition1.x == 2.0 || lightPosition1.x == -2.0) &&
  //     lightPosition1.y < 2.0 &&
  //     lightPosition1.z == 2.0
  //   ) {
  //     lightPosition1.y += 0.05;
  //     updateLightPosition();
  //     if (lightPosition1.y > 2.0) lightPosition1.y = 2.0;
  //   }
  // }
  // if (keyboard.pressed("S")) {
  //   //Z
  //   if (
  //     (lightPosition1.x == 2.0 || lightPosition1.x == -2.0) &&
  //     lightPosition1.y > 0.0 &&
  //     lightPosition1.z == 2.0
  //   ) {
  //     lightPosition1.y -= 0.05;
  //     updateLightPosition();
  //     if (lightPosition1.y < 0.0) lightPosition1.y = 0.0;
  //   }
  // }

  // SpotLight Verde
  // if (keyboard.pressed("O")) {
  //   //X
  //   if (
  //     (lightPosition2.x == 2 || lightPosition2.x == -2.0) &&
  //     lightPosition2.y == 2.0 &&
  //     lightPosition2.z > -2.0
  //   ) {
  //     lightPosition2.z -= 0.05;
  //     updateLightPosition();
  //     if (lightPosition2.z < -2.0) lightPosition2.z = -2.0;
  //   }
  // }
  // if (keyboard.pressed("U")) {
  //   //X
  //   if (
  //     (lightPosition2.x == 2 || lightPosition2.x == -2.0) &&
  //     lightPosition2.y == 2.0 &&
  //     lightPosition2.z < 2.0
  //   ) {
  //     lightPosition2.z += 0.05;
  //     updateLightPosition();
  //     if (lightPosition2.z > 2.0) lightPosition2.z = 2.0;
  //   }
  // }

  if (keyboard.pressed("1")) {
    //Y
    if (
      lightPosition2.x < 2.0 &&
      lightPosition2.y == 2.0 &&
      lightPosition2.z == 2.0
    ) {
      lightPosition2.x += 0.05;
      updateLightPosition();
      if (lightPosition2.x > 2.0) lightPosition2.x = 2.0;
    }
  }
  if (keyboard.pressed("2")) {
    //Y
    if (
      lightPosition2.x >= -2.0 &&
      lightPosition2.y == 2.0 &&
      lightPosition2.z == 2.0
    ) {
      lightPosition2.x -= 0.05;
      updateLightPosition();
      if (lightPosition2.x < -2.0) lightPosition2.x = -2.0;
    }
  }
  // if (keyboard.pressed("I")) {
  //   //Z
  //   if (
  //     (lightPosition2.x == 2.0 || lightPosition2.x == -2.0) &&
  //     lightPosition2.y < 2.0 &&
  //     lightPosition2.z == 2.0
  //   ) {
  //     lightPosition2.y += 0.05;
  //     updateLightPosition();
  //     if (lightPosition2.y > 2.0) lightPosition2.y = 2.0;
  //   }
  // }
  // if (keyboard.pressed("K")) {
  //   //Z
  //   if (
  //     (lightPosition2.x == 2.0 || lightPosition2.x == -2.0) &&
  //     lightPosition2.y > 0.0 &&
  //     lightPosition2.z == 2.0
  //   ) {
  //     lightPosition2.y -= 0.05;
  //     updateLightPosition();
  //     if (lightPosition2.y < 0.0) lightPosition2.y = 0.0;
  //   }
  // }

  // SpotLight Azul
  if (keyboard.pressed("5")) {
    //X
    if (
      (lightPosition3.x == 2 || lightPosition3.x == -2.0) &&
      lightPosition3.y == 2.0 &&
      lightPosition3.z > -2.0
    ) {
      lightPosition3.z -= 0.05;
      updateLightPosition();
      if (lightPosition3.z < -2.0) lightPosition3.z = -2.0;
    }
  }
  if (keyboard.pressed("6")) {
    //X
    if (
      (lightPosition3.x == 2 || lightPosition3.x == -2.0) &&
      lightPosition3.y == 2.0 &&
      lightPosition3.z < 2.0
    ) {
      lightPosition3.z += 0.05;
      updateLightPosition();
      if (lightPosition3.z > 2.0) lightPosition3.z = 2.0;
    }
  }

  // if (keyboard.pressed("6")) {
  //   //Y
  //   if (
  //     lightPosition3.x < 2.0 &&
  //     lightPosition3.y == 2.0 &&
  //     lightPosition3.z == 2.0
  //   ) {
  //     lightPosition3.x += 0.05;
  //     updateLightPosition();
  //     if (lightPosition3.x > 2.0) lightPosition3.x = 2.0;
  //   }
  // }
  // if (keyboard.pressed("4")) {
  //   //Y
  //   if (
  //     lightPosition3.x >= -2.0 &&
  //     lightPosition3.y == 2.0 &&
  //     lightPosition3.z == 2.0
  //   ) {
  //     lightPosition3.x -= 0.05;
  //     updateLightPosition();
  //     if (lightPosition3.x < -2.0) lightPosition3.x = -2.0;
  //   }
  // }
  // if (keyboard.pressed("8")) {
  //   //Z
  //   if (
  //     (lightPosition3.x == 2.0 || lightPosition3.x == -2.0) &&
  //     lightPosition3.y < 2.0 &&
  //     lightPosition3.z == 2.0
  //   ) {
  //     lightPosition3.y += 0.05;
  //     updateLightPosition();
  //     if (lightPosition3.y > 2.0) lightPosition3.y = 2.0;
  //   }
  // }
  // if (keyboard.pressed("5")) {
  //   //Z
  //   if (
  //     (lightPosition3.x == 2.0 || lightPosition3.x == -2.0) &&
  //     lightPosition3.y > 0.0 &&
  //     lightPosition3.z == 2.0
  //   ) {
  //     lightPosition3.y -= 0.05;
  //     updateLightPosition();
  //     if (lightPosition3.y < 0.0) lightPosition3.y = 0.0;
  //   }
  // }
}


function showInformation() {
  // Use this to show information onscreen
  var controls = new InfoBox();
  controls.add("1 / 2 - Movimenta luz vermelha");
  controls.add("3 / 4 - Movimenta luz verde");
  controls.add("5 / 6 - Movimenta luz azul");
  controls.show();
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function render() {
  stats.update(); //Update Fps
  trackballControls.update();
  rotate();
  controlaLuzes();
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}