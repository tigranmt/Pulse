var RemoteQueryService = new (function() {


	this.get = function(url, data, done, fail) {
		
		var ajaxQuery = $.ajax({
			type: "GET",
			url: window.location.href + url,	
			data : data
		}); 


		ajaxQuery.done(function(data) {
			done(data);
		});

		ajaxQuery.fail(function(err) {
			fail(err);
		});
	}


})();