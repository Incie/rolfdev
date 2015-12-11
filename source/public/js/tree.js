var treeObject = {};
var tjs = {};

var guiObject = {
    minSizeMultiplier: 0.75,
    maxSizeMultiplier: 0.80,
    minAngle: 5,
    maxAngle: 25,
    generationLimit: 8,
    windStrength: 0.1,
    maxGenerations: 12,
    generate: function() {
        refreshTree(tjs.tree);
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

var branchMaterial = new THREE.LineBasicMaterial({color: 0xffffff});

var lightGeometry = new THREE.PlaneGeometry(10,10);


function createBranch(parent, parentLength, rotation, generation){
    var gen = generation || 1;
    var childLength = parentLength * 0.8;

    var branchGeometry = new THREE.Geometry();
    branchGeometry.vertices.push(new THREE.Vector3(), new THREE.Vector3(0,childLength, 0));

    var branchMesh = new THREE.Line(branchGeometry, branchMaterial);
    branchMesh.name = 'branch';
    parent.add(branchMesh);

    branchMesh.userData.seed = Math.random() * (Math.PI/4);
    branchMesh.userData.rotation = rotation;

    branchMesh.rotation.z = rotation * Math.PI / 180.0;
    if( gen > 1 )
        branchMesh.position.y = parentLength;

    if( gen > guiObject.generationLimit )
        branchMesh.visible = false;

    if( gen >= guiObject.maxGenerations )
        return;

    var nextGeneration = gen + 1;
    createBranch(branchMesh, childLength, 25, nextGeneration);
    createBranch(branchMesh, childLength, -25, nextGeneration);

    var lightMesh = new THREE.Mesh(lightGeometry, new THREE.MeshBasicMaterial({color: Math.random()*0xFFFFFF, transparent: true, map: tjs.particleTexture}));
    lightMesh.name = 'light';
    lightMesh.rotation.z = Math.PI/2;
    branchMesh.add(lightMesh);

}

function generateTree() {
    var treeObject = new THREE.Object3D();
    treeObject.name = 'tree';
    treeObject.position.x = window.innerWidth / 2;

    var startingHeight = (window.innerHeight / 5) * rand(guiObject.minSizeMultiplier, guiObject.maxSizeMultiplier);
    treeLimit = 5;
    createBranch(treeObject, 250, 0, 1);

    return treeObject;
}

function refreshBranch(branchMesh, parentLength, rotation, generation){
    var childLength = parentLength * rand(guiObject.minSizeMultiplier, guiObject.maxSizeMultiplier);
    branchMesh.geometry.vertices[1].y = childLength;
    branchMesh.rotation.z = rotation * Math.PI / 180.0;

    branchMesh.userData.seed = Math.random() * Math.PI;
    branchMesh.userData.rotation = rotation;

    branchMesh.geometry.verticesNeedUpdate = true;

    if( generation > 1 )
        branchMesh.position.y = parentLength;

    branchMesh.visible = (generation <= guiObject.generationLimit);

    for( var i = 0; i < branchMesh.children.length; i += 1 ){
        var child = branchMesh.children[i];
        if( child.name == 'branch' ) {
            var multiplier = (i % 2 == 0) ? 1 : -1;
            refreshBranch(branchMesh.children[i], childLength, multiplier * rand(guiObject.minAngle, guiObject.maxAngle), generation + 1);
        }
    }
}

function refreshTree(treeObject){
    refreshBranch(treeObject.children[0], (window.innerHeight / 5), 0, 1);
}


function updateBranch(branchObject, wind, generation){
    branchObject.visible = (generation <= guiObject.generationLimit);
    var windMultiplier = generation / guiObject.generationLimit;
    branchObject.rotation.z = ( 0.5 * Math.PI * branchObject.userData.rotation / 180.0) +  windMultiplier * guiObject.windStrength * Math.sin(branchObject.userData.seed + wind);

    for( var i = 0; i < branchObject.children.length; i += 1 ){
        var child = branchObject.children[i];

        if( child.name == 'branch' )
            updateBranch(child, wind, generation + 1 );
    }
}

function updateTree(treeObject){
    updateBranch(treeObject.children[0], wind, 1);
}

function initScene() {
    var t0 = new Date();

    tjs.tree = generateTree();
    tjs.scene.add(tjs.tree);

    var t1 = new Date();
    console.log( 'time spent generating tree: ', t1 - t0 );
}

function initGUI() {
    var gui = new dat.GUI();

    gui.add(guiObject, 'minAngle').min(1).max(100).step(1).onFinishChange(guiObject.generate);
    gui.add(guiObject, 'maxAngle').min(1).max(100).step(1).onFinishChange(guiObject.generate);
    gui.add(guiObject, 'minSizeMultiplier').min(0.1).max(0.9).onFinishChange(guiObject.generate);
    gui.add(guiObject, 'maxSizeMultiplier').min(0.1).max(0.9).onFinishChange(guiObject.generate);
    gui.add(guiObject, 'windStrength').min(0.01).max(1.0).step(0.01);
    gui.add(guiObject, 'generationLimit').min(1).max(10).step(1);
    gui.add(guiObject, 'generate');
}

var wind = 0;
function render() {
    requestAnimationFrame(render);
    wind += 0.01;
    updateTree(tjs.tree);

    tjs.renderer.render(tjs.scene, tjs.camera);
    tjs.stats.update();
}

document.body.onload = function() {
    var textureLoader = new THREE.TextureLoader();

    textureLoader.load('/public/img/a/particle.png',
        function(texture) {
            console.log('texture loaded');
            console.log(texture);

            tjs.particleTexture = texture;

            initThreeJS();
            initGUI();
            initScene();
            render();
        },
        function(){ console.log('progress loading texture'); },
        function(){ console.log('error loading texture');  }
    );
};