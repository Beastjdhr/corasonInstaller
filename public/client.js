$(document).ready(function () {
    console.log(200);
  $('#msg').text("Checking OS...");

    $.get('http://localhost:8080/checkOS', function(data, status) {
        console.log(data);
        if (data.se != undefined) {
            stop("Error occured during OS check", data.se);
        }
        if (data.so != undefined) {
            var OS= data.code === 1 ? "Linux" : "MacOS";
            console.log(OS);
            next("OS found: " + OS, "Verifying Docker is installed...");
            if (data.code===1) {
                installForLinux();
            }
            else if (data.code===2) {
                installForMac();
            }
        }
    });




    function installForLinux() {
        $.post('http://localhost:8080/checkDocker', {code: 1}, function (data) {
            if (data.code == 1) {
                next("Docker is installed", "Installing CORASON...");
            }
            if (data.code == 2) {
                next("Docker is not installed <br> Docker will be installed", "Installing Docker");
            }
            if (data.code == 4) {
                stop(data.error);
            }
        });
    }




    function next(msg, step) {
        $("#output").append("<p class='initSuccess'>" + msg + "</p>");
        $("#msg").text(step);
    }


    function stop(msg, error) {
        $('#msg').text(msg);
        $("#msg").css({ "margin-top": "7.5vh", "color": "#f00", "margin-right": "9vw" });
        $(".loader").hide();
        $('#output').append("<p class='initError'>An error occured: " + error + "</p>");

    }
});