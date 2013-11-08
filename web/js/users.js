/*
* REPOSNSIBLE FOR USERS DATA
*/
(function() {

	var curDate = new Date();	
	var month = curDate.getMonth() ;
	var startDate = curDate.getFullYear() + "-" + ("0" + month).slice(-2) + "-" + ("0" + curDate.getDate()).slice(-2); 

	month++; 
	var endDate = curDate.getFullYear() + "-" + ("0" + month).slice(-2) + "-" + ("0" + curDate.getDate()).slice(-2); 
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
    var hardwareHistory = {};

	

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

	        var intv1Parts = parseInt(v1parts[i]); 
	        var intv2Parts = parseInt(v2parts[i]); 

	        if (intv1Parts == intv2Parts) {
	            continue;
	        }
	        else if (intv1Parts > intv2Parts) {
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
			
			setHardwareHistory(userData); 
		

		});

		uInf.fail(function(err) {
			console.log(err);
		});
    }


    var getOrderStatByUser = function(queryData) {		

        var oStat = $.ajax({
			type: "GET", 
			url: window.location.href + "/getOrderStatByUser",	
			data : queryData
		});

		oStat.done(function(jsonData) {

			ordersStat = []; 
			var totOrders = 0; 
			var length = jsonData.length;
			for(var i=0; i<length;i++) {
				var j = jsonData[i];
			
				ordersStat.push({label:j.ActionName, value: j.Count});
				totOrders += j.Count;

			}

			ordersStat.totOrders = totOrders; 
	    	ordersStat.getTotalInfo = function() {
	        	return "Total Orders count: " + this.totOrders;
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
			var totErrCount = 0; 
			var length = jsonData.length;
			for(var i=0; i<length;i++) {
				var j = jsonData[i];
			
				errorsDistribution.push({label:j.ErrorTitle, value: j.Count});
				totErrCount += j.Count;
			}


			errorsDistribution.totErrCount =totErrCount;
			errorsDistribution.getTotalInfo = function() {
				return "Total Errors found: " + this.totErrCount;
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


    var getPresentHardwareIndex = function(arrHardwares, hardwareIDToSearch) {
    	for(var i=0; i<arrHardwares.length;i++ ) {
    		if(arrHardwares[i].hd === hardwareIDToSearch)
    			return i;
    	}

    	return -1;
    }


    var setHardwareHistory = function(userHardwareData) {

		hardwareHistory = {};

		//holds actualt data visualizaed on the line chart 
		hardwareHistory.data = [];


		//holds mouse over line chart points
		hardwareHistory.hoverCallback = function (index, options, content) {
			var data = userHardwareData[index];
			var index = getPresentHardwareIndex(hardwareHistory.uniqueHardwares, data.HardwareID); 
			return "PC:" + (index + 1) + " -Date: " + data.RegistrationDate + " -App version:" + data.AppVersion;
	    };
		hardwareHistory.uniqueHardwares = [];
    

        //index of the PC (for every hardware key, generated new PC index)
    	var pcIndex = 1;
		var ykeys = [];
		var labels = [];


		for(var h=0; h<userHardwareData.length; h++) {

            //constuct unique hardwares list
			if(hardwareHistory.uniqueHardwares.length === 0 || 
				getPresentHardwareIndex(hardwareHistory.uniqueHardwares, userHardwareData[h].HardwareID)<0) {
					hardwareHistory.uniqueHardwares.push({hd: userHardwareData[h].HardwareID, index: pcIndex});
					ykeys.push(pcIndex);
					labels.push("PC" + pcIndex);
					pcIndex++;
			}
		}

		

		//construct hardware history data for injecting it after to the chart
    	for(var i=0; i<userHardwareData.length; i++) {
    		var hd = userHardwareData[i];    	
    	

			//registration date AND PC
			var splits = hd.RegistrationDate.split("/"); 
			var dataString = splits[2] + "-" + splits[1] + "-" + splits[0];
			
			//construct graph data
			var graphData = {}; 
			graphData.month = dataString; 
		


            //inner loop
            // parseInt(hd.AppVersion.replace(/\./g,''));
			for(var unique = 0; unique<hardwareHistory.uniqueHardwares.length; unique++) {
				var key = hardwareHistory.uniqueHardwares[unique];
				if(key.hd === hd.HardwareID) {
					graphData[key.index] = key.index;
				}
				else {
					graphData[key.index] = null;
				}


			}

			hardwareHistory.data.push(graphData);			
    	}


    	var params = {xkey : "month", ykey : ykeys, labels:labels, hoverCallback : hardwareHistory.hoverCallback};
		$("#hardwareHistoryLine").empty();	
		chartBinder.bindDataToChart("line", "hardwareHistoryLine", hardwareHistory.data, params); 
		
    }


	var setData = function() {

		var start = $(".startDate").val(); 
		var end = 	$(".endDate").val(); 
		var clID =  $(".clientID").val(); 
		var queryData = {startDate : start, endDate:end, clientID: clID};

		$("#ordersStatByUser").empty();	        
		$("#errorStatByUser").empty(); 
	    $("#hoursPerDayBar").empty(); 
	    $("#hardwareHistoryLine").empty();
		

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

				$("#hardwareHistoryLine").empty();	
				setHardwareHistory(userData); 	        		            

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