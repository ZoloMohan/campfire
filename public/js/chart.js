new Chartist.Bar('.ct-chart', {
    labels: ['5', '4', '3', '2', '1'],
    series: [
      [5, 4, 3, 7, 5],
    ]
  }, {
    seriesBarDistance: 10,
    reverseData: true,
    horizontalBars: true,
    axisY: {
      offset: 60
    }
  });
  