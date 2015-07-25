/**
 * Created by OwenWang on 15-07-25.
 */

angular.module('Kick-Start-Up').controller('ProfileController', ['$scope', '$stateParams', '$http', '$location', 'auth',
    function($scope, $stateParams, $http, $location, Authentication) {
        $scope.authentication = auth;

        $scope.testing = "abc";
        //If user is signed in then redirect back home
        //if ($scope.authentication.user) $location.path('/');

        // Change user profile
        $scope.resetUserPassword = function() {

            $scope.success = $scope.error = null;

            $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.passwordDetails = null;

                // Attach user profile
                Authentication.user = response;

                // And redirect to the index page
                $location.path('/profile/reset/success');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
