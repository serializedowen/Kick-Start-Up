'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
  UsrCtrl = require('./users.server.controller'),
  ArticleCtrl = require('./articles.server.controller')

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.search = function(req, res) {
  console.log("server");

  ArticleCtrl.list(req, res);

};