'use strict';


angular.module('core').controller('HomeController', ['$scope', '$stateParams', '$http', 'Authentication',
	function($scope, $stateParams, $http, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.isAdmin = false;

    $scope.postFilter = function(post){
      return post.user.displayName.indexOf($scope.keyword) > -1 || post.title.indexOf($scope.keyword) > -1
    }

    $scope.search = function(){
      $scope.keyword = $stateParams.keyword;
      $http.put('/search/' + $stateParams.keyword).success(function(data){
        $scope.result = data;
      });
    };


    $scope.loginAdmin = function(){
      $http.post('/admin', $scope.credentials).then(function(data){
        $scope.isAdmin = data.data.isAdmin;
        $scope.articles = data.data.articles;
        $scope.users = data.data.users;
      });
      //  .success(function(data){
      //  console.log('suc');
      //  $scope.isAdmin = true;
      //}).error(function(err){
      //  console.log('err');
      //  $scope.error.message = 'screw you! wrong credentials.'
      //})
    }
	}
]);