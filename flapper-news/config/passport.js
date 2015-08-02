var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
passport.use(new LocalStrategy(
	function(username, password, done){
		User.findOne({username:username}, function(err,user){
			if(err){return done(err);}
			if(!user){
				return done(null,false,{message:"incorrect username or password"});
			}
			if(!user.validPassword(password)){
				return done(null,false,{message:"incorrect username or password"});
			}
			return done(null,user);
		});
	}
));
/*
passport.use('facebook', new FacebookStrategy({
  clientID        : 491282591040878,
  clientSecret    : 293558bc25577b260f7395ee8dac4b23,
  callbackURL     : 'http://localhost:3000/auth/facebook/callback'
},
 
  // facebook will send back the tokens and profile
  function(access_token, refresh_token, profile, done) {
    // asynchronous
    process.nextTick(function() {
     
      // find the user in the database based on their facebook id
      User.findOne({ 'id' : profile.id }, function(err, user) {
 
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);
 
          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
 
            // set all of the facebook information in our user model
            newUser.fb.id    = profile.id; // set the users facebook id                
            newUser.fb.access_token = access_token; // we will save the token that facebook provides to the user                   
            newUser.fb.firstName  = profile.name.givenName;
            newUser.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
            newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
 
            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;
 
              // if successful, return the new user
              return done(null, newUser);
            });
         }
      });
    });
}));*/