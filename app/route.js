module.exports = function(app, passport) {

  app.get('/', function(req, res){
    res.render('index.ejs');
  });

  //========= Login ====================
  app.get('/login', function(req, res,next){
    res.render('login.ejs', { message: req.flash('loginMsg') });
  });

  app.post('/login',function(req, res,next){
    passport.authenticate('local-login', {
      successRedirect : '/profile',
      failureRedirect : '/login',
      failureFlash    : true
  })(req,res,next)
  return res.json({message:"berhasil"});
})



  //========= Logout ====================
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  //========= Sign Up ====================
  app.get('/signup', function(req, res){
    res.render('signup.ejs', { message: req.flash('signUpMsg') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash    : true
  }));

  //========= Profile ====================
  app.get('/profile', isLoggedIn, function(req, res){
      res.render('profile.ejs', { user: req.user });
  });

};

function isLoggedIn(req, res, next) {
  if(req.user) return next();
  res.redirect('/');
}
