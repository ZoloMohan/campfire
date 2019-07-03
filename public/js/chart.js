let five = parseInt($('#5').val());
let four = parseInt($('#4').val());
let three = parseInt($('#3').val());
let two = parseInt($('#2').val());
let one = parseInt($('#1').val());


new Chartist.Bar('.ct-chart', {
    labels: ['5', '4', '3', '2', '1'],
    series: [
      [five, four, three, two, one],
    ]
  }, {
    seriesBarDistance: 10,
    reverseData: true,
    horizontalBars: true,
    axisY: {
      offset: 60
    }
  });
  