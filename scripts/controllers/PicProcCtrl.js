// create the controller and inject Angular's $scope
personalSiteApp.controller('picProcController', function($scope) {
  // create a message to display in our view
  
  $scope.photoDir = 'images/processing';
  $scope.iconDir = 'icons/processing';
  $scope.pics = [ 'process4.jpg', 'process5.jpg', 'process1.jpg', 'process2.jpg', 'process3.jpg', 'process6.jpg', 'process7.jpg'];
  
  $scope.setLink = function(link) {
    $scope.current = link;
  };
  
  var init = function() {
    $scope.setLink($scope.pics[0]);
  };
  
  init();
});