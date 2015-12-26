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
    // tjs.camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -1000, 1000);
    tjs.camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 1.0, 1000);
    tjs.camera.position.set(0,0,5);

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

function initScene() {
    tjs.scene.add( new THREE.AmbientLight(0x404040) );
    
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-15,0,50); 
    tjs.scene.add(light);
    
    var materialProperties = {
        color: 'red', 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.9,
        specular: 0x666666,
        shininess: 0.1,
        shading: THREE.FlatShading
    }
    
    var geometry = new THREE.OctahedronGeometry(1);
    var material = new THREE.MeshPhongMaterial(materialProperties);
    var rubyMesh = new THREE.Mesh(geometry, material);
    tjs.ruby = rubyMesh;
    tjs.scene.add(tjs.ruby);
    
    var box = new THREE.Mesh(new THREE.BoxGeometry(100,100,100), new THREE.MeshBasicMaterial({color: 0xffffff}))
    box.position.set(0,0,0);
    tjs.scene.add(box);
}

function initGUI() {
    var gui = new dat.GUI();
    
    gui.add(tjs.ruby.material, 'wireframe');
    gui.add(tjs.ruby.material, 'opacity').min(0).max(1).step(0.05);
    gui.add(tjs.ruby.material, 'transparent');
    gui.add(tjs.ruby.material, 'shininess').min(0).max(100).step(0.01);
    gui.add(tjs.ruby.material, 'metal');
}

function render() {
    requestAnimationFrame(render);
    
    tjs.ruby.rotation.y += 0.01;
    tjs.ruby.rotation.z += 0.02;

    tjs.renderer.render(tjs.scene, tjs.camera);
    tjs.stats.update();
}

initThreeJS();
initScene();
initGUI();
render();
