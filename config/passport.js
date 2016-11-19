var strategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('LocalSignup', new strategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {

            process.nextTick(function () {


                User.findOne({'username': username}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That name is already taken.'));
                    } else {
                        var newUser = new User();

                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));

    passport.use('LocalLogin', new strategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            console.log("Login func.");
            User.findOne({'username': username}, function (err, user) {

                if (err)
                    return done(err); console.log(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'User not found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Wrong password! o_O'));

                return done(null, user);
            });

        }));

};