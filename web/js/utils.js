var Utils = Utils || {

	showModal : function(title, message) {
		title = title || ""; 
		message = message || ""; 

       	if(title === "" || message === "")
       		return; 		

       	var modal = $('#errorDetails');
        if(modal.length > 0) {
			modal.remove();
        }
		
		

		$(document.body).append("<div id='errorDetails' class='modal fade'> " + 
  					 "<div class='modal-dialog'>" + 
    					"<div class='modal-content'>" + 
      						"<div class='modal-header'>" + 
        						"<button type='button' class='btn btn-success pull-right' data-dismiss='modal'>Close</button>"+
        						"<h4 class='modal-title'>" + title + "</h4>" + 
      						"</div>" + 
      						"<div class='modal-body' style='overflow: scroll;'>" + 
        						"<p>" + message + "</p>" + 
      						"</div>" +       						
    					"</div>"+
 					 "</div>" + 
					"</div>");

		


		$('#errorDetails').modal('show');
			
	},




	formatDate : function(date) {		
		var splits = date.split("/"); 
		return splits[2] + "-" + splits[1] + "-" + splits[0];
	}

};