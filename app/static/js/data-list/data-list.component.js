'use strict';
// console.log('kkk')
angular.
	module('scoreList').
	component('scoreList', {
		templateUrl: '/static/js/data-list/data-list.template.html',
		controller: ['$http','$filter','$scope', '$rootScope',function scoreListController($http, $filter, $scope, $rootScope){
			var self = this;
			self.allScoreList = [];
			console.log('ppp')
			$http.get('/static/json/question.json').then(function(response){
				self.questions = response.data;
				$http.get('/getAllScore').then(function(response){
					// console.log('ss')
					self.allScore = response.data;
					// console.log(self.allScore);
					var scoreYou = [];
					angular.forEach(self.allScore, function(v, i){
						self.allScore[i]['p_average'] = getAverage(self.allScore[i]['score']);
						console.log(self.allScore[i]['p_average'])
						self.allScoreList.push(self.allScore[i]['p_average']);
						if(self.allScore[i]['username']==$rootScope.username){
							scoreYou = self.allScore[i]['p_average'];
						}
					})
					var scoreAverage = getAverage(self.allScoreList);
					var scoreHigh = getHigh();
					// console.log(scoreHigh)
					for(var i=0,length = self.questions['XMZ'].length;i<length;i++){
						self.dataTableTbody.push({
							id: i+1,
							question: self.questions['XMZ'][i]['subtitle'],
							average: scoreAverage[i],
							high: scoreHigh[i]['score'] + ' ('+scoreHigh[i]['name'].join(',')+')',
							yourscore: scoreYou[i]
						})
					}

				})
			})
			function getHigh(){
				var high = [];
				var length = self.questions['XMZ'].length;
				for(var i=0;i<length;i++){
					high.push({
						name: [],
						score: 0
					})
				}
				angular.forEach(self.allScore, function(value, index){
					for(var i=0;i<length;i++){
						if(self.allScore[index]['p_average'][i]>high[i]['score']){
							high[i]['name'] = [];
							high[i]['name'].push(self.allScore[index]['realname']);
							high[i]['score'] = self.allScore[index]['p_average'][i];
						}else if(self.allScore[index]['p_average'][i]==high[i]['score']){
							high[i]['name'].push(self.allScore[index]['realname']);
						}
					}
				})
				return high;
			}
			function getAverage(score){
				console.log(score)
				if(score.length==0){
					console.log('no score');
					return;
				}
				var result = [];
				var l = score[0].length;
				var sl = score.length;
				for(var i=0;i<l;i++){
					result[i] = 0;
				}
				angular.forEach(score, function(value, index){
					for(var i=0;i<l;i++){
						result[i] += score[index][i];
					}
				})
				for(var i=0;i<l;i++){
					result[i] = parseFloat((result[i]/sl).toFixed(2));
				}
				console.log(result);
				return result;
			}
			

	        self.dataTableThead = [
	        {
	            name: 'question',
	            label: '问题',
	            sortable: false
	        },
	        {
	            name: 'average',
	            label: '平均分',
	            sortable: false
	        },
	        {
	            name: 'high',
	            label: '最高分',
	            sortable: false
	        },
	        {
	            name: 'yourscore',
	            label: '你的得分',
	            sortable: false
	        }];
	        self.advancedDataTableThead = angular.copy(self.dataTableThead);

	        self.dataTableTbody = [];

	        $scope.$on('lx-data-table__sort', updateSort);

	        function updateSort(_event, _column)
	        {
	            self.dataTableTbody = $filter('orderBy')(self.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
	        }

			}]
	})