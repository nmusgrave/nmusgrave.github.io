// create the controller and inject Angular's $scope
personalSiteApp.controller('picMusicController', function($scope) {
  // create a message to display in our view
  
  $scope.photoDir = 'images/music';
  $scope.iconDir = 'images/music';
  $scope.pics = [ 'fameriot.jpg','maiahmanser.jpg', 'music1.jpg', 'grizzledmighty.jpg' ];
  
  $scope.setLink = function(link) {
    $scope.current = link;
  };
  
  var init = function() {
    $scope.setLink($scope.pics[0]);
  };
  
  init();
});