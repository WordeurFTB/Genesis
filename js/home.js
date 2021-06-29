if (sessionStorage.getItem('genesis_config')) {
    if (!(localStorage.getItem('user_cache'))) {
        window.location.replace('./login.html');
    } else {
        // Générer le bouton de visualisation
        $("body").append('<button id="holo-btn"></button>');
        $('#holo-btn').click(function() {
            document.body.requestFullscreen();
        });

        // Charger le nom de l'utilisateur
        let user = null;
        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: JSON.parse(sessionStorage.getItem('genesis_config')).api_path,
            data: JSON.stringify({
                "action" : "get-user",
                "token" : JSON.parse(localStorage.getItem('user_cache')).token
            }),
            success: function(result) {
                user = result;
                if (result.firstname) {
                    $('#name').html(result.firstname);
                }
            }
        });

        // Charger les hologrammes de l'utilisateur
        let holograms = null;
        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: JSON.parse(sessionStorage.getItem('genesis_config')).api_path,
            data: JSON.stringify({
                "action" : "get-designs",
                "token" : JSON.parse(localStorage.getItem('user_cache')).token
            }),
            success: function(result) {
                holograms = result;
                for (const [key, design] of Object.entries(result)) {
                    $('#holo-scroll').append(`<button class="choice" value="${design.id}" onclick="choice(this)"><uno id='name'>${design.name}</uno><uno id='date'>${design.modified}</uno></button><br><br>`);
                }
            }
        });
    }
} else {
    window.location.replace('../index.html');
}
function choice(itm) {
    let key = itm.value;
    redirect('./editor.html?hologram=' + key);
}
function redirect(location) {
    $("body").fadeOut("slow", function() {
        window.location.replace(location);
    });
}