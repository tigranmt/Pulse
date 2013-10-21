$(function() {

	var imgArray = ["web/images/image03.jpg", "web/images/image02.jpg", "web/images/image01.jpg"]; 
	var backgroundImage = $(".gridbody img"); 
	if(backgroundImage.length === 0)
		return; 

	var arrIndex = 0; 
	setInterval(function() {
		if(arrIndex > imgArray.length -1)
			arrIndex = 0; 
		backgroundImage.attr("src", imgArray[arrIndex]);
		arrIndex ++;

	}, 25000); 

});