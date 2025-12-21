const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({
        where: { email: profile.emails[0].value }
      });

      if (user) {
        // Update auth provider info
        const providers = user.authProviders || [];
        const googleProvider = providers.find(p => p.provider === 'google');
        
        if (!googleProvider) {
          providers.push({
            provider: 'google',
            providerId: profile.id,
            lastUsed: new Date()
          });
          await user.update({ 
            authProviders: providers,
            lastLogin: new Date()
          });
        } else {
          googleProvider.lastUsed = new Date();
          await user.update({ 
            authProviders: providers,
            lastLogin: new Date()
          });
        }
      } else {
        // Create new user (student role by default)
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          roles: ['student'],
          authProviders: [{
            provider: 'google',
            providerId: profile.id,
            lastUsed: new Date()
          }],
          lastLogin: new Date(),
          isActive: true
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({
        where: { email: profile.emails[0].value }
      });

      if (user) {
        // Update auth provider info
        const providers = user.authProviders || [];
        const facebookProvider = providers.find(p => p.provider === 'facebook');
        
        if (!facebookProvider) {
          providers.push({
            provider: 'facebook',
            providerId: profile.id,
            lastUsed: new Date()
          });
          await user.update({ 
            authProviders: providers,
            lastLogin: new Date()
          });
        } else {
          facebookProvider.lastUsed = new Date();
          await user.update({ 
            authProviders: providers,
            lastLogin: new Date()
          });
        }
      } else {
        // Create new user (student role by default)
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          roles: ['student'],
          authProviders: [{
            provider: 'facebook',
            providerId: profile.id,
            lastUsed: new Date()
          }],
          lastLogin: new Date(),
          isActive: true
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
