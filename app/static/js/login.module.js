'use strict';

angular.module('login', [
	'lumx'
	]).
	controller('loginCard', ['$scope', 'LxNotificationService','$http','$interval', function($scope,LxNotificationService,$http,$interval){
			$scope.formData = {
				username: '',
				password: ''
			}
			$scope.submit = function(){
				if($scope.formData.username=='' || $scope.formData.password==''){
					LxNotificationService.warning('信息不完整');
					return;
				}
				vm.toggleDeterminateLinearProgress();
				$http.post('/login',$scope.formData).
				success(function(data, status, headers, config){
					vm.determinateLinearProgressValue = 100;
					// vm.toggleDeterminateLinearProgress();
					if(data=='1'){
						vm.toggleDeterminateLinearProgress();
						LxNotificationService.warning('密码错误');
					}else if(data=='2'){
						vm.toggleDeterminateLinearProgress();
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

			$scope.onSearchKeyDown = function(event){
				console.log(event)
				if(event.keyCode===13){
					$scope.submit();
				}
			}
			$scope.vm = {};
			var vm = $scope.vm;
	        var determinateLinearProgressInterval;
	        vm.toggleDeterminateLinearProgress = toggleDeterminateLinearProgress;
	        vm.determinateLinearProgressValue = 0;
	        vm.showDeterminateLinearProgress = false;

	        function toggleDeterminateLinearProgress()
	        {
	        	console.log('too')
	            vm.showDeterminateLinearProgress = !vm.showDeterminateLinearProgress;

	            if (vm.showDeterminateLinearProgress)
	            {
	                vm.determinateLinearProgressValue = 0;

	                determinateLinearProgressInterval = $interval(function()
	                {
	                    if (vm.determinateLinearProgressValue < 100)
	                    {
	                        vm.determinateLinearProgressValue += 1;
	                    }
	                    else
	                    {
	                        $interval.cancel(determinateLinearProgressInterval);
	                    }
	                }, 100);
	            }
	            else
	            {
	                $interval.cancel(determinateLinearProgressInterval);
	            }
	        }
		}]
	).directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

   