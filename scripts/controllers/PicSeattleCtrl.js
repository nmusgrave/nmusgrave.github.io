// create the controller and inject Angular's $scope
personalSiteApp.controller('picSeattleController', function($scope) {
  // create a message to display in our view
  
  $scope.photoDir = 'images/seattle';
  $scope.iconDir = 'icons/seattle';
  $scope.pics = [ 'candy.jpg', 'metal.jpg', 'paper.jpg', 'skyline.jpg' ];
  
  $scope.setLink = function(link) {
    $scope.current = link;
  };
  
  var init = function() {
    $scope.setLink($scope.pics[0]);
  };
  
  init();
});