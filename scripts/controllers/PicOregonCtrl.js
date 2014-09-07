// create the controller and inject Angular's $scope
personalSiteApp.controller('picOregonController', function($scope) {
  // create a message to display in our view
  
  $scope.photoDir = 'images/oregon';
  $scope.iconDir = 'images/oregon';
  $scope.pics = [ 'gorgeB&W.jpg', 'pdx2.JPG', 'pdx1.JPG', 'moss.JPG', 'road.jpg', 'trees.jpg', 'beachView.jpg', 'haystack.jpg', 'rockFormation.jpg', 'rocks.jpg', 'water.jpg' ];
  
  $scope.setLink = function(link) {
    $scope.current = link;
  };
  
  var init = function() {
    $scope.setLink($scope.pics[0]);
  };
  
  init();
});