'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/articles.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/articles')
		.get(articles.list)
		.post(users.requiresLogin, articles.create);


  app.route('/articles/:articleId/add_comment').post(users.requiresLogin, articles.addComment);
  app.route('articles/:articleId/:commentId').get(articles.getComment);
  app.route('/articles/:articleId/upvote').post(users.requiresLogin, articles.upvote);
  app.route('/articles/:articleId/apply')
    .post(users.requiresLogin, articles.applyForJob)
    .delete(users.requiresLogin, articles.unapplyForJob);

  app.route('/articles/:articleId')
		.get(articles.commentList, articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
	app.route('/articles/man/:personId')
		.get(articles.read);
	app.route('/article/person/:applicantId')
		.get(articles.read);
	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
	app.param('personId', articles.articleByAuthor);
	app.param('applicantId', articles.articleByApplicant);
  app.param('commentId', articles.commentByID);
};