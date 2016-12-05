'use strict';

angular.module('login', [
	'lumx'
	]).
	controller('loginCard', ['$scope', 'LxNotificationService','$http', function($scope,LxNotificationService,$http){
			$scope.formData = {
				username: '',
				password: ''
			}
			$scope.submit = function(){
				if($scope.formData.username=='' || $scope.formData.password==''){
					LxNotificationService.warning('信息不完整');
					return;
				}
				$http.post('/login',$scope.formData).
				success(function(data, status, headers, config){
					if(data=='1'){
						LxNotificationService.warning('密码错误');
					}else if(data=='2'){
						LxNotificationService.warning('用户名不存在');
					}else if(data=='0'){
						LxNotificationService.warning('登录成功');
						window.location.href = "/main"
					}

		        }).
		        error(function(data, status, headers, config){
		          	LxNotificationService.warning('登录失败');
		        })
			}
		}]
	);

   