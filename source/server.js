var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '2mb'}));

var publicPath = path.join(__dirname, 'public');

app.use('/public', express.static(publicPath));

var getAbsoluteHtmlPath = function(relativePath){
    return path.join(__dirname, '/public/html/', relativePath);
};

var files = {
    index: getAbsoluteHtmlPath('index.html'),
    food: getAbsoluteHtmlPath('food.html'),
    tree: getAbsoluteHtmlPath('tree.html')
};

app.get('/', function(req, res){
    console.log('/ ' + req.connection.remoteAddress );
	res.sendFile(files.index);
});

app.get('/food', function(req, res){
    console.log('/food ' + req.connection.remoteAddress );
	res.sendFile(files.food);
});

app.get('/a/tree', function(req, res){
    console.log('/a/tree ' + req.connection.remoteAddress );
    res.sendFile(files.tree);
});

app.get('/crab', function(req, res){
  res.send('this page is dedicated to crabs');
});

app.get('/niz', function(req, res){
  res.send('this page is also dedicated to crabs... I mean niz');
});

app.get('/gar', function(req, res){
  res.send('you sneaky devilsauce');
});

var port = process.env.PORT || 9000;
app.listen(port, function(){
	console.log('server listening to port ' +  port);
});
