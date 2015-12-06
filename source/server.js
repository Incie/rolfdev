var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '2mb'}));
//app.use(cookieParser());

var publicPath = path.join(__dirname, 'public');

app.use('/public', express.static(publicPath));

var getAbsoluteHtmlPath = function(relativePath){
    return path.join(__dirname, '/public/html/', relativePath);
};

var files = {
    index: getAbsoluteHtmlPath('index.html'),
    food: getAbsoluteHtmlPath('food.html')
};

app.get('/', function(req, res){
	res.sendFile(files.index);
});

app.get('/food', function(req, res){
	res.sendFile(files.food);
});

app.get('/crab', function(req, res){
  res.send('this page is dedicated to crabs');
});

app.get('/niz', function(req, res){
  res.send('this page is also dedicated to crabs... I mean niz <winkyemote>');
});

app.get('/gar', function(req, res){
  res.send('you sneaky devilsauce');
});

var port = process.env.PORT || 9000;
app.listen(port, function(){
	console.log('server listening to port ' +  port);
});
