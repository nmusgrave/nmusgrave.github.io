personalSiteApp.controller('shouldIBikeController', function($scope, $q, $http, $window) {
  var map;
  var mapOptions = {
      center: { lat: 47.6097, lng: -122.3331},
      zoom: 8
    };
  var chart;
  var directionsService;
  var elevationService;
  var directionsDisplay;
  var geocoder;
  var distanceThreshold = 60000; //meters, about 37 mi
  
  var getElevation = function() {
    var deferred = $q.defer();
    // Retrieve the locations
    var locations = [];
    
    var stepSize;
    if ($scope.result.legs[0].steps.length > 12000)
      stepSize = Math.round($scope.result.legs[0].steps.length * 0.05);
    else if ($scope.result.legs[0].steps.length > 300)
      stepSize = 5;
    else
      stepSize = 1;
    for(var i = 0; i < $scope.result.legs[0].steps.length; i = i+stepSize)
      locations.push($scope.result.legs[0].steps[i].lat_lngs[0]);
      
    var positionalRequest = {
      'locations': locations
    };
    
    elevationService.getElevationForLocations(positionalRequest, function(results, status) {
      if (status == google.maps.ElevationStatus.OK) {
        drawElevation(results);
        deferred.resolve(results);
      } else {
        console.log("Elevation service failed due to: " + status);
        deferred.resolve(status);
      }
    });
    return deferred.promise;
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
    
    document.getElementById('elevation_chart').style.display = 'block';
    chart.draw(data,
      { legend: 'none',
      }
    );
  };

  var queryWeather = function(lat, lng) {
    return $.ajax({
      url: 'http://api.wunderground.com/api/6226f5b0e538c836/hourly/q/'+ lat + ',' + lng +'.json',
      dataType: 'JSONP',
      type : 'GET',
      crossDomain: true,
      async: false,
      success: function(data) {
        return data;
      },
      error: function(data) {
        return data;
      }
    }); 
  };
  
  // convert latlng into readable locality address
  //  note: need to wait for a bit to avoid google query limitations
  var reverseGeocode = function(lat, lng) {
    var deferred = $q.defer();
    var str = '';
    geocoder.geocode({'latLng': new google.maps.LatLng(lat, lng) }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          console.log(results[1]);
          for(var j = 0; j < results[1].address_components.length; j++) {
            if (results[1].address_components[j].types[0] === 'locality') {
              str += results[1].address_components[j].short_name;
            } else if (results[1].address_components[j].types[0] === 'administrative_area_level_1') {
              str += ', ' + results[1].address_components[j].short_name;
            }
          }
        }
        deferred.resolve(str);
      } else if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        setTimeout(function() { reverseGeocode(new google.maps.LatLng(lat, lng)); }, 200);
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
    return deferred.promise;
  };

  $scope.bikeRoute = function() {
    //map
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
    google.maps.event.trigger(map, 'resize');
    
    $scope.showResults = false;
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
            
            var startLocation = {
              lat: result.routes[0].legs[0].start_location.k,
              lng: result.routes[0].legs[0].start_location.B
            };
            var endLocation = {
              lat: result.routes[0].legs[0].end_location.k,
              lng: result.routes[0].legs[0].end_location.B
            };
            
            $q.all([getElevation(), queryWeather(startLocation.lat, startLocation.lng), queryWeather(endLocation.lat, endLocation.lng)]).then(
              function(data) {
                var currentTime = new Date();
                var hours = Math.round(result.routes[0].legs[0].duration.value / 3600);
                
                $scope.startWeather = data[1].hourly_forecast[0];
                $scope.endWeather = data[2].hourly_forecast[hours - 1];
                
                if (hours > 4) {
                  $scope.message = 'No. Too far.';
                } else if ( ($scope.max - $scope.min) > 2000) {
                  $scope.message = 'No. Way too hilly.';
                } else if (currentTime.getHours() + hours >= 23) {
                  $scope.message = 'No. Way too late.';
                } else if (parseInt($scope.startWeather.temp.english) < 40 || parseInt($scope.endWeather.temp.english) < 40 ) {
                  $scope.message = 'No. Way too cold.';
                } else {
                  $scope.message = 'Yes!';
                }
                $scope.showResults = true;
              }
            );
          } else {
            $scope.message ='directions not possible';
            $scope.showResults = true;
          }
        }
      );
    } else {
      $scope.message = 'calculation failure';
      $scope.showResults = true;
    }
    //update view
    //$scope.$apply();
  };
  
  var getUserPosition = function() {
    var deferred = $q.defer();
    var mapOptions;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position);
        mapOptions = {
          center: { lat: position.coords.latitude, lng: position.coords.longitude},
          zoom: 12
        };
        reverseGeocode(position.coords.latitude, position.coords.longitude).then(
          function(data) {
            mapOptions.address = data;
            deferred.resolve(mapOptions)
          }
        );
        deferred.resolve(mapOptions)
      });
    } else {
      mapOptions = {
        center: { lat: 47.6097, lng: 122.3331},
        zoom: 8
      };
      deferred.resolve(mapOptions);
    }
    return deferred.promise;
  };
  
  
  var init = function() {
    /* TOO SLOW TO DO ON FIRST VISIT PAGE
    getUserPosition().then(
      function(data) {
        if (!!data.address !== undefined)
          $scope.start = data.address;
        else
          $scope.start = 'seattle';
        console.log(data);
        //map init
        map = new google.maps.Map(document.getElementById('map-canvas'), data);
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
      }
    );
    */
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();

    //chart
    google.visualization.ColumnChart
    chart = new google.visualization.AreaChart(document.getElementById('elevation_chart'));
    elevationService = new google.maps.ElevationService();
    //geocoding
    geocoder = new google.maps.Geocoder();

    $scope.showResults = false;
  };
  
  init();
});