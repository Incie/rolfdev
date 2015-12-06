var treeObject = {};
var tjs = {};

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
    stats.domElement.style.right = '0px';
    document.body.appendChild( stats.domElement );
    tjs.stats = stats;
}

function rand(min,max){
    return Math.random() * (max-min) + min;
}

var treeLimit = 30;
function createBranch(parent, length, rotation){
    var branchGeometry = new THREE.Geometry();
    branchGeometry.vertices.push(new THREE.Vector3(), new THREE.Vector3(0,length, 0));
    var branchMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
    var branchMesh = new THREE.Line(branchGeometry, branchMaterial);

    parent.add(branchMesh);

    branchMesh.rotation.z = rotation;

    if( length < treeLimit )
        return;

    var newOrigin = new THREE.Object3D();
    newOrigin.position.y = length;
    branchMesh.add(newOrigin);

    createBranch(newOrigin, length * rand(0.75, 0.80), rand(Math.PI / 4, Math.PI / 7));
    createBranch(newOrigin, length * rand(0.75, 0.80), -rand(Math.PI / 5, Math.PI / 9));
}

function initScene() {
    var t0 = new Date();

    var treeObject = new THREE.Object3D();
    treeObject.position.x = window.innerWidth / 2;

    var startingHeight = window.innerHeight / 5;
    treeLimit = startingHeight * 0.10;
    createBranch(treeObject, startingHeight, 0);
    tjs.scene.add(treeObject);

    var t1 = new Date();
    console.log( t1 - t0 );

    //tjs.box = new THREE.Mesh( new THREE.BoxGeometry(10,10,10), new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true }));
    //tjs.scene.add(tjs.box);
}

function render() {
    requestAnimationFrame(render);
    tjs.renderer.render(tjs.scene, tjs.camera);
    tjs.stats.update();
}

document.body.onload = function() {
    initThreeJS();
    initScene();
    render();
};