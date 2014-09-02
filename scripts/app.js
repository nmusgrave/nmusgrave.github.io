var personalSiteApp = angular.module('personalSiteApp', ['ngRoute']);

// configure routes
personalSiteApp.config(function($routeProvider) {
  $routeProvider

    // route for the home page
    .when('/', {
            templateUrl : 'views/main.html',
            controller  : 'mainController'
    })

    // route for the about page
    .when('/about', {
            templateUrl : 'views/about.html',
            controller  : 'aboutController'
    })
    
     // route for the about page
    .when('/dashboard', {
            templateUrl : 'views/dashboard.html',
            controller  : 'dashboardController'
    })
});