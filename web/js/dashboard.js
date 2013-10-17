(function() {

	//assign start and end date to the current and one week ago
	var curDate = new Date();	
	var month = curDate.getMonth() ;
	var locale = curDate.toLocaleDateString(); 
	var startDate = curDate.getFullYear() + "-" + ("0" + month).slice(-2) + "-" + ("0" + curDate.getDate()).slice(-2); 

	month++; 
	var endDate = curDate.getFullYear() + "-" + ("0" + month).slice(-2) + "-" + ("0" + curDate.getDate()).slice(-2); 
	$(".startDate").val(startDate);
	$(".endDate").val(endDate);
	

	var appVersionShareData = []; 
	var appHoursPerDay 		= [];
	var errorsDistribution 	= [];
	var ordersStat       = [];

	// ------------------------------------------------------------------------------


	var setData = function() {
			//query for version destribution 

		var start = $(".startDate").val(); 
		var end = 	$(".endDate").val(); 

		$("#versionsSharePie").empty();	        	
	    $("#hoursPerDayBar").empty();

		var dateRange = {startDate : start, endDate:end};

		var appDistribution = $.ajax({
			type: "GET",
			url: window.location.href + "/getAppVersionsDistribution",	
			data : dateRange
		}); 

		appDistribution.done(function(jsonData) {
			console.log(jsonData);

	        appVersionShareData = [];

	        for(var d=0; d<jsonData.length;d++) {
	        	var appVersion = jsonData[d].AppVersion; 
	        	var usedCount = jsonData[d].UsedCount; 
	        	appVersionShareData.push({label: appVersion, value: usedCount});
	        }

			chartBinder.bindDataToChart("donut", "versionsSharePie", appVersionShareData);
			
		});

		appDistribution.fail(function(err) {
			console.log(err);
		});
		// -------------


		//query for use time per day 
		var usedTimePerDay = $.ajax( {
			type: "GET", 
			url: window.location.href + "/getAvgUseTimePerDay",	
			data : dateRange

		});

		usedTimePerDay.done(function(jsonData) {

			appHoursPerDay = []; 
			var length = jsonData.length;
			for(var i=0; i<length;i++) {
				var j = jsonData[i];
			
				var fl =  parseFloat(j.totMin/60);

				appHoursPerDay.push({day:j.date, value: fl.toFixed(1)});
			}

			chartBinder.bindDataToChart("bar", "hoursPerDayBar", appHoursPerDay)
		});

		usedTimePerDay.fail(function(err) {
			console.log(err);
		});
		//--------------------------------------


		//query errors per type in period 
		var errorsDistr = $.ajax( {
			type: "GET", 
			url: window.location.href + "/getErrorsDistributionInPeriod",	
			data : dateRange

		});

		errorsDistr.done(function(jsonData) {

			errorsDistribution = []; 
			var length = jsonData.length;
			for(var i=0; i<length;i++) {
				var j = jsonData[i];
			
				errorsDistribution.push({label:j.ErrorTitle, value: j.Count});
			}

			chartBinder.bindDataToChart("donut", "errorsPieChart", errorsDistribution)
		});

		errorsDistr.fail(function(err) {
			console.log(err);
		});
		// ----- 


		//query orders stat pie
		var oStat = $.ajax( {
			type: "GET", 
			url: window.location.href + "/getOrdersStat",	
			data : dateRange

		});

		oStat.done(function(jsonData) {

			ordersStat = []; 
			var length = jsonData.length;
			for(var i=0; i<length;i++) {
				var j = jsonData[i];
			
				ordersStat.push({label:j.ActionName, value: j.Count});
			}

			chartBinder.bindDataToChart("donut", "ordersStatPieChart", ordersStat)
		});

		oStat.fail(function(err) {
			console.log(err);
		});
		// ----- 

		
	}
	

	setData();
	// -------------------


	//handle resize 
	$(window).bind('resize', function(e)
	{
	    window.resizeEvt;
	    $(window).resize(function()
	    {
	        clearTimeout(window.resizeEvt);
	        window.resizeEvt = setTimeout(function()
	        {
	        	$("#versionsSharePie").empty();
	        	chartBinder.bindDataToChart("donut", "versionsSharePie", appVersionShareData);	    

	        	$("#hoursPerDayBar").empty();    	
	            chartBinder.bindDataToChart("bar",   "hoursPerDayBar", appHoursPerDay);

	            $("#errorsPieChart").empty();   
	            chartBinder.bindDataToChart("donut", "errorsPieChart", errorsDistribution)   	


	            $("#ordersStatPieChart").empty();  		
	            chartBinder.bindDataToChart("donut", "ordersStatPieChart", ordersStat)
	            

	        }, 250);
	    });
	});
	// -----------------------


    //handle update click 
	$("#updateQuery").bind("click", function() {

		setData();

	});
	//-------

})(); 
