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
    tjs.camera.position.set(0,0,9);

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
        opacity: 0.6,
        specular: 0x444444,
        emissive: 0x020202,
        shininess: 15,
        shading: THREE.FlatShading
    }
    
    tjs.gemContainer = new THREE.Object3D();
    tjs.gemContainer.position.set(0,0,0);
    tjs.scene.add(tjs.gemContainer);
    
    var geometry = new THREE.OctahedronGeometry(0.5);
    var material = new THREE.MeshPhongMaterial(materialProperties);
    tjs.material = material;
    
    for( var x = -5; x < 5; x += 1 ){
        for( var y = -5; y < 5; y += 1 ){
            var rubyMesh = new THREE.Mesh(geometry, material);
            rubyMesh.position.set(x,y,0);
            rubyMesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0.0);
            rubyMesh.userData.xRot = Math.random()*0.02 + 0.01;
            rubyMesh.userData.yRot = Math.random()*0.02 + 0.01;
            rubyMesh.userData.zRot = 0.0;
            console.log(rubyMesh.position);
            tjs.gemContainer.add(rubyMesh);  
        }
    }
}

function initGUI() {
    var gui = new dat.GUI();
    
    gui.add(tjs.material, 'wireframe');
    gui.add(tjs.material, 'opacity').min(0).max(1).step(0.05);
    gui.add(tjs.material, 'transparent');
    gui.add(tjs.material, 'shininess').min(0).max(200).step(0.01);
    gui.add(tjs.material, 'metal');
}

function render() {
    requestAnimationFrame(render);
    
    tjs.gemContainer.children.forEach(function(gem){
        gem.rotation.x += gem.userData.xRot;
        gem.rotation.y += gem.userData.yRot; 
        gem.rotation.z += gem.userData.zRot;
    });

    tjs.renderer.render(tjs.scene, tjs.camera);
    tjs.stats.update();
}

initThreeJS();
initScene();
initGUI();
render();
