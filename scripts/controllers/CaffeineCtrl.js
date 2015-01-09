'use strict';

/**
 * @ngdoc function
 * @name ngPersonalSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngPersonalSiteApp
 */
personalSiteApp.controller('caffeineController', function($scope) {
 $scope.exampleData = [
    {
     "key": "Series 1",
      "values": [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] ]
    }
  ];


    // Public Vars ------
    // hrs
    $scope.time = 0;
    // mgs
    $scope.minCaffeine = 0;
    $scope.curCaffeine = 0;
    $scope.nextCaffeine = 0;
    // max total consumption for one day
    $scope.maxCaffeine = 0;
    // hrs
    $scope.doseTime = 0;
    // graphing
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
    }
    ];

    // Private Vars ------
    var absorbK = 11.76;
    var elimK = 0.162;
    // graphing
    var exoCircadian = [];
    var endoCircadian = [];
    var totalCircadian = [];
    var targetCaffeine = [];
    var baseCaffeine = [];
    
    /*
     * initial: starting caffeine amount (mgs)
     * target: optimimum caffeine intake (mgs)
     * returns time (hrs) till reaching that target caffeine level
     */
    var getTime = function(initial) {
      return Math.log($scope.minCaffeine * (absorbK - elimK) / (absorbK * initial) ) /
        Math.log(Math.pow(Math.E, -elimK) - Math.pow(Math.E, -absorbK));
    }
    
    /*
     * initial: starting caffeine amount (mgs)
     * t: caffeine amount at some time in the future (hrs)
     * returns ending caffeine amount (mgs)
     */
    var getAmount = function(initial, t) {
      return absorbK * initial * (Math.pow(Math.E, -elimK * t) - Math.pow(Math.E, -absorbK * t)) / (absorbK - elimK);
    }
    
    /*
     * t: time of day
     * returns: ???
     */
    var getEndogenousCircadian = function(t) {
      return (2.5 * Math.cos((2 * Math.PI)*(t - 16.8) / 24))*5;
    }
    
    /*
     * t: time of day
     * returns: ???
     */
    var getExogenousCircadian = function(t) {
      return (-0.5 + 0.5 * Math.cos( (2 * Math.PI)*(t - 16.8 - 3)/12 ) ) + 5;
    }

    /*
     * lbs: weight (lbs)
     * returns: mass (kgs)
     */
    var convertLbsToKgs = function(lbs) {
      return lbs * 0.453592;
    }

    /*
     * age (years)
     * returns: hazardous daily consumption total (mgs)
     */
    var dangerousAmount = function(age) {
      if(age < 4)
        return 0;
      else if(age <= 6)
        return 45;
      else if(age <= 9)
        return 62.5;
      else if(age <= 12)
        return 85;
      else if(age <= 18)
        return 100;
      else
        return 400;
    }
    
    $scope.calculate = function() {

      // FOR TESTING PURPOSES
      $scope.age = 18;
      $scope.weight = 140;
      $scope.duration = 5;
      ///// !!!!!

      var d = new Date();
      var hrs = d.getHours();
      console.log(hrs + $scope.duration);
      var initial = 140; //mgs

      $scope.maxCaffeine = dangerousAmount($scope.age);

      // calculate minimum caffeine level
      $scope.minCaffeine = convertLbsToKgs($scope.weight) * 1.5;

      // calculate time till hit min level
      $scope.doseTime = getTime($scope.curCaffeine);


      var initial = $scope.curCaffeine;
      var amounts = [];
      var start = $scope.t_0;
      if($scope.t_0 == undefined)
        start = 0;
      for(var i = start; i < $scope.duration + start; i+= 0.5) {
        $scope.curCaffeine = getAmount($scope.consumed, 1);
        if($scope.curCaffeine < $scope.minCaffeine) {
          $scope.curCaffeine += 34;
        }
        console.log("calc");

        var index = i - hrs;
        exoCircadian[index]   = [i, getExogenousCircadian(i + hrs)];
        endoCircadian[index]  = [i, getEndogenousCircadian(i + hrs)];
        var total = getExogenousCircadian(i + hrs) + getEndogenousCircadian(i + hrs);
        var base =  $scope.minCaffeine * total / 200 + initial - 50;
        
        $scope.curCaffeine = getAmount($scope.curCaffeine, 1);        
        if ($scope.curCaffeine < $scope.minCaffeine) {
          $scope.curCaffeine += 34;
        }
        
        totalCircadian[index] = [i, getExogenousCircadian(i + hrs) + getEndogenousCircadian(i + hrs)];
        targetCaffeine[index] = [i, base];
        baseCaffeine[index]   = [i, $scope.minCaffeine];
        amounts[index]        = [i, $scope.curCaffeine];
      }

      // update the graph
      $scope.data[0].values = amounts;
      $scope.exampleData[0].values = amounts;
      $scope.data[1].values = exoCircadian;
      $scope.data[2].values = endoCircadian;
      $scope.data[3].values = totalCircadian;
      $scope.data[4].values = targetCaffeine;
      $scope.data[5].values = baseCaffeine;
      
      $scope.showChart = true;
      //$scope.$apply();  

      console.log(exoCircadian);
    }
    
    var init = function() {
      $scope.showChart = false;

    }
    
    init();
  });
