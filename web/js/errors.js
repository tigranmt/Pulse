(function() {

	var curDate = new Date();	
	var month = curDate.getMonth() ;
	var startDate = curDate.getFullYear() + "-" + ("0" + month).slice(-2) + "-" + ("0" + curDate.getDate()).slice(-2); 

    var errorsData =  []; 
    var errorLogModel = {};

	month++; 
	var endDate = curDate.getFullYear() + "-" + ("0" + month).slice(-2) + "-" + ("0" + curDate.getDate()).slice(-2); 
	$(".startDate").val(startDate);
	$(".endDate").val(endDate);

	var formatDate = function(date) {
		//registration date AND PC
		var splits = date.split("/"); 
		return splits[2] + "-" + splits[1] + "-" + splits[0];
	}



	var showModal = function(title, message) {
		title = title || ""; 
		message = message || ""; 

       	if(title === "" || message === "")
       		return; 		

		
		if($('#errorDetails').length === 0) {

			$(document.body).append("<div id='errorDetails' class='modal fade'> " + 
	  					 "<div class='modal-dialog'>" + 
	    					"<div class='modal-content'>" + 
	      						"<div class='modal-header'>" + 
	        						"<button type='button' class='btn btn-success pull-right' data-dismiss='modal'>Close</button>"+
	        						"<h4 class='modal-title'>" + title + "</h4>" + 
	      						"</div>" + 
	      						"<div class='modal-body'>" + 
	        						"<p>" + message + "</p>" + 
	      						"</div>" +       						
	    					"</div>"+
	 					 "</div>" + 
						"</div>");

		}


		$('#errorDetails').modal('show')
			
	}


	var  getErrorDistributionInPeriodByType = function() {
		
		var start = $(".startDate").val(); 
		var end = 	$(".endDate").val(); 		

		var queryData = {startDate : start, endDate:end};
		var errorsDist = $.ajax({
			type: "GET", 
			url: window.location.href + "/getErrorDistributionInPeriodByType",	
			data : queryData

		});


		errorsDist.done(function(jsonData) {
			
			//get over all data about errors, which will be used in different places after
			errorsData = jsonData;

			//collect line chart data
			var length = errorsData.length; 
			 
			var collectorByDate = {}; 
			var collectorByVersion = {};

			for(var i=0; i< length; i++) {
				var d = errorsData[i]; 
				var dateString = formatDate(d.RegistrationDate); 
				if(!collectorByDate[dateString])
					collectorByDate[dateString] = 0; 
				collectorByDate[dateString] += d.Count;

				if(!collectorByVersion[d.AppVersion])
					collectorByVersion[d.AppVersion] = 0; 
				collectorByVersion[d.AppVersion] +=d.Count; 
			}

			//conctruct line chart data 
			var lineChartData = [];
			for(var prop in collectorByDate) {
			    if(collectorByDate.hasOwnProperty(prop)) {
			        lineChartData.push({date: prop, count: collectorByDate[prop]});
			    }
			}


			errorsData.lineChartData = lineChartData; 
			// ----- 


			//construct pie chart data 
			var pieChartData = []; 
			var totErrors = 0; 
			for(var prop in collectorByVersion) {
			    if(collectorByVersion.hasOwnProperty(prop)) {
			        pieChartData.push({label: prop, value: collectorByVersion[prop]});
			        totErrors += collectorByVersion[prop];
			    }
			}

			pieChartData.totErrors = totErrors; 
	    	pieChartData.getTotalInfo = function() {
	        	return "Total Errors count: " + this.totErrors;
	        }
			errorsData.pieChartData = pieChartData; 
			//----------

			//bind to line chart 

			errorsData.hoverCallback = function (index, options, content) {
				var data = errorsData.lineChartData[index];

				//collect all versions geneerated errors on this date 
				var lenght = errorsData.length;
				var versionCollector = {}; 
				for(var i=0; i<length; i++) 
				{
					var d = errorsData[i]; 
					//accept only data of the picked data report
					var dateString = formatDate(d.RegistrationDate); 
					if(dateString !== data.date)
						continue; 

					if(!versionCollector[d.AppVersion])
						versionCollector[d.AppVersion] = ""; 					
				}
				// ------

				//construct version string 
				var versionsString = ""; 
				for(var prop in versionCollector) {
					versionsString += "(" + prop + ") ";
				}
				// -------

				return " Errors count: " + data.count + ",   AppVersions: " + versionsString;
	    	};

			var ykeys = ["count"];
			var labels = ["count"];
			
			var params = {xkey : "date", ykey : ykeys, labels:labels, hoverCallback: errorsData.hoverCallback};
			$("#errorsHistoryLine").empty();	
			chartBinder.bindDataToChart("line", "errorsHistoryLine", errorsData.lineChartData, params); 
			// ---- 

			//bind to pie chart 
			$("#errorsVersionPie").empty();			
			chartBinder.bindDataToChart("donut", "errorsVersionPie", errorsData.pieChartData)
			// -----------------------

		}); 

		errorsDist.fail(function(err) {
			console.log(err);
		});

	}


	var loadErrorLog = function() {		

		var domNode =  $("#errorsLog")[0];
		if(!errorLogModel.errors) {
			errorLogModel.errors = ko.observableArray([]); 		
			ko.applyBindings(errorLogModel,domNode);
		}

		errorLogModel.errors.removeAll(); 


		//query for data 
		var start = $(".startDate").val(); 
		var end = 	$(".endDate").val(); 

		var queryData = {startDate : start, endDate:end};
		var errLog = $.ajax({
			type: "GET", 
			url: window.location.href + "/getErrorLogInPeriod",	
			data : queryData
		});
		// -----------------------

		var errorDetailPopover = undefined; 

		//define mouse event handlers 
		errorLogModel.showDetails = function(errorData, event) {
			
			if(errorDetailPopover) {
				errorDetailPopover.popover('hide');
			}

			var title = "Error on: " + errorData.RegistrationDate + " " + errorData.RegistrationHour + "  Client: " + errorData.ClientID;

			showModal(title , errorData.ErrorValue);
			
		}

		errorLogModel.hideDetails = function(errorData,event) {
			if(errorDetailPopover) {
				errorDetailPopover.popover('hide');
			}
		}
		// ----------------------

		errLog.done(function(jsonData) {
			
			
			var length = jsonData.length; 
			for(var i=0; i<length; i++ ) {
				var d = jsonData[i];

				//construct data object
				var data = {
					ErrorTitle:d.ErrorTitle,
					ErrorValue : d.ErrorValue, 
					RegistrationDate: d.RegistrationDate, 
					RegistrationHour: d.RegistrationHour, 
					AppVersion:d.AppVersion,
					ClientID: d.ClientID, 
					showDetails : errorLogModel.showDetails, 
					hideDetails : errorLogModel.hideDetails
				}
				// ---------- 
				errorLogModel.errors.push(data);			
			}

			

			//chec observable array length, if it's 0 push just a dummy object inside 
			if(errorLogModel.errors().length === 0) {

				errorLogModel.errors.push({ErrorTitle: "-", RegistrationDate: "-/-/", RegistrationHour: "-/-/", AppVersion: "-.-.-.-", ClientID: "-", showDetails : errorLogModel.showDetails, hideDetails : errorLogModel.hideDetails });
			}

			

		}); 

		errLog.fail(function(err) {
			console.log(err);
		});
		
	}

	getErrorDistributionInPeriodByType();
	loadErrorLog();




	//handle resize 
	$(window).bind('resize', function(e)
	{
	    window.resizeEvt;
	    $(window).resize(function()
	    {
	        clearTimeout(window.resizeEvt);
	        window.resizeEvt = setTimeout(function()
	        {	        	
		        var ykeys = ["count"];
				var labels = ["count"];
				//var params = {xkey : "date", ykey : ykeys, labels:labels, hoverCallback : hardwareHistory.hoverCallback};
				var params = {xkey : "date", ykey : ykeys, labels:labels,  hoverCallback: errorsData.hoverCallback};
				$("#errorsHistoryLine").empty();	
				chartBinder.bindDataToChart("line", "errorsHistoryLine", errorsData.lineChartData, params); 

				//bind to pie chart 
				$("#errorsVersionPie").empty();			
				chartBinder.bindDataToChart("donut", "errorsVersionPie", errorsData.pieChartData)
				// -----------------------          

	        }, 250);
	    });
	});


	$("#updateQuery").bind("click", function() {

		getErrorDistributionInPeriodByType();
		loadErrorLog();
	});



})();