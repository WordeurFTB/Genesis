markdown: kramdown
# Genesis

Genesis is an application platform that allows users to create, customize, and display holograms.

## Access

We use a [Docker](https://github.com/nanoninja/docker-nginx-php-mysql) as server structure.
And there are two access points :

Genesis' Web App : [APP](https://genesis-app.fr/)  
Genesis' Database : [DB](http://genesis-app.fr:8080/)

## License

We use several frameworks, libraries, and GitHub repositories :

[jQuery](https://jquery.com/)
```js
$("#connect-btn").click(function() {
  $.ajax({
    type: 'POST',
    dataType: 'JSON',
    url: JSON.parse(sessionStorage.getItem('genesis_config')).api_path,
    data: JSON.stringify({
      "action" : "connect-user",
      "email" : $('#email').val(),
      "password" : hash($('#password').val())
    }),
    success: function(result) {
      if (result.token) {
        localStorage.setItem('user_cache', JSON.stringify(result));
        redirect('./editor.html');
      }
    },
    error: function(xhr, ajaxOptions, thrownError) {
      $('#email').val('');
      $('#password').val('');
    }
  });
});
```

[CryptoJS](https://cryptojs.gitbook.io/)
```js
var hash = CryptoJS.SHA3("Message", { outputLength: 256 });
```

[Three.js](https://threejs.org/)
```js
// TEXT
const loader = new THREE.FontLoader();
loader.load( 'fonts/droid/droid_serif', function ( font ) {
  const geometry = new THREE.TextGeometry( 'ABC', {
    font: font,
    size: 10,
    height: 5,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 0.5,
    bevelOffset: 0,
    bevelSegments: 3
  } );
} );

// CUBE
const geometry = new THREE.BoxGeometry( 15, 15, 15, 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
```

[GIFGroover](https://github.com/blindman67/GIFGroover)
```js
var myCanvas = document.createElement("canvas");
const myGif = GIFGroover();
myGif.src = "gifurl.gif";
myGif.onload = gifLoad;
function gifLoad(event) {
  const gif = event.gif;
  const canvas = document.createElement("canvas");
  canvas.width = gif.width;
  canvas.height = gif.height;
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  requestAnimationFrame(displayGif);
  function displayGif(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(gif.image);
    requestAnimationFrame(displayGif);
  }
}
```
