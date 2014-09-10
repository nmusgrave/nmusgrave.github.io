var personalSiteApp = angular.module('personalSiteApp', ['ngRoute', 'ui.bootstrap']);

// configure routes
personalSiteApp.config(function($routeProvider) {
  $routeProvider

    .when('/', {
            templateUrl : 'views/main.html',
            controller  : 'mainController'
    })
    .when('/about', {
            templateUrl : 'views/honorsPortfolio.html',
           // controller  : 'aboutController'
    })
    .when('/dashboard', {
            templateUrl : 'views/dashboard.html',
            controller  : 'dashboardController'
    })
    .when('/picsSeattle', {
            templateUrl : 'views/picsTemplate.html',
            controller  : 'picSeattleController'
    })
    .when('/picsOregon', {
            templateUrl : 'views/picsTemplate.html',
            controller  : 'picOregonController'
    })
    .when('/picsMusic', {
            templateUrl : 'views/picsTemplate.html',
            controller  : 'picMusicController'
    })
    .when('/picsProcessing', {
            templateUrl : 'views/picsTemplate.html',
            controller  : 'picProcController'
    })
});