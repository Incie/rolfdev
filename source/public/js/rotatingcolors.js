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

function initScene() {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(500, 0,0),
        new THREE.Vector3(250, 500, 0)
    );

    var face = new THREE.Face3(0,1,2);
    var color = new THREE.Color(1,1,1);
    face.vertexColors.push(color, color, color);

    geometry.faces.push( face );


    var material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, vertexColors: THREE.VertexColors});
    var mesh = new THREE.Mesh(geometry, material);

    mesh.userData.targetColors = [generateRandomColor(), generateRandomColor(), generateRandomColor()];
    mesh.userData.initialColors = [color, color, color];
    mesh.userData.fractions = [0.0, 0.0, 0.0];

    tjs.mesh = mesh;
    tjs.scene.add(mesh);




    var boxGeo = new THREE.BoxGeometry(100,100, 100);
    var boxMat = new THREE.MeshBasicMaterial()
    var boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.position.set(500,500,0);
    tjs.scene.add(boxMesh);
}

var updateColors = function(){
    var mesh = tjs.mesh;
    var vertexColors = mesh.geometry.faces[0].vertexColors;

    var targetColors = mesh.userData.targetColors;
    var initialColors = mesh.userData.initialColors;
    var fractions = mesh.userData.fractions;

    for( var i = 0; i < 3; ++i ){
        fractions[i] += 1.1 * (1/60.0);

        if( fractions[i] > 1.0 ) fractions[i] = 1.0;

        vertexColors[i].r = initialColors[i].r + (targetColors[i].r - initialColors[i].r)*fractions[i];
        vertexColors[i].g = initialColors[i].g + (targetColors[i].g - initialColors[i].g)*fractions[i];
        vertexColors[i].b = initialColors[i].b + (targetColors[i].b - initialColors[i].b)*fractions[i];

        if( fractions[i] >= 1.0 ){
            fractions[i] = 0.0;
            initialColors[i] = targetColors[i];
            targetColors[i] = generateRandomColor();
        }
    }
};

initThreeJS();
initScene();
render();