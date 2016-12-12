'use strict';

angular.module('seedScore').
	component('seedScore', {
		templateUrl: '/static/js/seed-score/seed-score.template.html',
		controller: ['$http','LxNotificationService','$scope','$filter', function seedScoreController($http, LxNotificationService, $scope, $filter){
			var self = this;
			self.dataTableList = {};
			self.dataTableThead = [
		        {
		            name: 'realname',
		            label: '姓名',
		            sortable: false
		        },
		        {
		            name: 'question_1',
		            label: '1',
		            sortable: true
		        },
		        {
		            name: 'question_2',
		            label: '2',
		            sortable: true
		        },
		        {
		            name: 'question_3',
		            label: '3',
		            sortable: true
		        },
		        {
		            name: 'question_4',
		            label: '4',
		            sortable: true
		        },
		        {
		            name: 'question_5',
		            label: '5',
		            sortable: true
		        },
		        {
		            name: 'question_6',
		            label: '6',
		            sortable: true
		        },
		        {
		            name: 'question_7',
		            label: '7',
		            sortable: true
		        },
		        {
		        	name: 'score',
		        	label: '得分',
		        	sortable: true
		        }
		    ]
		    $http.get('/static/json/question.json').then(function(response){
		    	var questions = response.data;
		    	var qLength = questions['ZZB'].length;
		    	$http.get('/getSeedScore').then(function(response){
					// console.log(response.data)
					if(response.data==3){
						LxNotificationService.warning('Be Careful');
						return false;
					}

					angular.forEach(response.data, function(v, i){
						v['all_score'] = 0;
						if(v['score'].length<qLength){
							for(var i=0;i<qLength;i++){
								v['score'][i] = 0;
							}
						}
						for(var i=0;i<qLength;i++){
							v['all_score'] += v['score'][i];
						}
						if(self.dataTableList[v['zzb']]){
							self.dataTableList[v['zzb']]['tbody'].push({
								realname: v['realname'],
								question_1: v['score'][0],
								question_2: v['score'][1],
								question_3: v['score'][2],
								question_4: v['score'][3],
								question_5: v['score'][4],
								question_6: v['score'][5],
								question_7: v['score'][6],
								score: v['all_score']
							})
						}else{
							self.dataTableList[v['zzb']] = {
								thead: angular.copy(self.dataTableThead),
								tbody: [
									{
										realname: v['realname'],
										question_1: v['score'][0],
										question_2: v['score'][1],
										question_3: v['score'][2],
										question_4: v['score'][3],
										question_5: v['score'][4],
										question_6: v['score'][5],
										question_7: v['score'][6],
										score: v['all_score']
									}
								]
							}
						}
					})
				})
		    })
			 $scope.$on('lx-data-table__sort', updateSort);


	        function updateSort(_event, _column)
	        {
	            self.dataTableTbody = $filter('orderBy')(self.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
	        	angular.forEach(self.dataTableList, function(v, i){
	        		v['tbody'] = $filter('orderBy')(v['tbody'], _column.name, _column.sort === 'desc' ? true:false);
	        	})
	        }
			
		}]
	})