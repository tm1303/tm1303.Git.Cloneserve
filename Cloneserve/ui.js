

$(function(){

	
	$('#tree_view').jstree({
		'core' : {
		  'data' : {
			"url" : ".",
			"data" : function (node) {
			  return { "id" : node.id };
			}
		  }
		}
	  });	

	$('.js-textareacopybtn').on("click", function(){
		
		$(this).parent().find('textarea').select();
		
		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successfully copied clone command to clipboard' : 'unsuccessful';
			
			$(this).parent().find('textarea').after(msg)
			
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