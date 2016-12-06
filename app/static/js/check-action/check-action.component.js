'use strict';

angular.
	module('checkAction').
	component('checkAction',{
		templateUrl: '/static/js/check-action/check-action.template.html',
		controller: ['$http', '$scope', '$rootScope','LxNotificationService', function checkActionController($http, $scope, $rootScope,LxNotificationService){
			var self = this;
			console.log(self.username)
			// self.isSlideShow = false;
			// console.log(username)
			self.isSlideShow = $rootScope.isSlideShow;
			self.nowPeople = {
				partName: '',
				teamName: '',
				username: '',
				realname: 'she',
				index: '',
				score: [],
				haveScore: false
			}
			self.updateNowPeople = function(team, name, index){
				$rootScope.isSlideShow = false;
				console.log(team)
				console.log(name)
				console.log(index)
				self.nowPeople.username = name;
				self.nowPeople.index = index;
				self.nowPeople.teamName = team;
				self.nowPeople.realname = self.rateList[team][index]['realname'];
				self.nowPeople.score = self.rateList[team][index]['score'];
				self.nowPeople.haveScore = self.isChecked();
				// self.nowPeople.score = [20,20,10,10,10,5,5];
				var qLength;
				angular.forEach(self.config, function(v, i){
					if(v.indexOf(team)>-1){
						self.nowPeople.partName = i;
						qLength = self.questions[self.nowPeople.partName.toUpperCase()].length;
						return false;
					}
				})
				console.log(self.nowPeople)
				console.log(qLength)
				self.formData = {};
				for(var i=1;i<=qLength;i++){
					self.formData['q'+i] = self.nowPeople.score[i-1]
				}
				if(window.innerWidth<=767){
					var cards = document.querySelectorAll('.question');
			        for(var i = 0,l = cards.length;i<l;i++){
					 	var h = cards[i].children[0].getBoundingClientRect().height+20;
					 	cards[i].setAttribute('style','height:'+h+'px');
					 }
				}else{
					var cards = document.querySelectorAll('.question');
			        for(var i = 0,l = Math.floor(cards.length/2);i<l;i++){
					 	var h1 = cards[2*i].children[0].getBoundingClientRect().height+20;
					 	var h2 = cards[2*i+1].children[0].getBoundingClientRect().height+20;
					 	if(h1<h2){
					 		cards[2*i].setAttribute('style','height:'+h2+'px');
					 		cards[2*i+1].setAttribute('style','height:'+h2+'px');
					 	}else{
					 		cards[2*i].setAttribute('style','height:'+h1+'px')
					 		cards[2*i+1].setAttribute('style','height:'+h1+'px')
					 	}
					 }
				}
				// var qLength =

			}

			self.updateScore = function(){
				// console.log(self.formData)
				angular.forEach(self.formData, function(v, i){
					if(angular.isDefined(self.formData[i])){
						self.nowPeople.score[parseInt(i.slice(1))-1] = self.formData[i];
					}else{
						self.nowPeople.score[parseInt(i.slice(1))-1] = -1;
					}
				})
				// console.log(self.nowPeople)
			}
			self.isChecked = function(score){
				if(!score){
					score = self.nowPeople.score;
				}
				if(score.length==0){
					return false
				}
				for(var i=0,l=score.length;i<l;i++){
					if(score[i]<0){
						return false
					}
				}
				return true
			}
			self.submitScore = function(){
				if(!self.isChecked()){
					LxNotificationService.warning('请完成评价之后再提交');
					return false;
				}
				var data = {
					fromName: self.username,
					toName: self.nowPeople.username,
					partName: self.nowPeople.partName,
					teamName: self.nowPeople.teamName,
					score: self.nowPeople.score
				}
				console.log(data);
				$http.post('/writeScore', data).
				success(function(data, status, headers, config){
						if(data==3){
							LxNotificationService.warning('Be Careful');
							return false;
						}
						if(data==0){
							LxNotificationService.success('提交成功');
							self.nowPeople.haveScore = true;
						}else{
							LxNotificationService.warning('提交失败,请稍后再试');
						}
					}).
					error(function(data, status, headers, config){
						LxNotificationService.warning('提交失败,请稍后再试');
					})
			}
			// console.log(self)
			if(self.username){
				$http.post('/getRateList',{username: self.username}).
					success(function(data, status, headers, config){
						if(data==3){
							LxNotificationService.warning('Be Careful');
							return false;
						}
						self.rateList = data;
						// console.log(self.rateList);
						self.toogle = {};
						angular.forEach(self.rateList, function(value, index){
							self.toogle[value] = false;
							angular.forEach(self.rateList[index],function(v, i){
								if(!value[i]['score'])
									value[i]['score'] = [];
							})
						})
						console.log(self.rateList)
					}).
					error(function(data, status, headers, config){

					})
			}
			// self.c
			$rootScope.$watch('isSlideShow', function(){
				self.isSlideShow = $rootScope.isSlideShow;
				console.log(self.isSlideShow);
			})

			self.toogleMenu = function(key){
				var status = self.toogle[key];
				angular.forEach(self.toogle, function(value, index){
					self.toogle[index] = false;
				})
				self.toogle[key] = !status;
				// console.log(self.toogle[key])
			}
			self.toggleSlide = function(){
				$rootScope.isSlideShow = !$rootScope.isSlideShow;
				console.log($rootScope.isSlideShow)
			}

			$http.get('/static/json/question.json').then(function(response){
				self.questions = response.data;
			})
			$http.get('/static/json/config.json').then(function(response){
				self.config = response.data;
			})

			$scope.$on('ngRepeatFinished', function( ngRepeatFinishedEvent ) {
		         if(window.innerWidth<=767){
					var cards = document.querySelectorAll('.question');
			        for(var i = 0,l = cards.length;i<l;i++){
					 	var h = cards[i].children[0].getBoundingClientRect().height+20;
					 	cards[i].setAttribute('style','height:'+h+'px');
					 }
				}else{
					var cards = document.querySelectorAll('.question');
			        for(var i = 0,l = Math.floor(cards.length/2);i<l;i++){
					 	var h1 = cards[2*i].children[0].getBoundingClientRect().height+20;
					 	var h2 = cards[2*i+1].children[0].getBoundingClientRect().height+20;
					 	if(h1<h2){
					 		cards[2*i].setAttribute('style','height:'+h2+'px');
					 		cards[2*i+1].setAttribute('style','height:'+h2+'px');
					 	}else{
					 		cards[2*i].setAttribute('style','height:'+h1+'px')
					 		cards[2*i+1].setAttribute('style','height:'+h1+'px')
					 	}
					 }
				}
		        // console.log('OKOK')
		      })
		}],
		bindings: {
		    username: '<'
		  }
	}).
	directive('slideResize', function($window) {
  return {
    link: function(scope, element, attr) {
    	var width = window.innerWidth,
    		height = window.innerHeight;
    		if(width<400){
    			element.css({
    				width: width*3/5 + 'px'
    			})
    		}
		element.css({
		          height: height + 'px'
		        })
	 document.querySelector('.slide-mask').setAttribute('style','width:'+width+'px;height:'+height+'px');
	
     angular.element($window).bind('resize',function(event){
        if(window.innerWidth<=767){
			var cards = document.querySelectorAll('.question');
	        for(var i = 0,l = cards.length;i<l;i++){
			 	var h = cards[i].children[0].getBoundingClientRect().height+20;
			 	cards[i].setAttribute('style','height:'+h+'px');
			 }
		}else{
			var cards = document.querySelectorAll('.question');
	        for(var i = 0,l = Math.floor(cards.length/2);i<l;i++){
			 	var h1 = cards[2*i].children[0].getBoundingClientRect().height+20;
			 	var h2 = cards[2*i+1].children[0].getBoundingClientRect().height+20;
			 	if(h1<h2){
			 		cards[2*i].setAttribute('style','height:'+h2+'px');
			 		cards[2*i+1].setAttribute('style','height:'+h2+'px');
			 	}else{
			 		cards[2*i].setAttribute('style','height:'+h1+'px')
			 		cards[2*i+1].setAttribute('style','height:'+h1+'px')
			 	}
			 }
		}
		var width = window.innerWidth,
    		height = window.innerHeight;
        document.querySelector('.slide-mask').setAttribute('style','width:'+width+'px;height:'+height+'px');
     	element.css({
          height: height + 'px'
        })
        if(width<400){
    			element.css({
    				width: width*3/5 + 'px'
    			})
    		}
      })
    }
  };
}).
  directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});