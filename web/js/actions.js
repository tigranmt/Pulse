(function() {

	var maxActionIDLoaded = -1; //if < 0 ALL top records (usually first 100) 
	var maxRowCountOnUI = 100;
	var recordState = {
		justRecievedRecord : 0, 
		freshRecord : 1,
		oldRecord   : 2
	}

	var getData = function() {

		//get date range if any 
		var start = $(".startDate").val(); 
		var end = 	$(".endDate").val(); 	


		//get client code if any 
		var clID =  $(".clientID").val(); 

		//construct request data
		var requestData = {
			startDate : start, 
			endDate : end,
			clientID : clID, 
			maxID : maxActionIDLoaded
		}

		var data = undefined; 
		var actionLog = $.ajax({
			type: "GET",
			url: window.location.href + "/getActionsLog",	
			data : requestData
		}); 


		actionLog.done(function(jsonData) {
			var length = jsonData.length; 
			var collector = []; 
			for(var i=0; i < length; i++) 
			{
				var d = jsonData[i];
				if(i === 0) //highest ID available here
				{
					maxActionIDLoaded = parseInt(d.ID);
				}


      			/* <td data-bind="text: ClientID"></td>
				   <td data-bind="text: RegistrationDate"></td>
				   <td data-bind="text: RegistrationHour"></td>
				   <td data-bind="text: AppVersion"></td>
				   <td data-bind="text: Action"></td>
				   <td data-bind="text: ActionValue"></td> */ 

				collector.push( { ClientID : d.ClientID, RegistrationDate : d.RegistrationDate, 
					              RegistrationHour : d.RegistrationHour, AppVersion : d.AppVersion, 
					              Action : d.Action, ActionValue : d.ActionValue, RecordState : recordState.justRecievedRecord } ); 
			}


			if(!data) {
				data = {}; 
				data.actionsList =ko.observableArray(collector);
				var domEl = $("#actionsLog")[0];
				ko.applyBindings(data, domEl);
			}
			else {
				for(var c =0; c<collector.length; c++) {
					data.actionsList .unshift(collector[c]);
				}
			}


			data.actionsList .splice(99);

		}); 


		actionLog.fail(function(err) {
			console.log(err);
		});

		


	}

	getData(); 


	/*setInterval(function() {

		getData();

	}, 5000); */ 




})();