'user strict';

var checkMain = angular.module('checkMain',[
	'lumx',
	'ngRoute',
	'checkAction',
	'scoreList',
	'allScore'
	])
checkMain.controller('checkIndex', ['$scope','$rootScope','$http', function($scope, $rootScope, $http){
	$scope.user = {
		username: window.username,
		realname: window.realname
	}
	$rootScope.toggle = {
		isBtnShow: false
	}
	$rootScope.username = window.username;
	$rootScope.isSlideShow = false;
	$rootScope.toggleSlide = function(){
		$rootScope.isSlideShow = !$rootScope.isSlideShow;
		console.log($rootScope.isSlideShow)
	}
	$http.get('/static/json/boss.json').then(function(response){
		var captain = response.data.captain;
		var tutor = response.data.tutor;
		if($rootScope.username===captain[0].username){
			$scope.identity = 'captain'
		}else if(tutor.indexOf($rootScope.username)>-1){
			$scope.identity = 'tutor'
		}else{
			$scope.identity = 'normal'
		}
	})
}])

