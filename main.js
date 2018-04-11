var express = require('express');
var bash = require('child_process').exec;
var path = require('path');

var bodyParser= require('body-parser');


var app = express();

app.set('views', 'public');
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.render('home');
});

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


app.get('/', function (req, res) {
    res.render('corason');
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
            if (so != undefined && so.match(/docker.io/)) res.json({code: 1});
            if (so != undefined && ! so.match(/docker.io/)) res.json({code: 0});
            if (so == undefined || so.length < 3) res.json({code : 0});
            if (se) res.json({code: 4, error: se});
        });
    }

});



app.listen(8080, function () {
    // var launch = exec('firefox 127.0.0.1:8080', function (err, stdout, stderr) {
    //     if (err) throw err;
    //     console.log(stdout);
    //     console.log(stderr);
    // });
    console.log('SERVER STARTED ON PORT 8080');
});