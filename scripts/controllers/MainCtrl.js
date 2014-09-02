// create the controller and inject Angular's $scope
personalSiteApp.controller('mainController', function($scope) {
  // create a message to display in our view
  $scope.message = 'Welcome';
  
  $scope.dir = 'images';
  $scope.horizontal = [ 'gorgeB&W.jpg','IMG_4029.JPG' ];
  $scope.vertical = [ 'road.jpg', 'trees.jpg', 'IMG_3722.JPG', 'IMG_4027.JPG' ];

  var init = function() {
    
  };
  
  init();
});