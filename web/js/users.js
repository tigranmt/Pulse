(function() {

	var curDate = new Date();	
	var month = curDate.getMonth() ;
	var startDate = curDate.getFullYear() + "-" + ("0" + month).slice(-2) + "-" + ("0" + curDate.getDay()).slice(-2); 

	month++; 
	var endDate = curDate.getFullYear() + "-" + ("0" + month).slice(-2) + "-" + ("0" + curDate.getDay()).slice(-2); 
	$(".startDate").val(startDate);
	$(".endDate").val(endDate);
	

	var clientID = $(".clientID").val(); 
	if(!clientID || clientID.trim() == "") {
		clientID = "999999"; 
		$(".clientID").val(clientID);
	}




    var userData = [];
    var userGenericInfo = {    
    }; 

    var ordersStat = [];
    var errorsDistribution=[];
    var appHoursPerDay = [];

	

    var setGenericInfo = function(info) {
    	
    	 $("#SetupCount").text(info.SetupCount || ""); 
	     $("#LastUsedOSVersion").text(info.LastUsedOSVersion || ""); 
	     $("#FirstRegistration").text(info.FirstRegistration || ""); 
	     $("#LastUsedProcessor").text(info.LastUsedProcessor || ""); 
	     $("#MinorVersion").text(info.MinorVersion || ""); 
	     $("#MajorVersion").text(info.MajorVersion || ""); 
    }

 	//v1 > v2, returns 1 
    //v1 < v2, returns -1
    //v1 == v2, return 0
    function compareAppVersion(v1, v2) {

		if(!v2) return 1; 
    	if(!v1) return -1; 

	    var v1parts = v1.split('.');
	    var v2parts = v2.split('.');

	    for (var i = 0; i < v1parts.length; ++i) {
	        if (v2parts.length == i) {
	            return 1;
	        }

	        if (v1parts[i] == v2parts[i]) {
	            continue;
	        }
	        else if (v1parts[i] > v2parts[i]) {
	            return 1;
	        }
	        else {
	            return -1;
	        }
	    }

	    if (v1parts.length != v2parts.length) {
	        return -1;
    	}

    	return 0;
	}
	

    var getUserGenericInfo = function(queryData) {
    	var uInf = $.ajax( {
			type: "GET", 
			url: window.location.href + "/getUserInfo",	
			data : queryData

		});

		uInf.done(function(jsonData) {

			userData = jsonData; 
			userGenericInfo = {};
			userGenericInfo.SetupCount = 0;
			userGenericInfo.LastUsedProcessor = "";
			userGenericInfo.LastUsedOSVersion = "";

            var length = userData.length;
			for(var i=0; i< length; i++) {
				var d = userData[i];			
				if(compareAppVersion(d.AppVersion, userGenericInfo.MajorVersion)>0 )  {					
					userGenericInfo.MajorVersion = d.AppVersion; 
					if(!userGenericInfo.MinorVersion)
						userGenericInfo.MinorVersion = userGenericInfo.MajorVersion ;
				}

				if(compareAppVersion(d.AppVersion, userGenericInfo.MinorVersion)<0 )  {					
					userGenericInfo.MinorVersion = d.AppVersion; 
				}

				//if the first row, as it's ordered by date, get the first registration date 
				if(i===0) {
					userGenericInfo.FirstRegistration = d.RegistrationDate;
				}
				
				if(i == length - 1) {
					userGenericInfo.LastUsedProcessor = d.Processor;
					userGenericInfo.LastUsedOSVersion = d.OS;
				}

				if(!userGenericInfo[d.HardwareID]) {
					userGenericInfo.SetupCount +=1; 					
					userGenericInfo[d.HardwareID] = 1;

				}

			}

			setGenericInfo(userGenericInfo); 
		});

		uInf.fail(function(err) {
			console.log(err);
		});
    }


    var getOrderStatByUser = function(queryData) {		

        var oStat = $.ajax( {
			type: "GET", 
			url: window.location.href + "/getOrderStatByUser",	
			data : queryData

		});

		oStat.done(function(jsonData) {

			ordersStat = []; 
			var length = jsonData.length;
			for(var i=0; i<length;i++) {
				var j = jsonData[i];
			
				ordersStat.push({label:j.ActionName, value: j.Count});
			}

			chartBinder.bindDataToChart("donut", "ordersStatByUser", ordersStat)
		});

		oStat.fail(function(err) {
			console.log(err);
		});
    }


    var getErrorsDistributionInPeriodByUser = function(queryData) {

    	var errorsDistr = $.ajax( {
			type: "GET", 
			url: window.location.href + "/getErrorsDistributionInPeriodByUser",	
			data : queryData

		});

		errorsDistr.done(function(jsonData) {

			errorsDistribution = []; 
			var length = jsonData.length;
			for(var i=0; i<length;i++) {
				var j = jsonData[i];
			
				errorsDistribution.push({label:j.ErrorTitle, value: j.Count});
			}

			chartBinder.bindDataToChart("donut", "errorStatByUser", errorsDistribution)
		});

		errorsDistr.fail(function(err) {
			console.log(err);
		});
    }


    var getAvgTimePerUser = function(queryData) {
    	//query for use time per day 
		var usedTimePerDay = $.ajax( {
			type: "GET", 
			url: window.location.href + "/getAvgUseTimePerDayByUser",	
			data : queryData

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
    }


	var setData = function() {

		var start = $(".startDate").val(); 
		var end = 	$(".endDate").val(); 
		var clID =  $(".clientID").val(); 
		var queryData = {startDate : start, endDate:end, clientID: clID};

		$("#ordersStatByUser").empty();	        
		$("#errorStatByUser").empty(); 
	    $("#hoursPerDayBar").empty(); 
		
	    
		//get user generic info 
		getUserGenericInfo(queryData);
		// ---------------------------

		//get orders stat by user 
		getOrderStatByUser(queryData);
		// ----- 

		//get user errors stat 
		getErrorsDistributionInPeriodByUser(queryData);
		// --------------

		//get user app using stat 
		getAvgTimePerUser(queryData);
		// -----------------


	}; 

	setData(); 

	//handle resize 
	$(window).bind('resize', function(e)
	{
	    window.resizeEvt;
	    $(window).resize(function()
	    {
	        clearTimeout(window.resizeEvt);
	        window.resizeEvt = setTimeout(function()
	        {	        	
	        	$("#ordersStatByUser").empty(); 	        	
	        	chartBinder.bindDataToChart("donut", "ordersStatByUser", ordersStat);

				$("#errorStatByUser").empty(); 
	        	chartBinder.bindDataToChart("donut", "errorStatByUser", errorsDistribution);

	        	$("#hoursPerDayBar").empty(); 
				chartBinder.bindDataToChart("bar", "hoursPerDayBar", appHoursPerDay);      	
	        		            

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