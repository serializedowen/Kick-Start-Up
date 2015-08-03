'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Article'),
  Comment = mongoose.model('Comment'),
	_ = require('lodash');

/**
 * Create a article
 */
exports.create = function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;
	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
  var article = req.article;
  article.comments = req.comments;

  console.log(article);
  res.json(article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
    var article = req.article;

	article = _.extend(article, req.body);

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
	Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));
		req.article = article;

		next();
	});
};
exports.articleByAuthor = function(req, res, next, id) {
	Article.find({'user' : id}).exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));
		req.article = article;
		next();
	});
};

exports.articleByApplicant = function(req, res, next, id){
	var article = [];
	var articles = Article.find().exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			for (var x in articles){
				for (var n = 0; n < articles[x].applicants.length; n++){
					if(articles[x].applicants[n] == id){
						article.push(articles[x]);
				};
			};
		};
			req.article = article;
			next();
		}
	});

};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

exports.applyForJob = function(req, res) {
  var article = req.article;

  req.article.applicants.push(req.user.id);
  req.article.save(function(err){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  })
};

exports.unapplyForJob = function(req, res) {
  var article = req.article;

  req.article.applicants.remove(req.user.id);
  req.article.save(function(err){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  })
};

exports.upvote = function(req, res) {
  req.article.thumbsUp += 1;
  req.article.save(function(err){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(req.article);
    }
  })
};

exports.commentList = function(req, res, next){
  Comment.find({'article': req.article._id}).populate('user', 'displayName').exec(function(err, comments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.comments = comments;
      next();
    }
  })
};


exports.getComment = function(req, res){
  res.json(req.comment);
};

exports.addComment = function(req, res){
  var comment = new Comment(req.body);
  comment.article = req.article._id;
  comment.user = req.user._id;
  comment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else{
      res.json(comment);
    }
  });

};
exports.commentByID = function(req, res, next, id){
  Comment.findById(id).populate('user', 'displayName', 'content').exec(function(err, comment) {
    if (err) return next(err);
    if (!comment) return next(new Error('Failed to load comment ' + id));
    req.comment = comment;
    next();
  });
};