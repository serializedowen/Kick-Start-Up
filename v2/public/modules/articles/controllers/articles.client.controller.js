'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Articles', '$modal', '$log',
	function($scope, $http, $stateParams, $location, Authentication, Articles, $modal, $log) {
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

    $scope.createComment = function () {
      var modalInstance = $modal.open({
        size: 'md',
        templateUrl: 'modules/articles/views/create-comment.client.view.html',
        controller: function ($scope, $stateParams, $modalInstance, $http, user, article) {
          $scope.user = user;
          $scope.article = article;
          $scope.submit = function(){
            $http.post('/articles/' + $stateParams.articleId + '/add_comment', $scope.comment).success(function(data){
              $http.get('/articles/' + $stateParams.articleId).success(function(data){
                $modalInstance.close(data);
              })
            });
          };
        },
        resolve: {
          user: function () {
            return $scope.authentication.user;
          },
          article: function(){
            return $scope.articles;
          }
        }
      });

      modalInstance.result.then(function(article) {
        $scope.article = article;
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
      var comments = $scope.article.comments;
      //console.log(article.applicants)
      console.log("here");
      $http.post('/articles/' + $scope.article._id + '/apply').success(function(data){
        $scope.article = data;
        $scope.article.comments = comments;
      });
    };

    $scope.unapplyForJob = function() {
      var comments = $scope.article.comments;
      $http.delete('/articles/' + $scope.article._id + '/apply').success(function(data){
        $scope.article = data;
        $scope.article.comments = comments;
      });
    };

		$scope.find = function() {
      $scope.articles = Articles.query();
    };

    $scope.acceptJob = function(id){
    	var x = {ids: id};
    	var article = $scope.article;
      var comments = article.comments;
    	$http.post('/article/accept/' + $scope.article._id, x).success(function(data){
        $scope.article = data;
        $scope.article.comments = comments
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
      var comments = $scope.article.comments;
      $http.post('/articles/' + $scope.article._id + '/upvote').success(function(data){
        $scope.article = data;
        $scope.article.comments = comments;
      });
    };


    $scope.parse = function(){
      return Date.parse($scope.article.endDate) - Date.parse($scope.article.created);
    }
	}
]);