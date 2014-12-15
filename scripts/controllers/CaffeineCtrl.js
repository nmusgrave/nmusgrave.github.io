'use strict';

/**
 * @ngdoc function
 * @name ngPersonalSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngPersonalSiteApp
 */
personalSiteApp.controller('caffeineController', function($scope) {
    $scope.message = "hello";
    $scope.time = 0;
    $scope.data = [
    {
        "key": "Caffeine Level",
        "values": []
    },
    {
        "key": "Exogenous Circadian",
        "values": []
    },
    {
        "key": "Endogenous Circadian",
        "values": []
    },
    {
        "key": "Total Circadian",
        "values": []
    },
    {
        "key": "Scaled Base",
        "values": []
    },
    {
        "key": "Base Caffeine Level",
        "values": []
    }];
    
    var absorbK = 11.76;
    var elimK = 0.162;
    var exoCircadian = [];
    var endoCircadian = [];
    var totalCircadian = [];
    var targetCaffeine = [];
    var baseCaffeine = [];
    
    /*
     * initial: starting caffeine intake
     * target: ending caffeine intake
     * returns time till reaching that target caffeine level
     * units are in hours and milligrams
     */
    var getTime = function(initial, target) {
      var t = Math.log(target * (absorbK - elimK) / (absorbK * initial) ) /
        Math.log(Math.pow(Math.E, -elimK) - Math.pow(Math.E, -absorbK));
      return t;
    }
    
    var getAmount = function(initial, t) {
      var a = absorbK * initial * (Math.pow(Math.E, -elimK * t) - Math.pow(Math.E, -absorbK * t))
        / (absorbK - elimK);
      return a;
    }
    
    // t is time of day
    var getEndogenousCircadian = function(t) {
      var c = (2.5 * Math.cos((2 * Math.PI)*(t - 16.8) / 24))*5;
      return c;
    }
    
    // t is time of day
    var getExogenousCircadian = function(t) {
      var c = (-0.5 + 0.5 * Math.cos( (2 * Math.PI)*(t - 16.8 - 3)/12 ) ) + 5;
      return c;
    }
    
    $scope.calculate = function() {
      var d = new Date();
      var hrs = d.getHours();
      console.log(hrs + $scope.duration);
      var initial = 140; //mgs
      var target = $scope.weight * 0.453592 * 1.5; //mgs
      $scope.time = getTime(initial, target);
      var amounts = [];
      var currentCaf = initial;
      for(var i = hrs; i <= $scope.duration + hrs; i += 0.5) {
        currentCaf = getAmount(currentCaf, 1);        
        if (currentCaf < target) {
          currentCaf += 34;
          console.log(34 + " time: " + i);
        }
        var index = i - hrs;
        exoCircadian[index]   = [i, getExogenousCircadian(i + hrs)];
        endoCircadian[index]  = [i, getEndogenousCircadian(i + hrs)];
        var total = getExogenousCircadian(i + hrs) + getEndogenousCircadian(i + hrs);
        var base =  target * total / 200 + initial - 50;
        
        currentCaf = getAmount(currentCaf, 1);        
        if (currentCaf < base) {
          currentCaf += 34;
        }
        
        totalCircadian[index] = [i, getExogenousCircadian(i + hrs) + getEndogenousCircadian(i + hrs)];
        targetCaffeine[index] = [i, base];
        baseCaffeine[index]   = [i, target];
        amounts[index]        = [i, currentCaf];
      }
      
      $scope.data[0].values = amounts;
      $scope.data[1].values = exoCircadian;
      $scope.data[2].values = endoCircadian;
      $scope.data[3].values = totalCircadian;
      $scope.data[4].values = targetCaffeine;
      $scope.data[5].values = baseCaffeine;
      
      $scope.showChart = true;
      $scope.$apply();
    }
    
    var init = function() {
      $scope.showChart = false;
    }
    
    init();
  });
