(function bootstrap() {

	
	lineChartSample();
	donutChartSample();
	barChartSample();


	function lineChartSample() {


		new Morris.Line({
		  // ID of the element in which to draw the chart.
		  element: 'lineCharSample',
		  // Chart data records -- each entry in this array corresponds to a point on
		  // the chart.
		  data: [
		    { month: '2012-01', value: 60 },
		    { month: '2012-02', value: 55 },
		    { month: '2012-03', value: 53 },
		    { month: '2012-04', value: 39 },
		    { month: '2012-05', value: 23 },
		    { month: '2012-06', value: 21 },
		    { month: '2012-07', value: 19 },
		    { month: '2012-08', value: 10 },
		    { month: '2012-09', value: 7 },
		    { month: '2012-10', value: 5 },
		    { month: '2012-11', value: 3 },
		    { month: '2012-12', value: 3 },
		  ],
		  // The name of the data record attribute that contains x-values.
		  xkey: 'month',
		  // A list of names of data record attributes that contain y-values.
		  ykeys: ['value'],
		  // Labels for the ykeys -- will be displayed when you hover over the
		  // chart.
		  labels: ['Crashes']
		});
	}


	function  donutChartSample() {

		new Morris.Donut({
		  // ID of the element in which to draw the chart.
		  element: 'donutCharSample',
		  // Chart data records -- each entry in this array corresponds to a point on
		  // the chart.
		  data: [
		    { label: 'WindowsXP', 		value: 42 },
		    { label: 'Windows7 32bit', 	value: 19 },
		    { label: 'Windows7 64bit', 	value: 25 },
		    { label: 'Windows8', 		value: 6 },
		  	{ label: 'Ubutnu', 			value: 4 },
		  	{ label: 'OpenSuse', 		value: 4 }
		  ]		
		});

	}


	function  barChartSample() {

		new Morris.Bar({
		  // ID of the element in which to draw the chart.
		  element: 'barCharSample',
		  // Chart data records -- each entry in this array corresponds to a point on
		  // the chart.
		  // the chart.
		  data: [
		    { action: 'Use Facebook', percentage: 60 },
		    { action: 'Use Linkedin', percentage: 15 },
		    { action: 'Use Google+', percentage: 25 }		   
		  ],
		  // The name of the data record attribute that contains x-values.
		  xkey: 'action',
		  // A list of names of data record attributes that contain y-values.
		  ykeys: ['percentage'],
		  // Labels for the ykeys -- will be displayed when you hover over the
		  // chart.
		  labels: ['Social network account use']
		});

	}
	

})();