import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { GUI } from '../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
    initRenderer,
    initDefaultBasicLight,
    lightFollowingCamera,
    onWindowResize
} from "../libs/util/util.js";

//Inspired by mrdoob / three.js

var stats = new Stats(); // To show FPS information
var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// var camera = initCamera(new THREE.Vector3(0, 0, 4)); // Init camera in this position
// var light = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));
var trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultBasicLight(scene);

camera.lookAt(0, 0, 3);
camera.position.set(20, -50, 30);
camera.up.set(0, 1, 3);

var moveOn = false; // control if animation is on or of

// Set initial angles of rotation
var position = [0, 0, 0]; // In degreesToRadians 

// Show world axes
// var axesHelper = new THREE.AxesHelper(25);
// scene.add(axesHelper);

// GROUND
const textureLoader = new THREE.TextureLoader();
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
const texture1 = textureLoader.load("textures/crate.gif");
const material1 = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture1 });

texture1.anisotropy = maxAnisotropy;
texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
texture1.repeat.set(10, 10);

const geometry = new THREE.PlaneGeometry(25, 25);
const teste_color = new THREE.MeshPhongMaterial({ color: 0xDC7633 });
const mesh = new THREE.Mesh(geometry, teste_color);
//mesh1.rotation.y = Math.PI / 2;
mesh.scale.set(2, 2, 2);
scene.add(mesh);

//create earth
const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(2, 2, 2);
// scene.add(dirLight);

const earthGeometry = new THREE.SphereGeometry(1, 50, 50);
const earthMaterial = new THREE.MeshPhongMaterial({
    // color: 0xffff00,
    specular: 0x333333,
    shininess: 5,
    map: textureLoader.load('textures/planets/earth_atmos_2048.jpg'), //comenta
    specularMap: textureLoader.load('textures/planets/earth_specular_2048.jpg'),
    normalMap: textureLoader.load('textures/planets/earth_normal_2048.jpg'),
    normalScale: new THREE.Vector2(0.85, 0.85)
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.rotation.x = Math.PI / 2;
earth.position.set(0, 0, 1);
scene.add(earth);

//Ball
var ballGeometry = new THREE.SphereGeometry(.3, 32, 32);
var ballMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000  });
var ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0, 1);
scene.add(ball);

//variavel de controle
var pause = false;

//funcao para realizar o translado
function draw() {
    // Drawing code goes here
    if (pause) {
        //console.log('teste');
        move();
        requestAnimationFrame(draw);
    } else {
        console.log('Sem Movimento');
    }
}

draw();

//Funcao para mover
function move() {
    var vector = new THREE.Vector3(position[0], position[1], position[2]);

    if (!vector.equals(earth.position)) {
        vector.sub(earth.position);
    }
    var fatorconversao = 50;

    if (vector.length() > 0.3)
        vector.divideScalar(fatorconversao); // cria o vetor deslocamento agora, com tamanho reduzido

    move2(vector); // funcao q realmente translada
}

//funcao para deslocalar na dire??ao e tamanho do vetor passado
function move2(vector) {
    if (earth.position.distanceTo(ball.position) > 0.1) {
        earth.position.add(vector);
    } else {
        earth.position.set(position[0], position[1], position[2]);
        console.log('var controle Anima????o = false');
        pause = false;
    }
}

// Listen window size changes
window.addEventListener('resize', function() { onWindowResize(camera, renderer) }, false);

buildInterface();
render();

function buildInterface() {
    var controls = new function() {

        this.px = 0;
        this.py = 0;
        this.pz = 1;

        this.onChangeAnimation = function() {
            position[0] = this.px;
            position[1] = this.py;
            position[2] = this.pz;
            pause = true;
            draw();
        };

        this.changeSpeed = function() { // Atualiza o array com os valores retirados dos joints
            position[0] = this.px;
            position[1] = this.py;
            position[2] = this.pz;
            ball.position.set(position[0], position[1], position[2]);
        };

    };

    // GUI interface
    var gui = new GUI();
    const ballFolder = gui.addFolder("Posi????o")

    ballFolder.add(controls, 'px', -25, 25)
        .onChange(function(e) { controls.changeSpeed() })
        .name("X-position");
    ballFolder.add(controls, 'py', -25, 25)
        .onChange(function(e) { controls.changeSpeed() })
        .name("Y-position");
    ballFolder.add(controls, 'pz', 1, 25)
        .onChange(function(e) { controls.changeSpeed() })
        .name("Z-position");
    ballFolder.open();
    gui.add(controls, 'onChangeAnimation', true).name("Mover");
}

function controlledRender()
{
  renderer.setClearColor(0xB0E0E6);  // Use a darker clear color in the small viewport 
  renderer.clear(); // Clean the small viewport
  renderer.render(scene, camera);  // Render scene of the virtual camera
}

function render() {
    stats.update(); // Update FPS
    trackballControls.update();
    // rotate the planet/earth
    earth.rotation.y += .005;
    //move();
    // lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
    controlledRender();
}