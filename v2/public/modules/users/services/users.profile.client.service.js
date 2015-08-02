'use strict';

angular.module('users').factory('UserProfile', ['$resource',
  function($resource) {
    return $resource('users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);