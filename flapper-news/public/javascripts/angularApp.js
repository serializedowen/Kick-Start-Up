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
  .state('makingPosts', {
    url: '/posts/makingPost',
    templateUrl: '/views/makingPost.html',
    controller: 'MainCtrl'
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
      templateUrl: '/views/profile/profileSteven.html',
      controller: 'ProfileCtrl',
      resolve: {
      profiles: ['$stateParams', 'profile', function($stateParams, profile) {
      return profile.get($stateParams.id);
      }]
    }
    })
    .state('contact', {
      url: '/contact',
      templateUrl: '/views/profile/contact.html',
      controller: 'ProfileController'
    })


    //Deryk project page temporary
    .state('dproject', {
      url: '/dproject',
      templateUrl: '/views/profile/Deryk_project_page.html',
      controller: 'ProfileController'
    })

    //Deryk Our Team page temporary
    .state('ourteam', {
      url: '/ourteam',
      templateUrl: '/views/profile/deryk_AboutUs_page.html',
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

    .state('search', {
      url: '/search/{kword}',
      templateUrl: '/views/search.html',
      controller: 'SearchController',
      onEnter: console.log("seart")
    })

  .state('404', {
    url: '/page_not_found',
    templateUrl: 'views/404.server.view.html'
  })

  $urlRouterProvider.otherwise('page_not_found');

}])
.factory('profile', ['$http', 'auth', function($http, auth){
    var p = {};
    p.get = function(id){
      return $http.get('/profile/' + id).then(function(res){
        return res.data;
      });
    };
    p.create = function(profile){
    return $http.post('/profile', profile, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
      })

    };

    p.changeBio = function(bio){
      return $http.post('/profile', user)
    }
    return p;
}])


.factory('posts', ['$http', 'auth', '$window', function($http, auth, $window){
  var o = {
	posts: []
  };

  o.get = function(id) {
	return $http.get('/posts/' + id).then(function(res){
	  return res.data;
	});
  };
  o.rightOwner = function(author){
      var token = auth.getToken();

      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        if(payload.username === author){
          return true;
        };
      };
      return false;
  };
  o.applyedAlready = function(posts1){
     var token = auth.getToken();

      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        for(var i = 0; i<posts1.length; i++){
          if(payload.username === posts1[i].author){
            return true;
          };
        };
      };
      return false;
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
        console.log(payload._id);
        return payload._id;
      }},

    currentUser: function(){
      if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
      }
    },
    myBio: function(){
       if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.bio;
      }
    },
    changeBio: function(body){
      return $http.put('/profile', body).success(function(data){
          auth.saveToken(data.token);
      });
    },
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
'$window',
'$state',
function($scope, posts, auth, $window, $state){

  $scope.posts = posts.posts;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addPost = function(){
    if($scope.title === '') { return; }
    posts.create({
      title: $scope.title,
      body: $scope.bodyStuff,
      dateStart: Date.now(),
      dateEnd: $scope.dateEnd
    }).then(function(post){
      $state.go('home');
    });
    $scope.title = '';
    $scope.bodyStuff = '';
    $scope.dateStart = '';
    $scope.dateEnd = '';
  };

  $scope.incrementUpvotes = function(post) {
	posts.upvote(post);
  };

}])
.controller('ProfileCtrl', [
'$scope',
'posts',
'auth',
'profiles',
function($scope, posts, auth, profiles){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.profile = profiles[0];
  console.log("hi");
}])
.controller('PostsCtrl', [
'$scope',
'posts',
'post',
'auth',
'$window',
function($scope, posts, post, auth, $window){
  $scope.post = post;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.rightOwner = function(){
    return posts.rightOwner(post.author)
  }
  $scope.applyedAlready = function(){
    return posts.applyedAlready(post.comments);
  }
  $scope.addComment = function(){
    var token = auth.getToken();
    var payload = JSON.parse($window.atob(token.split('.')[1]));
    posts.addComment(post._id, {
      body: String(payload._id),
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
'profile',
function($scope, $state, auth, profile){
  $scope.user = {};
  $scope.register = function(){
	auth.register($scope.user).error(function(error){
	  $scope.error = error;
	}).then(function(){
    profile.create({username: $scope.user.username}).then(function(){
      $state.go('home');
    });
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
  '$state',
function($scope, auth, $state){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
  $scope.currentUID = auth.currentUID;
  $scope.search = function(){
    if ($scope.keyword){
      $state.go('search', {kword: $scope.keyword})
    }
  }
}])


.controller('ProfileController', [
    '$scope',
    '$state',
    '$stateParams',
    'auth',
    'profile',
    function($scope, $state, $stateParams, auth, profile){
      $scope.resetUserPassword = function(){
        profile.resetPassword($scope.passwordDetails).error(function (error) {
          $scope.error = error;
        }).success(function (data) {
          $scope.testing = data.newPassword;
        })
      }
      $scope.getProfile = function(){
        profile.getProfile($stateParams.id).success(function (data){
          $scope.username = data.user.username;
        }).error(function (error){
          $state.go('page_not_found');
        })
      }

    }
  ]
)

.controller('SearchController', [
    '$scope',
    '$stateParams',
    'posts',
    function($scope, $stateParams, posts){
      $scope.keyword = $stateParams.kword;
      posts.getAll();
      $scope.result = posts.posts;
      $scope.postFilter = function(post){
        //return post.author === $scope.keyword || post.title === $scope.keyword;
        return post.author.indexOf($scope.keyword) > -1 || post.title.indexOf($scope.keyword) > -1
      }
    }
  ])
