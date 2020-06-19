//Adding Middleware
//Adding Middleware
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt; //object
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');

// Way to add any strategic plugin we need
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

// jwt strategies
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // configure jwt strategy
opts.secretOrKey = config.secretKey; // supply strategy with key

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({ _id: jwt_payload._id }, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', { session: false });

/*
exports.verifyAdmin((req, res, next) => {
    if (req.user.admin) {
        return next();
    } else {
        const err = new Err("You are not authorized to perform this operation");
        err.status = 403;
        return next(err);
    }
});*/
exports.verifyAdmin = function (req, res, next) {
    if (req.user.admin) {
        return next();
    } else {
        const err = new Err(`You are not authorized to perform this operation`);
        err.status = 403;
        return next(err);
    }
} 