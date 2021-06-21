/*
 * Récupération et enregistrement de la configuration de l'application web
 * Redirection automatique
 */
async();
async function async() {
    let genesis_config = await loadConfig();
    saveConfig(genesis_config);
    if (localStorage.getItem('user_cache')) {
        redirect('./app/editor.html');
    } else {
        redirect('./app/login.html');
    }
}
function loadConfig() {
    return $.getJSON('./genesis_config.json', function(data) {
        return data;
    });
}
function saveConfig(data) {
    let cache = JSON.stringify(data);
    sessionStorage.setItem('genesis_config', cache);
}
function doFade(location) {
    $("body").delay(1000).fadeOut("slow", function() {
        redirect(location);
    });
}
function redirect(location) {
    $("body").delay(1500).fadeOut("slow", function() {
        window.location.replace(location);
    });
}