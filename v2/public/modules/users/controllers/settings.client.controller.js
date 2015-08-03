'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$stateParams', '$http', '$location', 'Users', 'Authentication', 'UserProfile',
	function($scope, $stateParams, $http, $location, Users, Authentication, UserProfile) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}
			return false;
		};

    $scope.myProfile = function(){
      return Authentication.user._id === $stateParams.userId;
    };

    $scope.alreadyFriends = function(){
      var la = $scope.user.friends;
      for (var n in la){
        if (la[n] === $stateParams.userId){
          return true;
        }
      }
      return false;
    };

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};


    $scope.changeFriendStatus = function(){
      $http.post('/users/' + $stateParams.userId + '/add_friend').success(function(data){
        $scope.user = data;
      }).error(function(err){
        $scope.error.message = 'failed to add friend';
      });
    };

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {

			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

    $scope.findOne = function() {
      $scope.profile = UserProfile.get({userId: $stateParams.userId});
      $http.get('/users/' + $stateParams.userId + '/friends').success(function(data){
        $scope.friends = data;
      }).error(function(){
        $scope.error.message = 'failed to load friend list.'
      })
    };
    $scope.findArticles = function() {
    	console.log($stateParams.userId);
    	$http.get('/articles/man/'+$stateParams.userId).success(function(data){
        	$scope.result = data;
        	console.log($scope.result);
        	for (var n in $scope.result){
        		console.log($scope.result[n].user);
        	};
      	});
    };
    $scope.findApplied = function(){
    	$http.get('/article/person/'+$stateParams.userId).success(function(data){
        	$scope.result = data;
        	console.log($scope.result);
        	for (var n in $scope.result){
        		console.log($scope.result[n]);
        	};
      	});
    };
    $scope.findAllMember = function(){
      console.log("here");
      $http.get('/article/member/'+$stateParams.userId).success(function(data){
          $scope.result1 = data;
          console.log($scope.result);
          for (var n in $scope.result){
            console.log($scope.result[n]);
          };
      });
    };
    $scope.upvote = function(){
    	$http.put('/user/'+$stateParams.userId+'/upvote').success(function(){
    		$scope.profile.upvote += 1;
    	});
    	$http.post('/user/'+Authentication.user._id+'/upvoteList', $stateParams).success(function(){
    		$scope.user.upvoteList.push($stateParams.userId);
    	});
    };
    $scope.liked = function(){
    	for (var n =0;n < $scope.user.upvoteList.length; n++){
    		if($scope.user.upvoteList[n] == $stateParams.userId){
    			console.log("true");
    			return true;
    		};
    	};
    	console.log("false");
    	return false;
    };
    $scope.savePic = function(picture){
    	console.log(picture);
    	$http.post('/user/' + $stateParams.userId + '/pic', picture).success(function(){
    		console.log("coolie");
    	});
    };
    $scope.currentUser = function(){
      return Authentication.user.firstName;
    };
    }
]);