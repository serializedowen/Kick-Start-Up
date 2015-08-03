'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Articles','Users',
	function($scope, $http, $stateParams, $location, Authentication, Articles, Users) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;
			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

    $scope.applyForJob = function() {
      var article = $scope.article;
      //console.log(article.applicants)
      console.log("here");
      $http.post('/articles/' + $scope.article._id + '/apply').success(function(data){
        $scope.article = data;
      });
    };

    $scope.unapplyForJob = function() {
      var article = $scope.article;
      $http.delete('/articles/' + $scope.article._id + '/apply').success(function(data){
        $scope.article = data;
      });
    };

		$scope.find = function() {
      $scope.articles = Articles.query();
    };
    $scope.acceptJob = function(id){
    	var x = {ids: id};
    	var article = $scope.article;
    	$http.post('/article/accept/' + $scope.article._id, x).success(function(data){
        	$scope.article = data;
      });
    };
    $scope.getNames = function(id){
    	$scope.name = [];
    	for (var p = 0; p < id.length; p++){
    		$http.get('/users/' + id).success(function(data){
    			console.log(data.firstName);
    			$scope.name.push(data);
    		});
    	};
    };


    $scope.applied = function(){
      var la = $scope.article.applicants;
      for (var n in la){
        if (la[n] === Authentication.user._id){
          return true;
        }
      }
      return false;
    };

    $scope.member = function(){
      var la = $scope.article.members;
      console.log(la);
      for (var n in la){
        if (la[n] === Authentication.user._id){
          return true;
        }
      }
      return false;
    };

		$scope.findOne = function() {
			$scope.article = Articles.get({articleId: $stateParams.articleId});
		};

    $scope.thumbsup = function() {
      var article = $scope.article;
      $http.post('/articles/' + $scope.article._id + '/upvote').success(function(data){
        $scope.article = data;
      });
    };


    $scope.parse = function(){
      return Date.parse($scope.article.endDate) - Date.parse($scope.article.created);
    }
	}
]);