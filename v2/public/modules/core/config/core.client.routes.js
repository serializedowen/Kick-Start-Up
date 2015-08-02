'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
    state('search', {
        url: '/search/{keyword}',
        templateUrl: 'modules/core/views/search.html'
      }).
	    state('about_us', {
			url: '/about_us',
			templateUrl: 'modules/core/views/about_us.html'
		}).
		state('contact_us', {
			url: '/contact_us',
			templateUrl: 'modules/core/views/contact_us.html'
		}).
		state('privacy_policy', {
			url: '/privacy_policy',
			templateUrl: 'modules/core/views/privacy_policy.html'
		}).
		state('term_of_use', {
			url: '/term_of_use',
			templateUrl: 'modules/core/views/term_of_use.html'
		})
	}
]);