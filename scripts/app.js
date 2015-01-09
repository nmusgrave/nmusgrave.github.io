var personalSiteApp = angular.module('personalSiteApp', ['ngRoute', 'ui.bootstrap']); //nvd3ChartDirectives

// configure routes
personalSiteApp.config(function($routeProvider) {
  $routeProvider

    .when('/', {
            templateUrl : 'views/main.html',
            controller  : 'mainController'
    })
    .when('/honorsPortfolio', {
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
    .when('/shouldIBike', {
            templateUrl : 'views/shouldIBike.html',
            controller  : 'shouldIBikeController'
    })
    .when('/musicSearch', {
            templateUrl : 'views/musicSearch.html',
            controller  : 'musicSearchController'
    })
    .when('/caffeine', {
            templateUrl : 'views/caffeine.html',
            controller  : 'caffeineController'
    })
});

//http://akashagrawal.me/blog/2014/01/31/infinite-scroller-in-angularjs/
personalSiteApp.directive('scroller', function () {
    return {
        //restrict: 'A',
        // new
        scope: {
            loadingMethod: "&"
        },
        link: function (scope, element, attrs) {
            rawElement = element[0];
            element.bind('scroll', function () {
                if((rawElement.scrollTop + rawElement.offsetHeight+5) >= rawElement.scrollHeight){
                    scope.$apply(scope.loadingMethod); //new
                }
            });
        }
    };
});
