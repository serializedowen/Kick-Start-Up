
var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
  username: {type: String, lowercase: true},
  bio: {type: String, lowercase: true},
  firstname: {type: String, lowercase: true},
  lastname: {type: String, lowercase: true}

});

ProfileSchema.methods.changeBio = function(cb) {
  console.log("here");
  this.bio = 'lol';
  this.save(cb);
};
ProfileSchema.methods.changeFirstname = function(bio, cb) {

  this.firstname = bio;
  this.save(cb);
};
ProfileSchema.methods.changeLastname = function(bio, cb) {
  this.lastname = bio;
  this.save(cb);
};

mongoose.model('Profile', ProfileSchema);
  