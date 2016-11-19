module.exports = function(app, passport) {

    app.get('/', function (req,res) {
       res.render('index.ejs');
    });

    app.get('/login', function (req,res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    app.get('/signup', function(req,res){
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    app.get('/js', function (req, res) {
        res.sendfile('app/script.js');
    })

    app.get('/dashboard', isLoggedIn, function (req, res) {
        res.render('dashboard.ejs', {
            user: req.user
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/signup', passport.authenticate('LocalSignup', {
        successRedirect : '/dashboard',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.post('/details', function (req, res) {
        req.user.updateDetails(req.body);
        req.user.save();
        res.redirect('/dashboard');
    });


    app.post('/login', passport.authenticate('LocalLogin', {
        successRedirect : '/dashboard',
        failureRedirect : '/login',
        failureFlash : true
    }));


};


function isLoggedIn(req,res,next){

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}