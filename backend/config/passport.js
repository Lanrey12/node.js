const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');

const Users = mongoose.model('Users');

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



passport.use(new localStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
  passReqToCallback : true 

}, (email, password, done) => {
  Users.findOne({email})
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }

      return done(null, user);
    }).catch(done);
}));



