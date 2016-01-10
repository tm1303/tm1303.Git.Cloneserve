var http = require('http');
var fs = require('fs');
var path = require('path');
var Supplant = require('supplant');
var subs = new Supplant();
var url = require('url');

const PORT=5001; 

const GITPATH = 'c:\git'
const CloneTemplate = 'git clone gituser@tddev01:git{{path}}';

function handleRequest(request, response){
		
	if( request.url.indexOf('favicon.ico') > -1)
	{
		response.end();
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
		readStream.pipe(response);
		return;
	}
	
	var subfolder ='';
	var jsonData;
	var nodeCollection;
	var queryData = url.parse(request.url, true).query;
	if( queryData.id && queryData.id!='#')
	{
		subfolder = queryData.id;
		console.log(subfolder);		
		jsonData =  [];
		nodeCollection = jsonData;
	} else {
		jsonData = {"text" : "Git Root", "children" : []};
		nodeCollection = jsonData['children'];
	}
	console.log("search path: /"+subfolder);
	
	var searchPath = GITPATH + '\\' + subfolder;
	
	var data = fs.readdirSync(searchPath);
	
	var innerData = data.filter(function(file) {
		return fs.statSync(path.join(searchPath, file)).isDirectory();
	});	

	// if(innerData.length===0)
	// {
		// response.write(". is empty");
		// response.end();	
		// return;
	// }
	for (i = 0; i < innerData.length; i++) { 
			
		var entry = innerData[i];
		if(entry.indexOf('.git') > -1) {
			nodeCollection.push({
				'text' : entry, 
				'icon' : 'jstree-file', 
				'id' : subfolder + '\\' + entry, 
				'a_attr' : { 'data-clone' : 'git clone gituser@tddev01:git' + subfolder + '\\' + entry}
			});
			//response.write(subs.text(CloneTemplate, {path : subfolder + '/' + entry, name : entry}));
		} else {				
			nodeCollection.push({'text' : entry, 'children' : true, 'id' : subfolder + '\\' + entry});
			//response.write(subs.text(DrillTemplate, {path : subfolder + '\\' + entry, name : entry}));
		}
	};		
	
	response.setHeader('Content-Type', 'json')
	response.end(JSON.stringify(jsonData));
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
	console.log("Server listening on port: %s", PORT);
});	


