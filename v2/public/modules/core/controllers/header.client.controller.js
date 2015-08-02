'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', '$http', 'Authentication', 'Menus',
	function($scope, $state, $http, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

    $scope.search = function(){
      if ($scope.keyword){
        $state.go('search', {keyword: $scope.keyword});
      }
    };


    $scope.getFriends = function(){
      if (Authentication.user){
        $http.get('/users/' + Authentication.user._id + '/friends').success(function(data){
          $scope.friends = data;
        }).error(function(){
            $scope.error.mesage = 'failed to load friend list.'
          }
        )
      }
    };
	}
]);