var http = require('http');
var fs = require('fs');
var path = require('path');
var Supplant = require('supplant');
var subs = new Supplant();
var url = require('url');

const PORT=5001; 

var GITPATH = process.argv[2]; //'c:\git'
var GITUSER = process.argv[3];
var GITSERVER = process.argv[4];
var GITCMDPATH = process.argv[5];
var CloneTemplate = 'git clone '+GITUSER+'@'+GITSERVER+':'+GITCMDPATH+'{{path}}';

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
		
	if( request.url.indexOf('data') > -1)
	{
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
 			var foundPath = searchPath + '\\' + entry;	
			var subData =fs.readdirSync(foundPath);
				
			var hasHeadFile = subData.some(function(subFile) {
				return fs.statSync(path.join(foundPath, subFile)).isFile() && (subFile === "HEAD");
			});
			
			var entry = innerData[i];
			if(hasHeadFile) {
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
		
		return;
	}
	
	// return index page
	var stat = fs.statSync('index.html');
	response.writeHead(200, {
		'Content-Type': 'text/html',
		'Content-Length': stat.size
	});

	var readStream = fs.createReadStream('index.html');
	readStream.pipe(response);
	return;
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
	console.log("Server listening on port: %s", PORT);
	console.log("Git root: %s", GITPATH);
});	


