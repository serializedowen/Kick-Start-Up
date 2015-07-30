var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Profile = mongoose.model('Profile');
var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});


// Preload post objects on routes with ':post'
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    return next();
  });
});

// Preload comment objects on routes with ':comment'
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
    return next();
  });
});

router.param('profile', function(req, res, next, id) {
  console.log(id);
  var query = Profile.findOne({username:id} , function(err,obj) { console.log("hi"); });
  query.exec(function (err, profile){
    if (err) { return next(err); }
    if (!profile) { return next(new Error("can't find comment")); }

    req.profile = profile;
    console.log(profile);
    return next();
  });
});


// return a post
router.get('/profile/:profile', function(req,res,next){
    console.log(req.profile);
    return res.json(req.profile);
});

router.post('/profile', auth, function(req, res, next) {
  var profile = new Profile(req.body);
  profile.firstname = 'steven';
  profile.lastname = 'diao';
  profile.id = '111111';

  profile.save(function(err, profile){
    if(err){ return next(err); }

    res.json(profile);
  });
});

router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
      res.json(post);
    });
});





// upvote a post
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

// create a new comment
router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.post('/posts/:post/applicants', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.body = req.payload._id;
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.applicants.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});


// upvote a comment
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});


router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password || !req.body.verify || !req.body.firstname || !req.body.lastname){
    return res.status(400).json({message: 'Please fill out all fields.'});
  }
  if(req.body.password != req.body.verify){
    return res.status(400).json({message: 'Password does not match'});
  }
  if(req.body.password.length < 6){
    return res.status(400).json({message: 'Password too short. (At least 6 digits)'});
  }

  var user = new User();
  user.username = req.body.username;

  user.setPassword(req.body.password);

  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.bio = req.body.bio
  user.save(function (err){
    if(err){
      return next(err);
    }
    return res.json({token: user.generateJWT()})
  });
});

router.post('/reset_password', function(req, res){
  if(!req.body.newPassword || !req.body.verifyPassword){
    return res.status(400).json({message: 'Please fill out all fields.'});
  }
  if(req.body.newPassword != req.body.verifyPassword){
    return res.status(400).json({message: 'Password does not match.'});
  }
  if(req.body.newPassword.length < 6){
    return res.status(400).json({message: 'Password too short. (At least 6 digits)'});
  }


  //change this to update to database
  return res.json({newPassword: req.body.newPassword})
});

module.exports = router;
