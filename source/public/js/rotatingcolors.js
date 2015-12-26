var tjs = {};

function render() {
    requestAnimationFrame(render);

    updateColors();
    tjs.renderer.render(tjs.scene, tjs.camera);
    tjs.stats.update();
}

function initThreeJS() {
    tjs.scene = new THREE.Scene();
    tjs.renderer = new THREE.WebGLRenderer({ antialias: true });
    tjs.renderer.setSize( window.innerWidth, window.innerHeight );
    tjs.camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -1000, 1000);
    tjs.camera.position.set(0,0,500);

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

function generateRandomColor(){
    var r = Math.random;
    return new THREE.Color(r(), r(), r());
}

function newColor(seed){
    var color = new THREE.Color(0,0,0);
    return {
        color: color,
        initialColor: color,
        targetColor: generateRandomColor(),
        fraction: seed || 0.0
    }
}

var colorPool = [ new THREE.Color(1,0,0), new THREE.Color(0,1,0), new THREE.Color(0,0,1)];
var colors = [];

function generateRandomColors(amount){
    for( var c = 0; c < amount; c += 1 ){
        colors.push( newColor(Math.random()) );
    }
}

function rad(deg){
    return deg * Math.PI / 180.0;
}
function initScene() {
    var cos = Math.cos;
    var sin = Math.sin;
    var width = window.innerWidth / 2;
    var height = window.innerHeight / 2;
    var radius = height * 0.9;
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(width, height, 0),
        new THREE.Vector3(width + radius*cos(rad(60)), height + radius*sin(rad(60)), 0),
        new THREE.Vector3(width + radius*cos(rad(120)), height + radius*sin(rad(120)), 0),
        new THREE.Vector3(width + radius*cos(rad(180)), height + radius*sin(rad(180)), 0),
        new THREE.Vector3(width + radius*cos(rad(240)), height + radius*sin(rad(240)), 0),
        new THREE.Vector3(width + radius*cos(rad(300)), height + radius*sin(rad(300)), 0),
        new THREE.Vector3(width + radius*cos(rad(360)), height + radius*sin(rad(360)), 0)
    );
    
    generateRandomColors(geometry.vertices.length);

    function createFace(i0, i1, i2){
        var face = new THREE.Face3(i0, i1, i2);
        face.vertexColors.push(colors[i0].color, colors[i1].color, colors[i2].color);
        return face;        
    }

    geometry.faces.push( createFace(0,1,2) );
    geometry.faces.push( createFace(0,2,3) );
    geometry.faces.push( createFace(0,3,4) );
    geometry.faces.push( createFace(0,4,5) );
    geometry.faces.push( createFace(0,5,6) );
    geometry.faces.push( createFace(0,6,1) );

    var material = new THREE.MeshBasicMaterial({side: THREE.FrontSide, vertexColors: THREE.VertexColors, wireframe: false});
    var mesh = new THREE.Mesh(geometry, material);

    tjs.mesh = mesh;
    tjs.scene.add(mesh);
}

var updateColors = function(){
    colors.forEach( function(color){
        color.fraction += 0.5 * (1/60.0);
        
        if( color.fraction >= 1.0 ){
            color.fraction -= 1.0;
            color.initialColor.set(color.targetColor);
            color.targetColor = generateRandomColor();
        }
        
        color.color.setRGB(
            color.initialColor.r + (color.targetColor.r - color.initialColor.r)*color.fraction,
            color.initialColor.g + (color.targetColor.g - color.initialColor.g)*color.fraction,
            color.initialColor.b + (color.targetColor.b - color.initialColor.b)*color.fraction              
        );
    });
        
    tjs.mesh.geometry.colorsNeedUpdate = true;
};

initThreeJS();
initScene();
render();