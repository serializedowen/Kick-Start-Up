'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
  ArticleCtrl = require('./articles.server.controller'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  User = mongoose.model('User'),
  Comment = mongoose.model('Comment');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.search = function(req, res) {
  ArticleCtrl.list(req, res);
};

  exports.loginAdmin = function(req, res){
    if (req.body.Administrator == 'admin' && req.body.password == 'admin'){

      Article.find().exec(function(err, articles) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          User.find().exec(function(err, users) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json({isAdmin :true, articles : articles, users : users});
            }})
        }})}else{
      res.json({isAdmin : false})
    }

}