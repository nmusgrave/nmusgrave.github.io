'use strict';

/**
 * @ngdoc function
 * @name ngPersonalSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngPersonalSiteApp
 */
personalSiteApp.controller('caffeineController', function($scope) {

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

    // Private Vars ------
    var absorbK = 11.76;
    var elimK = 0.162;
    
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
      var d = new Date();
      var hrs = d.getHours();
      console.log(hrs + $scope.duration);
      var initial = 140; //mgs

      $scope.maxCaffeine = dangerousAmount($scope.age);

      // calculate minimum caffeine level
      $scope.minCaffeine = convertLbsToKgs($scope.weight) * 1.5;

      // calculate time till hit min level
      $scope.doseTime = getTime($scope.curCaffeine);

      // calculate how much caffeine currently in system
      if($scope.t_0 < 0)
        $scop.curCaffeine = $scope.consumed;
      else
        $scope.curCaffeine = getAmount($scope.consumed, $scope.t_0);      
    }
    
    var init = function() {

    }
    
    init();
  });
