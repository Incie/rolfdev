var treeObject = {};
var tjs = {};

var guiObject = {
    minSizeMultiplier: 0.75,
    maxSizeMultiplier: 0.80,
    minAngle: 5,
    maxAngle: 25,
    generationLimit: 5,
    generate: function() {
        initScene();
    }
};

function initThreeJS() {
    tjs.scene = new THREE.Scene();
    tjs.renderer = new THREE.WebGLRenderer({ antialias: true });
    tjs.renderer.setSize( window.innerWidth, window.innerHeight );
    tjs.camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -1000, 1000);
    tjs.camera.position.set(0,0,50);

    tjs.scene.add(tjs.camera);

    document.body.appendChild(tjs.renderer.domElement);

    //Statistics
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.zIndex = 1000;
    stats.domElement.style.top = '0px';
    stats.domElement.style.left = '0px';
    document.body.appendChild( stats.domElement );
    tjs.stats = stats;
}

function rand(min,max){
    return Math.random() * (max-min) + min;
}

var treeLimit = 30;
function createBranch(parent, length, rotation, generation){
    var gen = generation || 1;


    var branchGeometry = new THREE.Geometry();
    branchGeometry.vertices.push(new THREE.Vector3(), new THREE.Vector3(0,length, 0));
    var branchMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
    var branchMesh = new THREE.Line(branchGeometry, branchMaterial);

    parent.add(branchMesh);

    branchMesh.rotation.z = rotation * Math.PI / 180.0;

    if( gen >= guiObject.generationLimit)
        return;

    var newOrigin = new THREE.Object3D();
    newOrigin.position.y = length;
    branchMesh.add(newOrigin);

    var nextGeneration = gen + 1;
    createBranch(newOrigin, length * rand(guiObject.minSizeMultiplier, guiObject.maxSizeMultiplier), rand(guiObject.minAngle, guiObject.maxAngle), nextGeneration);
    createBranch(newOrigin, length * rand(guiObject.minSizeMultiplier, guiObject.maxSizeMultiplier), -rand(guiObject.minAngle, guiObject.maxAngle), nextGeneration);
}

function initScene() {
    var t0 = new Date();

    tjs.scene.remove(tjs.scene.getObjectByName('tree'));

    var treeObject = new THREE.Object3D();
    treeObject.name = 'tree';
    treeObject.position.x = window.innerWidth / 2;

    var startingHeight = (window.innerHeight / 5) * rand(guiObject.minSizeMultiplier, guiObject.maxSizeMultiplier);
    treeLimit = 5;
    createBranch(treeObject, startingHeight, 0);

    tjs.tree = treeObject;
    tjs.scene.add(treeObject);

    var t1 = new Date();
    console.log( 'time spent generating tree: ', t1 - t0 );
}

function initGUI() {
    var gui = new dat.GUI();

    gui.add(guiObject, 'minAngle').min(1).max(100);
    gui.add(guiObject, 'maxAngle').min(1).max(100);
    gui.add(guiObject, 'minSizeMultiplier').min(0.1).max(0.9);
    gui.add(guiObject, 'maxSizeMultiplier').min(0.1).max(0.9);
    gui.add(guiObject, 'generationLimit').min(1).max(10).step(1);
    gui.add(guiObject, 'generate');
}

function render() {
    requestAnimationFrame(render);
    tjs.renderer.render(tjs.scene, tjs.camera);
    tjs.stats.update();
}

document.body.onload = function() {
    initThreeJS();
    initGUI();
    initScene();
    render();
};