var crimesData;
var crimeLabels = [];
var crimes;
var labeledCrimes = [];

d3.json('crimes.json', function(data) {
  crimesData = data;
  for (var i = 0; i < crimesData.meta.view.columns.length; i++) { 
    crimeLabels.push(crimesData.meta.view.columns[i].name);
  }
  crimes = crimesData.data;
  
  for (var i = 0; i < crimes.length; i++) {
    var crime = {};
    for (var j = 0; j < crimeLabels.length; j++) {
      crime[crimeLabels[j]] = crimes[i][j];
    }
    labeledCrimes.push(crime);
  }
})


/***************************MAP CREATOR *******************************/
var map;
var gmaps;
var initMap = function() {
  gmaps = google.maps;
  map = new gmaps.Map(d3.select('#map').node(), {
    center: {lat: 37.747, lng: -122.445},
    zoom: 13,
    'background-color': 'blue'
  });
// console.log(google);
  var overlay = new gmaps.OverlayView();

  overlay.onAdd = function() {
    var layer = d3.select(this.getPanes().overlayLayer)
      .append('div')
      .attr('class', 'crimes');

    overlay.draw = function() {
      var projection = this.getProjection();
      padding = 10;

      var marker = layer.selectAll('svg')
          .data(labeledCrimes)
          .each(transform) // update existing markers
        .enter().append('svg')
          .each(transform)
          .attr('class', 'marker');

      // Add a circle.
      marker.append("circle")
          .attr("r", 4.5)
          .attr("cx", padding)
          .attr("cy", padding);

      // Add a label.
      // marker.append('text')
      //     .attr('y', padding + 7)
      //     .attr('y', padding)
      //     .attr('dy', '.31em')
      //     .text(function(d) { return d.DayOfWeek; });

      function transform(d) {
        // console.log(d);
        d = new google.maps.LatLng(d.Y, d.X);
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
      }
    };
  };

  overlay.setMap(map);
};
  // initMap();

