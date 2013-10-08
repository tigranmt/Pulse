var chartBinder = {
	
	bindDataToChart : function(chartType, elemementName, data, params) {



		var element = $("#" + elemementName);
		

        if(data === undefined || data.length === 0) {
        	  var span = $( "<span class='center emptychart glyphicon glyphicon-ban-circle' > </span>" );
        	  element.append(span);
        }
        else {

			if(chartType === "donut") {

				new Morris.Donut({		  
				  element: elemementName,		
				 /* data: [
				    { label: 'WindowsXP', 		value: 42 },
				    { label: 'Windows7 32bit', 	value: 19 },
				    ....
				  ]	*/ 

				  data: data
				});
			}
			else if(chartType === "bar") {

				new Morris.Bar({
				  // ID of the element in which to draw the chart.
				  element: elemementName,
				  // Chart data records -- each entry in this array corresponds to a point on
				  // the chart.
				 /* data: [
				    { month: '2012-01', value: 60 },
				    { month: '2012-02', value: 55 },
				    ....
				 */
				 
				  data : data,
				  // The name of the data record attribute that contains x-values.
				  xkey: 'day',
				  // A list of names of data record attributes that contain y-values.
				  ykeys: ['value'],
				  // Labels for the ykeys -- will be displayed when you hover over the
				  // chart.
				  labels: ['Hours spent']
				});
			}
			else if(chartType === "line") {
				new Morris.Line({
		  
		  		  element: elemementName,
		  
				  /*data: [
				    { month: '2012-01', value: 60 },
				     ..
				  ],*/ 

				  hoverCallback: params.hoverCallback,

				  data : data, 

				  // The name of the data record attribute that contains x-values.
				  xkey: params.xkey,
				  // A list of names of data record attributes that contain y-values.
				  ykeys: params.ykey,
				  // Labels for the ykeys -- will be displayed when you hover over the
				  // chart.
				  labels: params.labels
		});
			}
		}

	}

}