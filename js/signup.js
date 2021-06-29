if (sessionStorage.getItem('genesis_config')) {
    if (localStorage.getItem('user_cache')) {
        window.location.replace('./home.html');
    } else {
        $("#register-btn").click(function() {
            $.ajax({
                type: 'POST',
                dataType: 'JSON',
                url: JSON.parse(sessionStorage.getItem('genesis_config')).api_path,
                data: JSON.stringify({
                    "action" : "create-user",
                    "email" : lower($('#email').val()),
                    "password" : hash($('#password').val()),
                    "firstname" : capitalize($('#firstname').val()),
                    "lastname" : upper($('#lastname').val())
                }),
                success: function(result) {
                    if (result.token) {
                        localStorage.setItem('user_cache', JSON.stringify(result));
                        redirect('./home.html');
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    $('#email').val('');
                    $('#password').val('');
                    $('#firstname').val('');
                    $('#lastname').val('');
                }
            });
        });
        $("#login-btn").click(function() {
            redirect('./login.html')
        });
    }
} else {
    window.location.replace('../index.html');
}
function lower(txt) {
    return txt.toLowerCase();
}
function upper(txt) {
    return txt.toUpperCase();
}
function capitalize(txt) {
    if (txt.length > 0) {
        return txt[0].toUpperCase() + txt.slice(1).toLowerCase();
    } else {
        return txt;
    }
}
function hash(string) {
    return CryptoJS.SHA3(string, { outputLength: 256 }).toString();
}
function redirect(location) {
    $("body").fadeOut("slow", function() {
        window.location.replace(location);
    });
}