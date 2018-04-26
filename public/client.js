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
                next("Docker is installed", "Checking if CORASON is installed");
                isCorasonInstalled(1);
            }
            if (data.code == 2) {
                next("Docker is not installed <br> Docker will be installed", "Installing Docker");
            }
            if (data.code == 3) {
                next("Docker is not installed, so it will be installed", "Installing Docker");
                $.get('http://localhost:8080/aptinstall', function (data) {
                    if (data.code == 1) {
                        next("Docker has been installed", "Checking if  CORASON is installed");
                        isCorasonInstalled(1);
                    }
                });
            }
            if (data.code == 4) {   
                stop(data.error, "An error occured while checking if Docker is installed");
            }
        });
    }

    function isCorasonInstalled(OS) {
        // os=1 => Linux
        if (OS ===1) {
            $.post('http://localhost:8080/imageLookup', {code :1}, function(data) {
                if (data.code == 0) {
                    next('CORASON is not installed', 'Installing CORASON (this might take a while)');
                    $.post('http://localhost:8080/installCORASON', {code: 1}, function(data) {
                        if (data.code == 0) {
                            stop("An error occcured during CORASON's installation", data.se);
                        }
                        else if (data.code == 1) {
                            next("CORASON installed succesfully", "Redirecting you to CORASON's UI");
                            window.location.replace("http://localhost:8080/corason");
                        }
                    });
                }
                else if (data.code == 1) {
                    next("CORASON is installed", "Redirecting you to CORASON's UI");
                    window.location.replace("http://localhost:8080/corason");

                }
            });
            // var checkImages= bash()
        }
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