if (sessionStorage.getItem('genesis_config')) {
    if (localStorage.getItem('user_cache')) {
        window.location.replace('./editor.html');
    } else {
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
    }
} else {
    window.location.replace('../index.html');
}
function capitalize(txt) {
    return txt[0].toUpperCase() + txt.slice(1).toLowerCase();
}
function hash(string) {
    return CryptoJS.SHA3(string, { outputLength: 256 }).toString();
}
function redirect(location) {
    $("body").fadeOut("slow", function() {
        window.location.replace(location);
    });
}