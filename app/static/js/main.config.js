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
        when('/datalist', {
          template: '<data-list></data-list>'
        }).
        otherwise('/360');
    }
  ]);
