'use strict';

angular.module('starList').
	component('starList',{
		templateUrl: '/static/js/star-list/star-list.template.html',
		controller: ['$http', function starListController($http){
			var self = this;
			$http.get('/getStars').then(function(response){
				self.stars = response.data;
				console.log(self.stars);
				$('#star-chart').highcharts({
			        chart: {
			            type: 'column'
			        },
			        title: {
			            text: '360考核明星榜'
			        },
			        xAxis: {
			            categories: (function(){
			            	var re = [];
			            	angular.forEach(self.stars, function(v, i){
			            		re.push(v['realname']);
			            	})
			            	return re;
			            })()
			        },
			        yAxis: {
			            min: 0,
			            title: {
			                text: '分数'
			            },
			            stackLabels: {
			                enabled: true,
			                style: {
			                    fontWeight: 'bold',
			                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
			                }
			            }
			        },
			        legend: {
			            align: 'right',
			            x: -30,
			            verticalAlign: 'top',
			            y: 25,
			            floating: true,
			            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
			            borderColor: '#CCC',
			            borderWidth: 1,
			            shadow: false
			        },
			        tooltip: {
			            formatter: function () {
			                return '<b>' + this.x + '</b><br/>' +
			                    this.series.name + ': ' + this.y + '<br/>' +
			                    'Total: ' + this.point.stackTotal;
			            }
			        },
			        plotOptions: {
			            column: {
			                stacking: 'normal',
			                dataLabels: {
			                    enabled: true,
			                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
			                    style: {
			                        textShadow: '0 0 3px black'
			                    }
			                }
			            }
			        },
			        series: (function(){
			        	var re = [{
			        		name: '队员考核',
			        		data: []
			        	},{
			        		name: '队委会考核',
			        		data: []
			        	}];
			        	angular.forEach(self.stars, function(v, i){
			        		re[0]['data'].push(v['part_1_score']);
			        		re[1]['data'].push(v['part_2_score']);
			        	})
			        	return re;
			        })()
			    });
			})


		}]
	})