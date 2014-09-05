// create the controller and inject Angular's $scope
personalSiteApp.controller('picOregonController', function($scope) {
  // create a message to display in our view
  
  $scope.photoDir = 'images/oregon';
  $scope.iconDir = 'images/oregon';
  $scope.pics = [ 'gorgeB&W.jpg', 'IMG3722.JPG', 'IMG4027.JPG', 'IMG4029.JPG', 'road.jpg', 'trees.jpg'];
  
  $scope.setLink = function(link) {
    $scope.current = link;
  };
  
  var init = function() {
    $scope.setLink($scope.pics[0]);
  };
  
  init();
});