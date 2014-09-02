// create the controller and inject Angular's $scope
personalSiteApp.controller('dashboardController', function($scope, $q, $http) {
  // create a message to display in our view
  $scope.message = 'dash goes here!';
  
  var getWeather = function(zip) {
    var deferred = $q.defer();
    $http.get('https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20weather.forecast%20WHERE%20location%3D%22' + zip + '%22&format=json&diagnostics=true&callback=')
    .success(
      function(data){
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
  
  var getFeed = function() {
    var feed = new google.feeds.Feed('http://online.wsj.com/xml/rss/3_7455.xml');
    feed.load(
      function(result) {
        if (!result.error) {
          //needs $apply for angular to notice the assignment on first load
          $scope.$apply(function() {
            $scope.wsj = result.feed.entries;
            console.log(result.feed.entries);
          });
        }
      }
    );
  };
    
  var init = function() {
    getWeather(98105).then(
      function(data) {
        $scope.weather = data;
      }
    );
    google.setOnLoadCallback(getFeed());
  }
  
  init();
  
});