var personalSiteApp = angular.module('personalSiteApp', ['ngRoute', 'ui.bootstrap']);

// configure routes
personalSiteApp.config(function($routeProvider) {
  $routeProvider

    .when('/', {
            templateUrl : 'views/main.html',
            controller  : 'mainController'
    })
    .when('/about', {
            templateUrl : 'views/about.html',
            controller  : 'aboutController'
    })
    .when('/dashboard', {
            templateUrl : 'views/dashboard.html',
            controller  : 'dashboardController'
    })
    .when('/picsSeattle', {
            templateUrl : 'views/picsSeattle.html',
           // controller  : 'dashboardController'
    })
    .when('/picsOregon', {
            templateUrl : 'views/picsOregon.html',
           // controller  : 'dashboardController'
    })
    .when('/picsMusic', {
            templateUrl : 'views/picsMusic.html',
           // controller  : 'dashboardController'
    })
    .when('/picsProcessing', {
            templateUrl : 'views/picsProcessing.html',
            controller  : 'picProcController'
    })
});