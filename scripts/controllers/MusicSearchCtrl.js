personalSiteApp.controller('musicSearchController', function($scope) {
  
  $scope.search = function() {
    console.log($scope.inputTerms);
  };
  
  var init = function() {
    $scope.results = ['foo'];
  };
  
  init();
});