'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;



/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},

  endDate: {
    type: Date,
    default: (Date.now() + 1.296e+9)
    // defaulted to be 15 days.
  },
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Project Name cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
  applicants: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  members: [{
    type: Schema.ObjectId,
    ref: 'User',
    default: []
  }],
  thumbsUp: {
    type: Number,
    default: 0
  },
  comments: [{
    type: Schema.ObjectId,
    ref: 'Comment',
    default: []
  }]
});

mongoose.model('Article', ArticleSchema);