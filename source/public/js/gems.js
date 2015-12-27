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
    tjs.camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 0.1, 1000);
    tjs.camera.position.set(0,0,0);

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

function createMaterial(color){
    return {
        color: color, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.6,
        specular: 0x444444,
        emissive: 0x020202,
        shininess: 15,
        shading: THREE.FlatShading
    }
}

function initScene(models) {
    tjs.scene.add( new THREE.AmbientLight(0x404040) );
    
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-15,0,50); 
    tjs.scene.add(light);
    
    tjs.gemContainer = new THREE.Object3D();
    tjs.gemContainer.position.set(0,0,0);
    tjs.scene.add(tjs.gemContainer);

    for( var i = 0; i < 3; i += 1 ){    
        var modelIndex = i;
        
        var gemMesh = models[modelIndex].clone();
        var angle = (2*Math.PI) * (i / 3);
        gemMesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0.0);
                
        var gemRotation = new THREE.Object3D();
        var gemBucket = new THREE.Object3D();
        gemRotation.add(gemBucket);
        
        gemBucket.userData.rotation = new THREE.Vector3(Math.random()*0.02 + 0.01, Math.random()*0.02 + 0.01, Math.random()*0.02 + 0.01 );
        gemBucket.add(gemMesh);
        gemBucket.position.set(Math.cos(angle),0,Math.sin(angle));
        tjs.gemContainer.add(gemRotation);  
    }
}

function initGUI() {
    var gui = new dat.GUI();
    
    // gui.add(tjs.material, 'wireframe');
    // gui.add(tjs.material, 'opacity').min(0).max(1).step(0.05);
    // gui.add(tjs.material, 'transparent');
    // gui.add(tjs.material, 'shininess').min(0).max(200).step(0.01);
    // gui.add(tjs.material, 'metal');
}

var interpolator = {
    startAngle: Math.PI / 2 - 2*Math.PI / 3,
    endAngle: Math.PI / 2,
    currentAngle: Math.PI / 2,
    fraction: 0.0,
    step: 0.05,
    active: false  
};

function render() {
    requestAnimationFrame(render);
    
    tjs.gemContainer.children.forEach(function(gemObject){
        var gem = gemObject.children[0];
        gem.rotation.x += gem.userData.rotation.x;
        gem.rotation.y += gem.userData.rotation.y;
        gem.rotation.z += gem.userData.rotation.z;
    });
    
    if( interpolator.active ){
        interpolator.fraction += interpolator.step;
        if( interpolator.fraction >= 1.0 ){
            interpolator.fraction = 1.0;
            interpolator.active = false;
        }
        
        interpolator.currentAngle = interpolator.startAngle + (interpolator.endAngle-interpolator.startAngle)*interpolator.fraction;
    }
    
    tjs.gemContainer.rotation.y = interpolator.currentAngle;

    tjs.renderer.render(tjs.scene, tjs.camera);
    tjs.stats.update();
}

initThreeJS();

var jsonLoader = new THREE.JSONLoader();

var gemModels = [];

function initApp(){
    initScene(gemModels);
    initGUI();
    render();
}

function loadModel(name, color){
    function loaderFunction(geometry, materials){
        var materialProperties = createMaterial(color);
        var material = new THREE.MeshPhongMaterial(materialProperties);
        var mesh = new THREE.Mesh(geometry, material);
        
        gemModels.push(mesh);
        
        if( gemModels.length == 3 ){
            initApp();
        }
    }
    
    var url = '/public/models/' + name + '.json';
    jsonLoader.load(url,loaderFunction);
}

function startRotatingGems(e){
   if( interpolator.active ) return;
    
    interpolator.active = true;
    interpolator.fraction = 0.0;
    interpolator.startAngle += 2*Math.PI / 3;
    interpolator.endAngle += 2*Math.PI / 3;
    interpolator.currentAngle = interpolator.startAngle;
}

tjs.renderer.domElement.addEventListener('mousedown', startRotatingGems);
tjs.renderer.domElement.addEventListener('touchmove', startRotatingGems);


loadModel('gem0', 'red');
loadModel('gem1', 'green');
loadModel('gem2', 'blue');

