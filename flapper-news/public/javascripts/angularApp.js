// we set up the app variable

angular.module('Kick-Start-Up', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
	.state('home', {
	  url: '/home',
	  templateUrl: '/views/home.html',
	  controller: 'MainCtrl',
	  resolve: {
		postPromise: ['posts', function(posts){
		  return posts.getAll();
		}]
	  }
	})
	.state('posts', {
	  url: '/posts/{id}',
	  templateUrl: '/views/posts.html',
	  controller: 'PostsCtrl',
	  resolve: {
		post: ['$stateParams', 'posts', function($stateParams, posts) {
		  return posts.get($stateParams.id);
		}]
	  }
	})
	.state('login', {
	  url: '/login',
	  templateUrl: '/views/login.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
		if(auth.isLoggedIn()){
		  $state.go('home');
		}
	  }]
	})
	.state('register', {
	  url: '/register',
	  templateUrl: '/views/register.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
		if(auth.isLoggedIn()){
		  $state.go('home');
		}
	  }]
})
    .state('profile', {
      url: '/profile/{id}',
      templateUrl: '/views/profile/profile_client_view.html',
      controller: 'ProfileController'
    })


  .state('reset_password', {
    url: '/reset_password',
    templateUrl: '/views/profile/reset-password.html',
    controller: 'ProfileController',
    onEnter:  ['$state', 'auth', function($state, auth){
      if(!auth.isLoggedIn()){
        $state.go('home');
      }
    }]
  })
  .state('404', {
    url: '/page_not_found',
    templateUrl: 'views/404.server.view.html'
  })

  $urlRouterProvider.otherwise('home');

}])


.factory('profile', ['$http', 'auth', function($http, auth){
    var p = {};
    p.resetPassword = function(user){
      return $http.post('/reset_password', user);
    }

    p.getProfile = function(id) {
      return $http.get('/profile/' + id);
    }
    return p;
}])


.factory('posts', ['$http', 'auth', function($http, auth){
  var o = {
	posts: []
  };

  o.get = function(id) {
	return $http.get('/posts/' + id).then(function(res){
	  return res.data;
	});
  };

  o.getAll = function() {
	return $http.get('/posts').success(function(data){
	  angular.copy(data, o.posts);
	});
  };

  o.create = function(post) {
	return $http.post('/posts', post, {
	  headers: {Authorization: 'Bearer '+auth.getToken()}
	}).success(function(data){
	  o.posts.push(data);
	});
  };

  o.upvote = function(post) {
	return $http.put('/posts/' + post._id + '/upvote', {
	  headers: {Authorization: 'Bearer '+auth.getToken()}
	}).success(function(data){
	  post.upvotes += 1;
	});
  };

  o.addComment = function(id, comment) {
	return $http.post('/posts/' + id + '/comments', comment, {
	  headers: {Authorization: 'Bearer '+auth.getToken()}
	});
  };

  o.upvoteComment = function(post, comment) {
	return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', {
	  headers: {Authorization: 'Bearer '+auth.getToken()}
	}).success(function(data){
	  comment.upvotes += 1;
	});
  };

  return o;
}])
.factory('auth', ['$http', '$window', '$rootScope', function($http, $window, $rootScope){
   var auth = {
     saveToken: function (token){$window.localStorage['flapper-news-token'] = token;},
     getToken: function (){return $window.localStorage['flapper-news-token'];},
     isLoggedIn: function(){
        var token = auth.getToken();
        if(token){
          var payload = JSON.parse($window.atob(token.split('.')[1]));

          return payload.exp > Date.now() / 1000;
        } else {
        return false;}},

    currentUID: function (){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload._id;
      }},

    currentUser: function(){
      if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.username;
      }},

    register: function(user){
      return $http.post('/register', user).success(
        function(data){
          auth.saveToken(data.token);
        })
    },
    logIn: function(user){
      return $http.post('/login', user).success(
        function(data){
          auth.saveToken(data.token);})},
    logOut: function(){$window.localStorage.removeItem('flapper-news-token');}}
  return auth;
}])
.controller('MainCtrl', [
'$scope',
'posts',
'auth',
function($scope, posts, auth){
  $scope.test = 'Hello world!';

  $scope.posts = posts.posts;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addPost = function(){
	if($scope.title === '') { return; }
	posts.create({
	  title: $scope.title,
	  link: $scope.link,
	});
	$scope.title = '';
	$scope.link = '';
  };

  $scope.incrementUpvotes = function(post) {
	posts.upvote(post);
  };

}])
.controller('PostsCtrl', [
  '$scope',
  'posts',
  'post',
  'auth',
function($scope, posts, post, auth){
  $scope.post = post;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addComment = function(){
	if($scope.body === '') { return; }
	posts.addComment(post._id, {
	  body: $scope.body,
	  author: 'user',
	}).success(function(comment) {
	  $scope.post.comments.push(comment);
	});
	$scope.body = '';
  };

  $scope.incrementUpvotes = function(comment){
	posts.upvoteComment(post, comment);
  };
}])
.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};
  $scope.register = function(){
	auth.register($scope.user).error(function(error){
	  $scope.error = error;
	}).then(function(){
	  $state.go('home');
	});
  };

  $scope.logIn = function(){
	  auth.logIn($scope.user).error(function(error){
	  $scope.error = error;
	}).then(function(){
	  $state.go('home');
	});
  };
}])

.controller('NavCtrl', [
  '$scope',
  'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}])


.controller('ProfileController', [
    '$scope',
    'auth',
    'profile',
    function($scope, auth, profile){
      $scope.resetUserPassword = function(){
        profile.resetPassword($scope.passwordDetails).error(function (error) {
          $scope.error = error;
        }).success(function (data) {
          $scope.testing = data.newPassword;
        })
      }


      $scope.getProfile = function(){
        profile.getProfile().success(function (data){

        }).error(function (error){

        })
      }
    }
  ]
)
