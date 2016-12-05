'user strict';

var checkMain = angular.module('checkMain',[
	'lumx',
	'ngRoute',
	'checkAction',
	'dataList'
	])
checkMain.controller('checkIndex', ['$scope','$rootScope', function($scope, $rootScope){
	$scope.user = {
		username: window.username,
		realname: window.realname
	}
	$scope.toggle = {
		isBtnShow: true
	}
	$rootScope.username = window.username;
	$rootScope.isSlideShow = false;
	$rootScope.toggleSlide = function(){
		$rootScope.isSlideShow = !$rootScope.isSlideShow;
		console.log($rootScope.isSlideShow)
	}
	// console.log($scope.user.username)
	// console.log($scope.user.realname)
	// console.log($scope)
}])
