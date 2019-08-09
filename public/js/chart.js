var five = parseInt($('#5').val()),
	  four = parseInt($('#4').val()),
		three = parseInt($('#3').val()),
		two = parseInt($('#2').val());
		one = parseInt($('#1').val());

new Chartist.Bar(
	'.ct-chart',
	{
		labels : [ '5', '4', '3', '2', '1' ],
		series : [ [ five, four, three, two, one ] ]
	},
	{
		seriesBarDistance : 10,
		reverseData       : true,
		horizontalBars    : true,
		axisY             : {
			offset : 10
		}
	}
);
