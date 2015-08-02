'use strict';


angular.module('core').controller('HomeController', ['$scope', '$stateParams', '$http', 'Authentication',
	function($scope, $stateParams, $http, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


    $scope.postFilter = function(post){
      return post.user.displayName.indexOf($scope.keyword) > -1 || post.title.indexOf($scope.keyword) > -1
    }

    $scope.search = function(){
      $scope.keyword = $stateParams.keyword;
      $http.put('/search/' + $stateParams.keyword).success(function(data){
        $scope.result = data;
      });
    };
	}
]);