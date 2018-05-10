// modules required
var express = require('express');
var bash = require('child_process').exec;
var path = require('path');
var fileUpload= require('express-fileupload');
var bodyParser= require('body-parser');

// middleware
var app = express();

app.set('views', 'public');
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.set('views', 'views');
app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'public'));
// global variables
var sudo= '';
var getSudo = bash('grep userPassword userData.txt', function (err, so, se) {
    // parsing user password
    var start = so.indexOf('<!<');
    sudo = so.slice(start + 3, -5);
});


// routes
app.get('/', function (req, res) {
    var checkInstallation= bash('grep CORASON_installed= ', function(err, so, se) {
        if (so.length > 1 && so.match(/installed= true/)) {
            res.render('corason');
        }
    });
    res.render('corasonInstaller');
});

app.get('/checkOS', function(req, res) {
    console.log('checkingOS');
    var check= bash('uname -s', function(err, so, se) {
        console.log(so);
        if (se) {res.json({se: se})}
        if (so.match(/Linux/g)) {res.json({so:so, code: 1})}
        if (so.match(/Darwin/g)) {res.json({code:2})}
        // if (err) {throw err}
    });
});

app.post('/checkDocker', function(req, res) {
    if (req.body.code== 1) {
        console.log(223);
        // checking if Docker is installed on Linux
        // console.log('LINUX');
        var check= bash('dpkg -l | grep docker', function(err, so, se) {
            if (so != undefined && (so.match(/docker.io/) || so.match(/docker-ce/) || so.match(/docker-engine/) )) {
                var inst= bash('docker', function (err, so, se) {
                    console.log("SE: " + se);
                    console.log("SO: " + so);
                    if (se.match(/not found/)) {
			console.log('NOT INSTALLED');
			 res.json({code: 3});
			return;
			}
                    else if (! se.match(/not found/)) {
			console.log('INSTALLED');
			res.json({code: 1});
			return;
			}
                });  
            } 
            else if (so != undefined && (! so.match(/docker.io/) || ! so.match(/docker-ce/) || ! so.match(/docker-engine/) )) res.json({code: 0});
            else if (so == undefined || so.length < 3) res.json({code : 0});
            else if (se) res.json({code: 4, error: se});
        });
    }

});

app.get('/aptinstall', function(req, res) {
    var getSudo = bash('grep userPassword userData.txt', function (err, so, se) {
        // parsing user password
        var start = so.indexOf('<!<');
        sudo = so.slice(start + 3, -5);
        console.log(sudo);
        var installCommand = 'echo ' + sudo + ' | sudo -S apt install -y docker.io';
        console.log(installCommand);
        var aptinstall = bash(installCommand, function (err, so, se) {
		console.log(so);
		console.log(se);
            var confirm = bash('docker', function (err, so, se) {
		console.log('confirming Docker is ready to run...');
                if (!se.match(/not found/)) {
		    console.log('SENDING CODE 1 TO CLIENT');
                    res.json({code: 1});
                }
                // });
            });
            console.log(so, se);
        });
    });
});

app.post('aptGetInstall', function(req, res) {	
    var getSudo = bash('grep userPassword userData.txt', function (err, so, se) {
        // parsing user password
        var start = so.indexOf('<!<');
        sudo = so.slice(start + 3, -5);
        console.log(sudo);
	//the installation has various steps
	var aptGetUpdate= 'echo ' + sudo + ' | sudo -S apt-get -y update';
	var addKey= 'echo ' + sudo + ' | sudo -S apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D';
	var addRepo= 'echo ' + sudo + " | sudo -S apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'";
	var installDocker= 'echo ' + sudo + ' | sudo -S apt-get install -y docker-engine';

	var update= bash(aptGetUpdate, function(err, so, se) {
		var addKeyCommand= bash(addKey, function(err, so, se) {
			console.log('adding key');
			console.log(so);
			console.log('===============');
			console.log(se);
			var updateAgain= bash(aptGetUpdate, function(err, so, se) {
				var addRepoCommand= bash(addRepo, function(err, so, se) {
					console.log('adding repo');
					console.log(so);
					console.log('==============');
					console.log(se);
					var installDockerCommand= bash(installDocker, function(req, res) {
						console.log('installing docker');
						console.log(so);
						console.log('===================');
						console.log(se);
						});
					});
				});
			});
		});
	});
});

app.post('/imageLookup', function(req, res) {
    if (req.body.code == 1) {
        var imgs_command= `echo ` + sudo + ' | sudo -S docker images';
        var checkImgs= bash(imgs_command, function(err, so, se) {
            if (! so.match(/nselem\/evodivmet/)) {
                console.log(404);
                res.json({code: 0 });
            }
            else {
                console.log(900);
                var update= bash('perl update.pl evodivmet', function(err, so, se) {
                  console.log(so);  
                });
                res.json({code: 1});
            }
        });
    }
});

app.get('/corason', function(req, res) {
    res.render('corason');
});

app.post('/installCORASON', function(req, res) {
    if (req.body.code ==1) {
        var install_command= 'echo ' + sudo + ' | sudo -S docker pull nselem/evodivmet:latest';
        console.log(install_command);
        var installCORASON= bash(install_command, function(err, so, se) {
            console.log("SO: " + so);
            console.log("SE: " + se);
            if (se.length < 1) {
                res.json({code: 1});
                var update= bash('perl update.pl evodivmet');
            }
            else if (se.length > 3) {
                res.json({code: 0, se: se});    
            }
        });
    }
});

app.post('/run', function(req, res) {
    var corason_run = 'echo ' + sudo + ' | sudo -S docker run --rm -i -v $(pwd):/usr/src/CORASON' + ' nselem/evodivmet SSHcorason.pl ' + req.body.data.query + " " + req.body.data.ids + ' 501861';
    console.log(req.body);
    var RUN= bash(corason_run, function(err, so, se) {
        console.log('CORASON FINISHED RUNNING');
        if (so.match(/have a nice day/gi)) {
            console.log('sending code 1 to client');
            // return res.status(200).json({code: 1});
            console.log(req.body.data.query.slice(0, req.body.data.query.indexOf('.') ));
            var launchSVG= bash('perl createViewer.pl '+ req.body.data.query.slice(0, req.body.data.query.indexOf('.') ), function (err, so, se) {
                if (err) console.log(err);
                if (se) console.log(se);
                if (so) console.log(so);
            });
        }
        if (err) res.json({code: 4, msg: err});
        if (se.length>3 ) {
            res.status(200).json({code: 4, msg: se});
        }
    });
});



app.listen(8080, function () {
    var launch = bash('firefox 127.0.0.1:8080', function (err, stdout, stderr) {
         if (err) throw err;
         console.log(stdout);
         console.log(stderr);
     });
    console.log('SERVER STARTED ON PORT 8080');
});
