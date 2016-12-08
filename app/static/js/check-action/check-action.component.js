'use strict';

angular.
	module('checkAction').
	component('checkAction',{
		templateUrl: '/static/js/check-action/check-action.template.html',
		controller: ['$http', '$scope', '$rootScope','LxNotificationService', function checkActionController($http, $scope, $rootScope,LxNotificationService){
			var self = this;
			console.log(self.username)
			self.identity = 'normal';
			self.toogle = {};
			// self.isSlideShow = false;
			// console.log(username)
			$rootScope.toggle.isBtnShow = true
			self.isSlideShow = $rootScope.isSlideShow;
			self.nowPeople = {
				partName: '',
				teamName: '',
				username: '',
				realname: '',
				index: '',
				score: [],
				haveScore: false,
				type: ''
			}
			/* tutor part start */
			self.updateImpressionForTutor = function(name, index){
				$rootScope.isSlideShow = false;
				self.nowPeople.username = name.username;
				self.nowPeople.realname = name.realname;
				self.nowPeople.type = 'impressionForTutor';
				self.nowPeople.score = self.impressionListForTutor[index]['score'];
				self.nowPeople.index = index;
				self.nowPeople.haveScore = self.impressionListForTutor[index]['haveScore'];
				console.log(self.nowPeople)
			}
			/* tutor part end */
			/* captain part start */
			self.updateImpressionForCaptain = function(name, index){
				$rootScope.isSlideShow = false;
				self.nowPeople.username = name.username;
				self.nowPeople.realname = name.realname;
				self.nowPeople.type = 'impressionForCaptain';
				self.nowPeople.score = self.impressionList[index]['score'];
				self.nowPeople.index = index;
				self.nowPeople.haveScore = self.impressionList[index]['haveScore'];
				console.log(self.nowPeople)
			}
			/* captain part end */
			/* normal part start */
			self.submitImpression = function(type){
				console.log(self.nowPeople.score[0])
				if(angular.isDefined(self.nowPeople.score[0])){
					// self.nowPeople.haveScore = true;
					var data = {
						fromName: self.username,
						toName: self.nowPeople.username,
						score: parseFloat(self.nowPeople.score[0].toFixed(2)),
						identity: self.identity
					}
					// console.log(data)
					$http.post('/writeImpression',data).
					success(function(data, status, headers, config){
						if(data==3){
							LxNotificationService.warning('Be Careful');
							return false;
						}
						if(data==0){
							LxNotificationService.success('提交成功');
							if(type==0){
								self.impressionHaveScore = true;
							}else if(type==1){
								self.nowPeople['haveScore'] = true;
								self.impressionList[self.nowPeople['index']]['haveScore'] = true;
							}else if(type==2){
								self.nowPeople['haveScore'] = true;
								self.impressionListForTutor[self.nowPeople['index']]['haveScore'] = true;
							}
						}else{
							LxNotificationService.warning('提交失败,请稍后再试');
						}
					}).
					error(function(data, status, headers, config){
						LxNotificationService.warning('提交失败,请稍后再试');
					})
				}else{
					LxNotificationService.warning('请填写有效的分数');
				}
			}
			self.updateCaptain = function(name, index){
				$rootScope.isSlideShow = false;
				self.nowPeople.username = name.username;
				self.nowPeople.realname = name.realname;
				self.nowPeople.type = 'impression';
				self.nowPeople.teamName = '队长';
				self.nowPeople.score = self.impression;
				self.nowPeople.index = index;
				self.nowPeople.haveScore = self.impressionHaveScore;
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
				self.nowPeople.haveScore = self.rateList[team][index]['haveScore'];
				self.nowPeople.type = 'normal';
				// self.nowPeople.score = [20,20,10,10,10,5,5];
				var qLength;
				angular.forEach(self.config, function(v, i){
					angular.forEach(v, function(v1,  i1){
						if(v1.name===team){
							self.nowPeople.partName = i;
							qLength = self.questions[self.nowPeople.partName.toUpperCase()].length;
							return false;
						}
					})
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
							self.rateList[self.nowPeople.teamName][self.nowPeople.index]['haveScore'] = true;
							console.log(self.nowPeople)
							// console.log(self.nowPeople)
						}else{
							LxNotificationService.warning('提交失败,请稍后再试');
						}
					}).
					error(function(data, status, headers, config){
						LxNotificationService.warning('提交失败,请稍后再试');
					})
			}
			// console.log(self)
			$http.get('/static/json/boss.json').then(function(response){
				self.captain = response.data.captain;
				self.tutor = response.data.tutor;
				if(self.username===self.captain[0].username){
					self.identity = 'captain'
					$http.post('/getRateList',{username: self.username}).
					success(function(data, status, headers, config){
							if(data==3){
								LxNotificationService.warning('Be Careful');
								return false;
							}
							self.rateList = data;
							// console.log(self.rateList);
							angular.forEach(self.rateList, function(value, index){
								// self.toogle[value] = false;
								angular.forEach(self.rateList[index],function(v, i){
									if(!value[i]['score']){
										value[i]['score'] = [];
										value[i]['haveScore'] = false;
									}else if(self.isChecked(value[i]['score'])){
										value[i]['haveScore'] = true;
									}else{
										value[i]['haveScore'] = false;
									}
								})
							})
							console.log(self.rateList)
							// console.log(self.toogle)

						}).
						error(function(data, status, headers, config){

						})

					$http.post('/getImpressionForCaptain',{username: self.username}).
					success(function(data, status, headers, config){
						if(data==3){
							LxNotificationService.warning('Be Careful');
							return false;
						}
						self.impressionList = data;
						angular.forEach(self.impressionList, function(v, i){
							if(self.isChecked(self.impressionList[i]['score'])){
								self.impressionList[i]['haveScore'] = true;
							}else{
								self.impressionList[i]['haveScore'] = false;
							}
						})
						// console.log(self.impressionList);

					}).
					error(function(data, status, headers, config){

					})
				}else if(self.tutor.indexOf(self.username)>-1){
					self.identity = 'tutor';
					self.impressionListForTutor = [];
					
					$http.post('/getImpressionForTutor',{username:self.username}).
						success(function(data, status, headers, config){
							if(data==3){
								LxNotificationService.warning('Be Careful');
								return false;
							}
							self.impressionListForTutor = data;
							angular.forEach(self.impressionListForTutor,function(v, i){
								if(v['username']===self.captain[0]['username']){
									self.impressionListForTutor.splice(i,1);
								}
							})
							angular.forEach(self.impressionListForTutor, function(v, i){
								if(self.isChecked(self.impressionListForTutor[i]['score'])){
									self.impressionListForTutor[i]['haveScore'] = true;
								}else{
									self.impressionListForTutor[i]['haveScore'] = false;
								}
							})
							// console.log(self.impressionListForTutor);

						}).
						error(function(data, status, headers, config){

						})
					$http.post('/getImpression',{username: self.username}).
						success(function(data, status, headers, config){
							if(data==3){
								LxNotificationService.warning('Be Careful');
								return false;
							}
							self.impression = data.impression;
							if(self.isChecked(self.impression)){
								self.impressionHaveScore = true;
							}else{
								self.impressionHaveScore = false;
							}
						}).
						error(function(data, status, headers, config){

						})

				}else{
					$http.post('/getRateList',{username: self.username}).
						success(function(data, status, headers, config){
							if(data==3){
								LxNotificationService.warning('Be Careful');
								return false;
							}
							self.rateList = data;
							// console.log(self.rateList);
							self.toogle = {'captain':false};
							angular.forEach(self.rateList, function(value, index){
								self.toogle[value] = false;
								angular.forEach(self.rateList[index],function(v, i){
									if(!value[i]['score']){
										value[i]['score'] = [];
										value[i]['haveScore'] = false;
									}else if(self.isChecked(value[i]['score'])){
										value[i]['haveScore'] = true;
									}else{
										value[i]['haveScore'] = false;
									}
								})
							})
							console.log(self.rateList)
						}).
						error(function(data, status, headers, config){

						})
					$http.post('/getImpression',{username: self.username}).
						success(function(data, status, headers, config){
							if(data==3){
								LxNotificationService.warning('Be Careful');
								return false;
							}
							self.impression = data.impression;
							if(self.isChecked(self.impression)){
								self.impressionHaveScore = true;
							}else{
								self.impressionHaveScore = false;
							}

						}).
						error(function(data, status, headers, config){

						})
				}
			})
			/* normal part end */

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