var http = require('http');
var fs = require('fs');
var path = require('path');
var Supplant = require('supplant');
var subs = new Supplant();
var url = require('url');

const PORT=5001; 

const GITPATH = 'c:\git'
const CloneTemplate = '<p>Repo: <button class="js-textareacopybtn">Clone {{name}}</button><textarea class="js-copytextarea" style="width: 0px; position: absolute; top: -50px;">git clone gituser@tddev01:git{{path}}</textarea></p>';
const DrillTemplate = '<p>Folder: <a href="?subfolder={{path}}">{{name}}</a></p>';

function handleRequest(request, response){
		
	if( request.url.indexOf('favicon.ico') > -1)
	{
		response.end();
		//console.log('facicon request cancelled');
		return;
	}
	
	if( request.url.indexOf('ui.js') > -1)
	{
		var stat = fs.statSync('ui.js');

		response.writeHead(200, {
			'Content-Type': 'application/javascript',
			'Content-Length': stat.size
		});

		var readStream = fs.createReadStream('ui.js');
		// We replaced all the event handlers with a simple call to readStream.pipe()
		readStream.pipe(response);
		return;
	}
	
	if( request.url.indexOf('index.html') > -1)
	{
		var stat = fs.statSync('index.html');

		response.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Length': stat.size
		});

		var readStream = fs.createReadStream('index.html');
		// We replaced all the event handlers with a simple call to readStream.pipe()
		readStream.pipe(response);
		return;
	}
	
	var subfolder ='';
	var queryData = url.parse(request.url, true).query;
	if( queryData.subfolder)
	{
		subfolder = queryData.subfolder;
		console.log(subfolder);
	}
	
	var searchPath = GITPATH + '\\' + subfolder;
	
	fs.readdir(searchPath, function (err, data) {
		console.log('search path: ' + searchPath);
		if (err) throw err;
	  
		data = data.filter(function(file) {
			return fs.statSync(path.join(searchPath, file)).isDirectory();
		});	

		var jsonData = {"text" : "Git Root", "children" : []};
				
		data.forEach(function(entry) {
			if(entry.indexOf('.git') > -1) {
				jsonData['children'].push({'text' : entry, 'icon' : 'jstree-file'});
				//response.write(subs.text(CloneTemplate, {path : subfolder + '/' + entry, name : entry}));
			} else {				
				jsonData['children'].push({'text' : entry, 'children' : true});
				//response.write(subs.text(DrillTemplate, {path : subfolder + '\\' + entry, name : entry}));
			}
			//console.log(entry);
		});		
		
		response.setHeader('Content-Type', 'json')
		response.end(JSON.stringify(jsonData));
	});
		
	//var queryData = request.url.parse(request.url, true).query;		
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
	console.log("Server listening on port: %s", PORT);
});	


