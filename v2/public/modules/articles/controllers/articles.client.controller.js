'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $http, $stateParams, $location, Authentication, Articles) {
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
      //console.log(article.applicants);
      $http.post('/articles/' + $scope.article._id + '/apply').success(function(data){
        $scope.article = data;
      })
    };

    $scope.unapplyForJob = function() {
      var article = $scope.article;
      //console.log(article.applicants);
      $http.delete('/articles/' + $scope.article._id + '/apply').success(function(data){
        $scope.article = data;
      })
    };

		$scope.find = function() {
      $scope.articles = Articles.query();
    };

    $scope.applied = function(){
      var la = $scope.article.applicants;
      for (var n in la){
        if (la[n] === Authentication.user._id){
          return true;
        }
      }
      return false;
    }

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);