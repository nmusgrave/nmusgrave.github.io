'use strict';

/**
 * @ngdoc overview
 * @name ngPersonalSiteApp
 * @description
 * # ngPersonalSiteApp
 *
 * Main module of the application.
 */
angular
  .module('ngPersonalSiteApp', [
    'ngRoute'
  ]).config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html',
        Controller: 'MainCtrl'
    })
    .when('/about', {
        templateUrl: 'views/about.html',
        Controller: 'AboutCtrl'
    })
    .otherwise( {
        redirectTo: '/'
    } )
            
  }
);
