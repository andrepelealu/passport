var LocalStrategy = require('passport-local').Strategy;
var User          = require('../app/models/user');

module.exports = function(passport) {

  //====== seralize dan desrializeUser
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

  //====== signup ==============================
  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done){

    process.nextTick(function(){
        User.findOne({ 'local.email' : email }, function(err, user){
          if(err) return done(err);

          if(user) {
            return done(null, false, req.flash('signUpMsg', 'emailnya sudah terdaftar'));
          }else{
            var newUser = new User();
            newUser.local.email    = email;
            newUser.local.password = newUser.hashPassword(password);

            newUser.save(function(err){
              if(err) throw err;
              return done(null, newUser);
            });
          }

        });
    });

  }));

  //====== login ==============================
  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done){

    User.findOne({ 'local.email' : email }, function(err, user){
        if(err) return done(err);

        if(!user)
         return done(null, false, req.flash('loginMsg', "User belum terdaftar"));

        if(!user.checkPassword(password))
          return done(null, false, req.flash('loginMsg', "Password ente salah gan!"));

        return done(null, user);
    });

  }));


};
