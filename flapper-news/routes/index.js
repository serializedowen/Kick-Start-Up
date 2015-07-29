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
router.param('profile', function(req, res, next, id) {
  var query = User.findById(id);

  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!User) { return next(new Error("can't find post")); }

    req.user = user;
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


// return a post
router.put('/profile/:profile', auth, function(req,res,next){
  if(req.body.bio){
    req.user.setBio(req.body.bio);
    res.json(user);
  }
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
  if(!req.body.username || !req.body.password || !req.body.verify || !req.body.type){
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
<<<<<<< HEAD

  user.setPassword(req.body.password);

  user.bio = req.body.bio

=======
  user.setPassword(req.body.password);
>>>>>>> 6b5cfe9a1b239f9ea0fd388d50c0ef45d084eda1
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
