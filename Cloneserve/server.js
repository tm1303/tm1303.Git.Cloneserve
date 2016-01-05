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
	
	response.write('<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" type="text/javascript"></script><script src="ui.js"></script>');
	
	var subfolder ='';
	var queryData = url.parse(request.url, true).query;
	if( queryData.subfolder)
	{
		subfolder = queryData.subfolder;
	}
	console.log("search path: /"+subfolder);
	
	var searchPath = GITPATH + '\\' + subfolder;
	
	var data = fs.readdirSync(searchPath);
	
		var innerData = data.filter(function(file) {
			return fs.statSync(path.join(searchPath, file)).isDirectory();
		});	

		if(innerData.length===0)
		{
			response.write("is empty");
			response.end();	
		}
		
		for (i = 0; i < innerData.length; i++) { 
    			
			var entry = innerData[i];
			var foundPath = searchPath + '\\' + entry;			
			
			var subData =fs.readdirSync(foundPath);
			
				var hasGit = subData.some(function(subFile) {
					return fs.statSync(path.join(foundPath, subFile)).isDirectory() && (subFile === ".git");
				});
				
				if(hasGit){
					response.write(subs.text(CloneTemplate, {path : subfolder + '/' + entry, name : entry}));
				} else {
					response.write(subs.text(DrillTemplate, {path : subfolder + '\\' + entry, name : entry}));					
				};										
		};
				
	response.end();	
}

//Create a server
var server = http.createServer(handleRequest);

//Start server
server.listen(PORT, function(){
	console.log("Server listening on port: %s", PORT);
});	


