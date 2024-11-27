const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./app/models/user"); 

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/auth/google/callback",
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            // Lakukan pencarian user berdasarkan Google ID
            try {
                let user = await User.getByEmail(profile.emails[0].value);
                if (!user) {
                    // Jika user belum ada, buat user baru dengan data dari profil Google
                    user = await User.create({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize dan deserialize user ke dalam session
passport.serializeUser((user, done) => {
    done(null, user.user_id); 
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.getById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
