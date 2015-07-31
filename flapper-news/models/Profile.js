
var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
  username: String,
  bio: String,
  firstname: String,
  lastname: String

});

ProfileSchema.methods.changeBio = function(bio) {
  this.bio = bio;
};
ProfileSchema.methods.changeFirstname = function(bio) {
  this.firstname = bio;
};
ProfileSchema.methods.changeLastname = function(bio) {
  this.lastname = bio;
};

mongoose.model('Profile', ProfileSchema);
