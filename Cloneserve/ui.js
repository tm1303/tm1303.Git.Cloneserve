

$(function(){

	
	$('#tree_view').jstree({
		'core' : {
		  'data' : {
			"url" : "data",
			"data" : function (node) {
			  return { "id" : node.id };
			}
		  }
		}
	  });	

	$('#tree_view').on("select_node.jstree", function(node, selected, event){
		
		var clonecmd = selected.node.a_attr['data-clone'];
		if(!clonecmd)
			return;
		
		var copybin = $('#copybin');
		copybin.val(clonecmd);
		copybin.select();
		
		try {
			var successful = document.execCommand('copy');
			var msg = successful ? alert('successfully copied clone command to clipboard') : alert('unsuccessful');
			
			//$(this).parent().find('textarea').after(msg)
			
		} catch (err) {
			console.log('Oops, unable to copy');
		}		
	});

});



//	var copyTextareaBtn = document.querySelector('.js-textareacopybtn');
//
//	copyTextareaBtn.addEventListener('click', function(event) {
//	  var copyTextarea = document.querySelector('.js-copytextarea');
//	  copyTextarea.select();
//
//	  try {
//		var successful = document.execCommand('copy');
//		var msg = successful ? 'successful' : 'unsuccessful';
//		console.log('Copying text command was ' + msg);
//	  } catch (err) {
//		console.log('Oops, unable to copy');
//	  }
//	});