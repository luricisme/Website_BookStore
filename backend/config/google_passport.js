const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const axios = require('axios');
const userModel = require('../models/user.model');

const https = require('https');
// Public thì bỏ đi
const agent = process.env.NODE_ENV !== 'production'
    ? new https.Agent({ rejectUnauthorized: false }) // Bỏ kiểm tra SSL khi chạy local
    : new https.Agent({ rejectUnauthorized: true });  // Luôn kiểm tra SSL khi deploy

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://website-bookstore.onrender.com/google/callback",
    passReqToCallback: true,
},
    async function (request, accessToken, refreshToken, profile, done) {
        try {
            const userByEmail = await userModel.getUserByEmail(profile.email);
            // console.log('PROFILE: ', profile);
            if (userByEmail) {
                return done(null, userByEmail);
            } else {
                const name = profile.given_name + " " + profile.family_name;
                const newUser = await userModel.createUserWithGoogle(profile.email, name, 1, profile.id)
                const email = profile.email;

                const tokenResponse = await axios.post('https://website-bank.onrender.com/request-server/generate-token', {
                    email: email
                }, { httpsAgent: agent }); // Public thì bỏ đi

                const token = tokenResponse.data.token;
                const data = { email };
                const response = await axios.post('https://website-bank.onrender.com/request-server/register', data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Thêm token vào header
                        'Content-Type': 'application/json'
                    },
                    httpsAgent: agent // Public thì bỏ đi
                });
                return done(null, newUser);
            }
        } catch (err) {
            console.error('Error during user saving process:', err);
            return done(err, null);
        }
    }));

passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(async function (email, done) {
    try {
        // Lấy lại thông tin user từ database bằng email
        const user = await userModel.getUserByEmail(email);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});