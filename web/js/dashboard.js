/*
* RESPONSIBLE FOR DASHJBOARD DATA
*/
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
	var ordersStat          = [];
	var hardwareOverallInfo = {};

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

	        var totalUsed = 0; 
	        for(var d=0; d<jsonData.length;d++) {
	        	var appVersion = jsonData[d].AppVersion; 
	        	var usedCount = jsonData[d].UsedCount; 
	        	appVersionShareData.push({label: appVersion, value: usedCount});
	        	totalUsed += usedCount; 
	        }

	        appVersionShareData.totalUsed = totalUsed; 
	        appVersionShareData.getTotalInfo = function() {
	        	return "Total used count: " + this.totalUsed;
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
			var totalErrors = 0; 
			for(var i=0; i<length;i++) {
				var j = jsonData[i];
			
				errorsDistribution.push({label:j.ErrorTitle, value: j.Count});
			    totalErrors += j.Count; 
			}

		
			errorsDistribution.totalErrors = totalErrors; 
	        errorsDistribution.getTotalInfo = function() {
	        	return "Total erros count: " + this.totalErrors;
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
			var totalOrders = 0; 
			for(var i=0; i<length;i++) {
				var j = jsonData[i];
			
				ordersStat.push({label:j.ActionName, value: j.Count});
				totalOrders+= j.Count;
			}


			ordersStat.totalOrders = totalOrders; 
	        ordersStat.getTotalInfo = function() {
	        	return "Total orders count: " + this.totalOrders;
	        }

			chartBinder.bindDataToChart("donut", "ordersStatPieChart", ordersStat)
		});

		oStat.fail(function(err) {
			console.log(err);
		});
		// ----- 


		//query OS distribution
		var hardwareInfo = $.ajax( {
			type: "GET", 
			url: window.location.href + "/getHardwareOverallInfo",	
			data : dateRange

		});

		hardwareInfo.done(function(jsonData) {

		
			var length = jsonData.length;

			var osCollector = {}; 
			var procCollector = {}; 
			var countriesCollector = {}; 
			var architectureCollector = {}; 
			for(var i=0; i<length;i++) {
				var j = jsonData[i];
				
				//collect OSes 
				if(!osCollector[j.OS]) 
					osCollector[j.OS] = 0; 				
				osCollector[j.OS] ++;


				//collect Processors 
				if(!procCollector[j.Processor])
					procCollector[j.Processor] = 0; 
				procCollector[j.Processor] ++; 

				//collect languages 
				if(!countriesCollector[j.Country])
					countriesCollector[j.Country] = 0; 
				countriesCollector[j.Country] ++; 

			    //collect architecture 
				if(!architectureCollector[j.Architecture])
					architectureCollector[j.Architecture] = 0; 
				architectureCollector[j.Architecture] ++; 
			}

			hardwareOverallInfo = {}; 
			
			//construct OS info 			
			hardwareOverallInfo.osDistr = []; 
			for(var prop  in osCollector) {
				hardwareOverallInfo.osDistr.push({label:prop, value: osCollector[prop]});				
			}
			
			hardwareOverallInfo.osDistr.totalOs = hardwareOverallInfo.osDistr.length; 
	        hardwareOverallInfo.osDistr.getTotalInfo = function() {
	        	return "Total OS count: " + this.totalOs;
	        }

			// ------- 


			//construct processor info 
			
			hardwareOverallInfo.procDistr = []; 
			for(var prop  in procCollector) {
				hardwareOverallInfo.procDistr.push({label:prop, value: procCollector[prop]});
				
			}
			hardwareOverallInfo.procDistr.totProc = hardwareOverallInfo.procDistr.length; 
	        hardwareOverallInfo.procDistr.getTotalInfo = function() {
	        	return "Total Processors count: " + this.totProc;
	        }
			// ---------------

			//construct language info 
		
			hardwareOverallInfo.countriesDistr = []; 
			for(var prop  in countriesCollector) {
				hardwareOverallInfo.countriesDistr.push({label:prop, value: countriesCollector[prop]});
			}
			hardwareOverallInfo.countriesDistr.totLanguages = hardwareOverallInfo.countriesDistr.length; 
	        hardwareOverallInfo.countriesDistr.getTotalInfo = function() {
	        	return "Total Languages used: " + this.totLanguages;
	        }
			// ----------------------


			//construct architecture info 
			hardwareOverallInfo.archDistr = []; 
			for(var prop  in architectureCollector) {
				hardwareOverallInfo.archDistr.push({label:prop, value: architectureCollector[prop]});
			}
			hardwareOverallInfo.archDistr.totArchitecture = hardwareOverallInfo.archDistr.length; 
	        hardwareOverallInfo.archDistr.getTotalInfo = function() {
	        	return "Total Architectures used: " + this.totArchitecture;
	        }
			// ------------------------


			chartBinder.bindDataToChart("donut", "osesPieChart", hardwareOverallInfo.osDistr);
			chartBinder.bindDataToChart("donut", "processorsPieChart", hardwareOverallInfo.procDistr);
			chartBinder.bindDataToChart("donut", "osLanguagesPieChart", hardwareOverallInfo.countriesDistr);
			chartBinder.bindDataToChart("donut", "archPieChart", hardwareOverallInfo.archDistr);
		});

		hardwareInfo.fail(function(err) {
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

   				$("#osesPieChart").empty();  		            
				chartBinder.bindDataToChart("donut", "osesPieChart", hardwareOverallInfo.osDistr);

				$("#processorsPieChart").empty();  		            
				chartBinder.bindDataToChart("donut", "processorsPieChart", hardwareOverallInfo.procDistr);

				$("#osLanguagesPieChart").empty();  		            
				chartBinder.bindDataToChart("donut", "osLanguagesPieChart", hardwareOverallInfo.countriesDistr);

				$("#archPieChart").empty();  		            
				chartBinder.bindDataToChart("donut", "archPieChart", hardwareOverallInfo.archDistr);

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
