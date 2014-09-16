personalSiteApp.controller('shouldIBikeController', function($scope, $q, $http) {
  var map;
  var chart;
  var directionsService;
  var elevationService;
  var directionsDisplay;

  var getWeather = function(zip) {
    var deferred = $q.defer();
    $http.get('http://api.wunderground.com/api/6226f5b0e538c836/conditions/q/CA/San_Francisco.json')
    .success(
      function(data){
        console.log(data);
        deferred.resolve(data.query.results.channel);
      }
    ).error(
      function(err){
        //console.log('Error retrieving weather');
        deferred.reject(err);
      }
    );
    return deferred.promise;
  };
  
  $scope.bikeRoute = function() {
     getWeather(98105).then(
      function(data) {
        $scope.weather = data;
      }
    );
    
    if (!!$scope.start && !!$scope.end) {
      var request = {
        origin: $scope.start,
        destination: $scope.end,
        travelMode: google.maps.TravelMode.BICYCLING
      };
      
      directionsService.route(request,
        function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            $scope.result = result.routes[0];
            $scope.$apply(); //update view
            getElevation();
          }
        }
      );
    }
  };
  
  
  var getElevation = function() {  
    // Retrieve the locations
    var locations = [];
    for(var i = 0; i < $scope.result.legs[0].steps.length; i++)
      locations.push($scope.result.legs[0].steps[i].lat_lngs[0]);
      
    var positionalRequest = {
      'locations': locations
    };
    elevationService.getElevationForLocations(positionalRequest, function(results, status) {
      if (status == google.maps.ElevationStatus.OK) {
        drawElevation(results);
      } else {
        console.log("Elevation service failed due to: " + status);
      }
    });
  };
  
  var drawElevation = function(results) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Sample'); //x axis
    data.addColumn('number', 'Elevation (ft)'); //y axis
    
    var ft = results[0].elevation * 3.28084;
    $scope.min = ft;
    $scope.max = ft;
    
    for (var i = 0; i < results.length; i++) {
      ft = Math.round(results[i].elevation * 3.28084); //convert meters to feet
      if (ft < $scope.min) {
        $scope.min = ft;
      } else if (ft > $scope.max) {
        $scope.max = ft;
      }
      data.addRow(['', ft]);
    }
    $scope.$apply();
    
    document.getElementById('elevation_chart').style.display = 'block';
    chart.draw(data,
      { height: 150,
        legend: 'none',
        vAxis: {
          textPosition: 'none',
          gridlines: { color: 'transparent' }
        }
      }
    );
  }
  
  var init = function() {
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    
    chart = new google.visualization.AreaChart(document.getElementById('elevation_chart'));
    
    elevationService = new google.maps.ElevationService();

    $scope.start = 'seattle';
    $scope.end = 'portland';
    $scope.bikeRoute();
  };
  
  init();
});