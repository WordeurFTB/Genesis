let count = 0;
let scenes = [];
let url = new URLSearchParams(window.location.search);
let hologram = (url.get('hologram')) ? parseInt(url.get('hologram')) : 0;
let choice = (url.get('choice')) ? parseInt(url.get('choice')) : "sphere";
let shade = (url.get('shade')) ? String(url.get('shade')) : "#FF4136";
let form_tab = null;
let color_tab = null;
let hologram_tab = null;
let pic_tab = ["../src/pics/headphone.gif", "../src/pics/smartphone.gif"];
let data = [];
if (sessionStorage.getItem('genesis_config')) {
    if (!localStorage.getItem('user_cache')) {
        window.location.replace('./login.html');
    } else {
        // Générer le bouton de visualisation
        $("body").append('<button id="holo-btn"></button>');
        $('#holo-btn').click(function() {
            showDesign();
        });
        $("body").append('<div id="overlay" />');
        $("#overlay").click(function() {
            hideDesign();
        });

        // Générer la customisation
        $("body").append('<table style="width:100%;text-align:center;"><tr id="form"></tr><tr><td>&nbsp;</td></tr><tr id="color"></tr></table>');

        // Récupération des données de l'hologramme
        load();
    }
} else {
    window.location.replace('../index.html');
}
function getForms() { 
    return $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: JSON.parse(sessionStorage.getItem('genesis_config')).api_path,
        data: JSON.stringify({
            "action" : "get-forms",
            "token" : JSON.parse(localStorage.getItem('user_cache')).token
        }),
        success: function(result) {
            form_tab = result;
            let keys = Object.keys(form_tab);
            for (const key in keys) {
                $("#form").append('<td><button class="custom" onclick="change(\'' + form_tab[key].code + '\',null)"><img src="../src/forms/' + form_tab[key].code + '.ico" /></button></td>');
            }
            return true;
        }
    });
};
function getColors() { 
    return $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: JSON.parse(sessionStorage.getItem('genesis_config')).api_path,
        data: JSON.stringify({
            "action" : "get-colors",
            "token" : JSON.parse(localStorage.getItem('user_cache')).token
        }),
        success: function(result) {
            color_tab = result;
            let keys = Object.keys(color_tab);
            for (const key in keys) {
                $("#color").append('<td><button class="custom" style="background-color:' + color_tab[key].value + ';" onclick="change(null,\'' + color_tab[key].value + '\')"></button></td>');
            }
            return true;
        }
    });
};
function getHologram() {
    return $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: JSON.parse(sessionStorage.getItem('genesis_config')).api_path,
        data: JSON.stringify({
            "action" : "get-hologram",
            "hologram" : hologram,
            "token" : JSON.parse(localStorage.getItem('user_cache')).token
        }),
        success: function(result) {
            hologram_tab = result;
            // ...
            return true;
        }
    });
}
async function load() {
    try {
        form_tab = await getForms();
    } catch(e) {
        // ***
    }
    try {
        form_tab = await getColors();
    } catch(e) {
        // ***
    }
    draw();
}
function draw() {
    // Récupérer les dimensions de l'écran
    let ratio = screen.width * 0.75;

    // Générer la scène de l'hologramme
    $("body").append('<canvas id="stage" height="' + ratio + '" width="' + ratio + '"></canvas>');
    $("#stage").addClass(Array('centered-stage', 'stage'));
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, 1);
    /*camera.position.z = 250;
    camera.lookAt(scene.position);*/
    let renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.getElementById("stage")});
    renderer.autoClear = true;
    data['stage'] = {"scene": scene, "camera": camera, "renderer": renderer};
    if ((choice !== 0) && (choice !== 1)) {
        drawGeometry(scene, camera, renderer);
    } else {
        //drawPic(scene, pic_tab[choice]);
    }

    // Génerer le contenu de la visualisation
    createShadow();
}
function drawGeometry(scene, camera, renderer) {
    let geometry;
    if (choice === 'sphere') {
        geometry = new THREE.SphereGeometry(1, 16, 16);
    } else if (choice === 'ring') {
        geometry = new THREE.TorusGeometry(1, 0.2, 10, 16);
    } else if (choice === 'pyramid') {
        geometry = new THREE.ConeGeometry(1, 1.4, 4);
    } else if (choice === 'cube') {
        geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    } else if (choice === 'octahedron') {
        geometry = new THREE.OctahedronGeometry(1.2, 0);
    } else if (choice === 'icosahedron') {
        geometry = new THREE.IcosahedronGeometry(1.2, 0);
    } else if (choice === 'dodecahedron') {
        geometry = new THREE.DodecahedronGeometry(1.2, 0);
    }
    let color = new THREE.Color(shade);
    let material = new THREE.MeshBasicMaterial({color: color.getHex()});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = 10;
    mesh.rotation.y = 5;
    mesh.position.z = -5;
    scene.add(mesh);
    let edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0xFFFFFF}));
    line.rotation.x = 10;
    line.rotation.y = 5;
    line.position.z = -5;
    scene.add(line);
    let light = new THREE.PointLight(0xFFFFFF, 1, 0);
    light.position.set(1, 1, 1);
    scene.add(light);
    let ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
    renderer.render(scene, camera);
    let animate = function() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;
        line.rotation.x += 0.01;
        line.rotation.y += 0.02;
        renderer.render(scene, camera);
    }
    animate();
}
function drawText(scene, camera, renderer) {
    const loader = new THREE.FontLoader();
    loader.load( '../font/metropolis_regular.typeface.json', function ( font ) {
        const geometry = new THREE.TextGeometry( 'Texte', {
            font: font,
            size: 5,
            height: 3,
            curveSegments: 3,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 1,
            bevelSegments: 1
        } );
    } );
}
function drawPic(stage, pic) {
    // Récupérer les dimensions de l'écran
    let ratio = screen.width * 0.75;

    scenes.push(stage);
    const myGif = GIFGroover();
    myGif.src = pic;
    myGif.onload = gifLoad;
}
function gifLoad(event) {
    const gif = event.gif;
    const canvas = document.getElementById(scenes[count]);
    count++;
    /*canvas.width = gif.width;
    canvas.height = gif.height;*/
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    requestAnimationFrame(displayGif);
    
    function displayGif() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(gif.image, canvas.width / 2 - gif.width / 4, canvas.height / 2 - gif.height / 4, gif.width / 2, gif.height / 2);
        /*ctx.drawImage(gif.image, 0, 0, canvas.width, canvas.height);*/
        requestAnimationFrame(displayGif);
    }
} 
function createShadow() {
    // Récupérer les dimensions de l'écran
    let ratio = screen.width / 3;

    // Générer le patron de l'hologramme
    let pattern = ['north', 'south', 'east', 'west'];
    for (var i = 0; i < pattern.length; i++) {
        $("#overlay").append('<canvas id="' + pattern[i] + '" height="' + ratio + '" width="' + ratio + '"></canvas>');
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(50, 1);
        let renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.getElementById(pattern[i])});
        data[pattern[i]] = {"scene": scene, "camera": camera, "renderer": renderer};
        drawGeometry(scene, camera, renderer);
    }
}
function showDesign() {
    // Cacher l'interface
    $("#overlay").addClass('shadow');
}
function hideDesign() {
    // Revenir à l'interface
    $("#overlay").removeClass('shadow');
}
function change(choice_, shade_) {
    // Regénérer l'hologramme avec ses changements
    choice = (choice_ !== null) ? choice_ : choice;
    shade = (shade_ !== null) ? shade_ : shade;
    const keys = Object.keys(data);
    for (const key of keys) {
        while(data[key].scene.children.length > 0){ 
            data[key].scene.remove(data[key].scene.children[0]); 
        }
        if ((choice !== 0) && (choice !== 1)) {
            drawGeometry(data[key].scene, data[key].camera, data[key].renderer);
        } else {
            //drawPic(data[key].scene, pic_tab[choice]);
        }
    }
}