'use strict';

angular.
  module('userList').
  component('userList', {
    templateUrl: '/static/js/user-list/user-list.template.html',
    controller: function UserListController($scope, $http) {
      var self = this;
      self.orderProp = 'username';

      $http.get('/admin/getAllUsers').then(function(response) {
        self.users = response.data;
        angular.forEach(self.users,function(value, index){
          self.users[index]['isChanged'] = false;
          self.users[index]['xmz'] = self.users[index]['xmz']||[];
          self.users[index]['dwh'] = self.users[index]['dwh']||[];
          self.users[index]['zzb'] = self.users[index]['zzb']||[];
        })
        self.originUsers = angular.copy(response.data);  //这里需要注意：response.data与self.users绑定，所以用深拷贝
        // console.log(self.originUsers)
        console.log(response.data.length)
      });
      $http.get('/static/json/config.json').then(function(response){
        self.config = response.data;
        // console.log(response.data);
      })

      self.updateUser = function(user,name,value){
          user[name] = user[name]||[]; 
          var index = user[name].indexOf(value);
          if(index == -1){
            user[name].push(value)
          }else{
            user[name].splice(index,1);
          }
          var originUser;
          angular.forEach(self.originUsers,function(value, index){
            if(self.originUsers[index].username == user.username){
              originUser = self.originUsers[index];
            }
          })
           
          user['isChanged'] = self.isChanged(user, originUser);
          // console.log(user[name])
      }

      self.isChanged = function(obj1, obj2){
        if(obj1['xmz'].sort().toString() == obj2['xmz'].sort().toString() && obj1['dwh'].sort().toString() == obj2['dwh'].sort().toString() && obj1['zzb'].sort().toString() == obj2['zzb'].sort().toString()){
          return false;
        }else{
          return true;
        }
      }
      self.submitChange = function(){
        // $window.confirm()
        $http.post('/admin/updateUsers',self.users).
          success(function(data, status, headers, config){
            // self.originUsers = angular.copy(self.users);
            window.location.reload();
          }).
          error(function(data, status, headers, config){
            console.log('update failed')
          })
      }
      $scope.$on('ngRepeatFinished', function( ngRepeatFinishedEvent ) {
        var height = document.querySelector('thead').getBoundingClientRect().height;
        document.querySelector('.thead-fixed').setAttribute('style','height:'+height+'px')
        console.log('OKOK')
      })
    }

    
  }).
  directive('headResize', function($window) {
  return {
    link: function(scope, element, attr) {
      angular.element($window).bind('resize',function(event){
        var height = document.querySelector('thead').getBoundingClientRect().height;
        // console.log(height)
        element.css({
          height: height + 'px'
        })
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
