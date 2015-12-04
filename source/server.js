var express = require('express');
var app = express();


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



var port = process.env.PORT || 9000;
app.listen(port, function(){
	console.log('server listening to port ' +  port);
});