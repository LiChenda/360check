'use strict';

angular.module('allScore').
	component('allScore',{
		templateUrl: '/static/js/all-score/all-score.template.html',
		controller: ['$http', '$scope','$filter','LxNotificationService', function checkCaptainController($http, $scope, $filter, LxNotificationService){
			var self = this;
			// self.export = function(){
			// 	toExcel('table0', 'all', 0, 5);
			// }
			$http.get('/getFinalScore').then(function(response){
				if(response.data==3){
					LxNotificationService.warning('Be Careful');
					return false;
				}
				self.finalScore = response.data;
				// console.log(self.finalScore);
				self.dataTableTbody = []
				self.dataTableList = {};
				self.dataTableThead = [
		        {
		            name: 'realname',
		            label: '姓名',
		            sortable: false
		        },
		        // {
		        //     name: 'A_1',
		        //     label: 'A',
		        //     sortable: false
		        // },
		        // {
		        //     name: 'B_1',
		        //     label: 'B',
		        //     sortable: false
		        // },
		        // {
		        //     name: 'C_1',
		        //     label: 'C',
		        //     sortable: false
		        // },
		        {
		            name: 'part_1_score',
		            label: '队员考核',
		            sortable: true
		        },
		        // {
		        //     name: 'A_2',
		        //     label: 'A',
		        //     sortable: false
		        // },
		        // {
		        //     name: 'B_2',
		        //     label: 'B',
		        //     sortable: false
		        // },
		        // {
		        //     name: 'C_2',
		        //     label: 'C',
		        //     sortable: false
		        // },
		        {
		            name: 'part_2_score',
		            label: '队委会考核',
		            sortable: true
		        },
		        {
		            name: 'total_score',
		            label: '总分',
		            sortable: true
		        }
		        ];
				angular.forEach(self.finalScore, function(v, i){
					if(v['identity'][0]==='captain'){
						self.finalScore[i]['part_1_score'] = parseFloat((v['part_1']['A']*0.3 + v['part_1']['B']*0.7).toFixed(2));
					}else if(v['identity'][0]==='teamLeader'){
						self.finalScore[i]['part_1_score'] = parseFloat((v['part_1']['A']*0.3 + v['part_1']['B']*0.3 + v['part_1']['C']*0.4).toFixed(2));
					}else{
						self.finalScore[i]['part_1_score'] = parseFloat((v['part_1']['A']*0.3 + v['part_1']['B']*0.4 + v['part_1']['C']*0.3).toFixed(2));
					}
					if(v['identity'][1]==='captain'){
						self.finalScore[i]['part_2_score'] = parseFloat((v['part_2']['A']*0.3 + v['part_2']['B']*0.7).toFixed(2));
					}else if(v['identity'][1]==='minister'){
						self.finalScore[i]['part_2_score'] = parseFloat((v['part_2']['A']*0.3 + v['part_2']['B']*0.3 + v['part_2']['C']*0.4).toFixed(2));
					}else{
						self.finalScore[i]['part_2_score'] = parseFloat((v['part_2']['A']*0.3 + v['part_2']['B']*0.4 + v['part_2']['C']*0.3).toFixed(2));
					}
					self.finalScore[i]['total_score'] = parseFloat((self.finalScore[i]['part_1_score']+self.finalScore[i]['part_2_score']).toFixed(2));
					self.dataTableTbody.push({
						id: i,
						realname: v['realname'],
						// A_1: v['part_1']['A'],
						// B_1: v['part_1']['B'],
						// C_1: v['part_1']['C'],
						part_1_score: self.finalScore[i]['part_1_score'],
						// A_2: v['part_2']['A'],
						// B_2: v['part_2']['B'],
						// C_2: v['part_2']['C'],
						part_2_score: self.finalScore[i]['part_2_score'],
						total_score: self.finalScore[i]['total_score']
					})
					angular.forEach(v['xmz'], function(v1, i1){
						if(self.dataTableList[v1]){
							self.dataTableList[v1]['tbody'].push({
								realname: v['realname'],
								part_1_score: self.finalScore[i]['part_1_score'],
								part_2_score: self.finalScore[i]['part_2_score'],
								total_score: self.finalScore[i]['total_score']
							})
						}else{
							self.dataTableList[v1] = {
								thead: angular.copy(self.dataTableThead),
								tbody: [{
									realname: v['realname'],
									part_1_score: self.finalScore[i]['part_1_score'],
									part_2_score: self.finalScore[i]['part_2_score'],
									total_score: self.finalScore[i]['total_score']
								}]
							}
						}
					})

				})
				var tableExcel = document.createElement('table');
				var tbodyExcel = document.createElement('tbody');
				angular.forEach(self.dataTableList, function(v, i){
					var tr_title = document.createElement('tr');
					tr_title.innerHTML = '<td colspan="4" style="text-align:center">'+i+'</td>';
					var tr_head = document.createElement('tr');
					tr_head.innerHTML = '<td>姓名</td><td>队员考核</td><td>队委会考核</td><td>总分</td>';
					tbodyExcel.appendChild(tr_title);
					tbodyExcel.appendChild(tr_head);
					angular.forEach(v['tbody'], function(v1, i1){
						var tr = document.createElement('tr');
						tr.innerHTML = '';
						tr.innerHTML += '<td>'+v1['realname']+'</td>'
						tr.innerHTML += '<td>'+v1['part_1_score']+'</td>'
						tr.innerHTML += '<td>'+v1['part_2_score']+'</td>'
						tr.innerHTML += '<td>'+v1['total_score']+'</td>'
						tbodyExcel.appendChild(tr);
					})
					// var tr = document.createElement('tr');
					// tr.innerHTML = '<td></td><td></td><td></td><td></td>';
					// tbodyExcel.appendChild(tr);
				})
				tableExcel.appendChild(tbodyExcel);
				tableExcel.setAttribute('style','width:100px')
				tbodyExcel.setAttribute('style','display:none')
				document.querySelector('.export-table').appendChild(tableExcel);
				$('.export-table table').tableExport({
					bootstrap: false,
					formats: ["xls"],
					fileName: "360考核分数统计"
				});
				// console.log(self.dataTableList)

				
		        
		        self.advancedDataTableThead = angular.copy(self.dataTableThead);
		       
		       
		        $scope.$on('lx-data-table__sort', updateSort);

		        ////////////

		        function updateSort(_event, _column)
		        {
		        	$('#table0 table').tableExport({bootstrap: false});
		            self.dataTableTbody = $filter('orderBy')(self.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
		        	angular.forEach(self.dataTableList, function(v, i){
		        		v['tbody'] = $filter('orderBy')(v['tbody'], _column.name, _column.sort === 'desc' ? true:false);
		        	})
		        }
			})
			
		}]
	})