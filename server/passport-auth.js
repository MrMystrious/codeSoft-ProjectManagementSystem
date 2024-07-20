const passport = require('passport')
const GoogleStrategy =  require('passport-google-oauth20').Strategy
const keys = require('./keys')
const DataBase = require('./dataBase')

const db = new DataBase()
/* db.Delete('users',{id:'108850124579563687250'}) */

const verifyCallback = async (accessToken, refreshToken, profile, done) => {
   const user = {profile,accessToken,refreshToken}
    return done(null,user)
};   


passport.use(
    new GoogleStrategy({
    clientID:keys.google.client_id,
    clientSecret:keys.google.client_secret,
    callbackURL: keys.google.redirect_uris[0] 
},verifyCallback)) 

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

