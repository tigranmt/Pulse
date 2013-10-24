(function() {

	var data = undefined; 
	var maxActionIDLoaded = -1; //if < 0 ALL top records (usually first 100) 
	var maxRowCountOnUI = 100;
	var updateInterval = 120000; //2 minutes
	var rowStateUpdateInterval = 90000; //1.5 minutes

	var queryStart, queryEnd, queryID;
	var recordState = {
		justRecievedRecord : 0, 
		freshRecord : 1,
		oldRecord   : 2
	}

	var setData = function(esplicitUpdateRequest) {

		//get date range if any 
		var start = $(".startDate").val(); 
		var end = 	$(".endDate").val(); 	


		//get client code if any 
		var clID =  $(".clientID").val(); 

		// if there is variation between last requested query parameters 
		// reset max ID value, so all list will be considered like a target on DB
		if(esplicitUpdateRequest === true || queryStart!= start  || queryEnd != end  || queryID != clID ){
			maxActionIDLoaded = -1;
		}		

		queryStart = start; 
		queryEnd   = end; 
		queryID    = clID;

		//construct request data
		var requestData = {
			startDate : queryStart, 
			endDate : queryEnd,
			clientID : queryID, 
			maxID : maxActionIDLoaded
		}

	
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


				var bindValue = { 
					ClientID : d.ClientID, 
					RegistrationDate : d.RegistrationDate, 					             
					RegistrationHour : d.RegistrationHour, 
					AppVersion : d.AppVersion, 
					Action : d.Action, 
					ActionValue : d.ActionValue, 
					State : ko.observable(0)
				} ;
				
				bindValue.RecordState = ko.computed(function() {
					if(this.State() === recordState.justRecievedRecord) 
						return "success"; 
					else if(this.State() === recordState.freshRecord)
						return  "warning"; 
					else 
						return "active";
				}, bindValue); 

				collector.push(bindValue); 

			}


			if(!data) {
				data = {}; 
				data.actionsList = ko.observableArray(collector);
				var domEl = $("#actionsLog")[0];
				ko.applyBindings(data, domEl);
			}
			else {			
			
				for(var c =0; c<collector.length; c++) {
					data.actionsList.unshift(collector[c]);		
				}
			}


			if(collector.length === 0) {
				showNoDataFoundAlert();		
			}

			data.actionsList .splice(99);

		}); 


		actionLog.fail(function(err) {
			console.log(err);
		});

		


	}


	// update row states, so the colors of their background
	// to indicate a "freshness" of the data on the view
	var updateRowStates = function() {
		if(!data || data.actionsList().length === 0)
			return; 

		
		var actions = data.actionsList;
		var length =  actions().length;
		for(var i=0; i<length; i++) {
			var a = actions()[i]; 
			if(a.State() === recordState.justRecievedRecord) {
				a.State(recordState.freshRecord); 
			}
			else if(a.State() === recordState.freshRecord) {
				a.State(recordState.oldRecord);
			}
			else 
				break;
		}
	}



	var showNoDataFoundAlert = function() {	
		
		//for now not working 
		return; 

		if($('#alertDIV').length === 0) {

			$(document.body).append("<div id='alertDIV' class='alert alert-dismissable'> " + 
          								"<a class='close'>×</a>  " + 
          							  "<strong>Warning!</strong> No data found ." + 
        							"</div>");

		}


		 $("#alertDIV").slideDown(400);
			
	}


	setData(true); 


	if( typeof(WebSocket) == "function" ) {
		//there is WebSpcket support, so subscrbe to incomming event to populate UI accordingly
		
		  var socket = io.connect(window.location.hostname);
		  socket.on('new_action', function (newAction) {
		       
		       var bindValue = { 
					ClientID : newAction.clientCode, 
					RegistrationDate : newAction.date, 					             
					RegistrationHour : newAction.hour, 
					AppVersion : newAction.appVersion, 
					Action : newAction.actionName, 
					ActionValue : newAction.actionValue, 
					State : ko.observable(0)
				} ;


				bindValue.RecordState = ko.computed(function() {
					if(this.State() === recordState.justRecievedRecord) 
						return "success"; 
					else if(this.State() === recordState.freshRecord)
						return  "warning"; 
					else 
						return "active";
				}, bindValue); 

			   updateRowStates();
		       data.actionsList.unshift(bindValue);		   
		  });


	}
	else {
		//there is no WebSocket support, so run an ordinary timer and
		//ping server for modifications
		setInterval(function() {

  			updateRowStates();
			setData(false);

		}, updateInterval); 
	}



	/*setInterval(function() {

		updateRowStates();

	}, rowStateUpdateInterval); */


  	//handle update click 
	$("#updateQuery").bind("click", function() {

		setData(true);

	});




	//-------



})();