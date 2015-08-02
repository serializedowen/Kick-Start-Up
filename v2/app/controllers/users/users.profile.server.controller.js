'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Article = mongoose.model('Article');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

exports.changeFriendStatus = function(req, res) {

  req.user.friends.push(req.profile._id);
  req.user.save(function(err){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(req.user);
    }
  })
};

/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

exports.upvote = function(req, res){
	var user = req.user;
	if(user){
		user.upvote += 1;
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						console.log(user.upvote);
						res.json(user);
					}
				});
			}
		});
	}
}
exports.addToUpvote = function(req, res){
	var user = req.user;
		user.upvoteList.push(req.body.userId);
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			console.log(user.upvoteList);
			res.json(user); 
		});
}
exports.getUserProfile = function(req, res) {
  res.json(req.profile);
};
exports.savePic = function(req, res){
	console.log('here');
	console.log(req.body);
};


exports.getFriendList = function(req, res) {
  res.json(req.profile.friends);
};
