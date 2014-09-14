// create the controller and inject Angular's $scope
personalSiteApp.controller('picOregonController', function($scope) {
  // create a message to display in our view
  
  $scope.photoDir = 'images/oregon';
  $scope.iconDir = 'icons/oregon';
  $scope.pics = [ 'stars1.jpg','pdx2.jpg','pdx1.jpg','gorgeB&W.jpg','moss.JPG','road.jpg','trees.jpg','beachView.jpg','haystack.jpg','rockFormation.jpg','rocks.jpg','water.jpg' ];
  
  $scope.setLink = function(link) {
    $scope.current = link;
  };
  
  var getPosition = function(element) {
    var xPos = 0;
    var yPos = 0;
    while(element) {
      xPos += element.offsetLeft + element.clientLeft;
      yPos += element.offsetTop + element.offsetTop;
      element = element.offsetParent;
    }
    return {x: xPos, y: yPos};
  };
  
  var init = function() {
    $scope.setLink($scope.pics[0]);
  };
  
  init();
});