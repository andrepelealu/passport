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
  }, function(req,email,password,done){

    process.nextTick(function(){
        User.findOne({ 'local.email' : email }, function(err, user){
          if(err) return done(err);

          if(user) {
            return done(null, false, req.flash('signUpMsg', 'emailnya sudah terdaftar'));
          }else{
            const { body } = req;
              const {
                username,
                email,
                password,
                nama
              } = body;
            var newUser = new User();
            newUser.local.nama      = nama;
            newUser.local.email     = email;
            newUser.local.username  = username;
            newUser.local.password  = newUser.hashPassword(password);
            //newUser.local.date_creation    = date_creation;

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
          return done(null, false, req.flash('loginMsg', "Password salah!"));

        return done(null, user);
    });

  }));


};
