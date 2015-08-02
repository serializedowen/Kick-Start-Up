'use strict';


angular.module('core').controller('HomeController', ['$scope', '$stateParams', '$http', 'Authentication',
	function($scope, $stateParams, $http, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

    $scope.search = function(){
      $scope.keyword = $stateParams.keyword;
      $http.put('/search/' + $stateParams.keyword).success(function(data){
        $scope.result = data;
      });
    };
	}
]);