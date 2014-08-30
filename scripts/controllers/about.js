'use strict';

/**
 * @ngdoc function
 * @name ngPersonalSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngPersonalSiteApp
 */
angular.module('ngPersonalSiteApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
