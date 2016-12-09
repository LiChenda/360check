'use strict';

angular.
  module('checkMain').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/360', {
          template: '<check-action username="$resolve.user"></check-action>',
          resolve: {
            user : ['$rootScope', function($rootScope){
                return $rootScope.username
              }]
          }
        }).
        when('/scorelist', {
          template: '<score-list></score-list>'
        }).
        when('/starlist', {
          template: '<star-list></star-list>'
        }).
        when('/allscore', {
          template: '<all-score></all-score>'
        }).
        otherwise('/scorelist');
    }
  ]);
