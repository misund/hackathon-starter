const express = require('express');
const passport = require('passport');
let authRouter = express.Router();

/**
 * OAuth authentication routes. (Sign in)
 */
authRouter.get('/instagram', passport.authenticate('instagram'));
authRouter.get('/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
authRouter.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
authRouter.get('/github', passport.authenticate('github'));
authRouter.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
authRouter.get('/google', passport.authenticate('google', { scope: 'profile email' }));
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
authRouter.get('/twitter', passport.authenticate('twitter'));
authRouter.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
authRouter.get('/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
authRouter.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
authRouter.get('/foursquare', passport.authorize('foursquare'));
authRouter.get('/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/foursquare');
});
authRouter.get('/tumblr', passport.authorize('tumblr'));
authRouter.get('/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/tumblr');
});
authRouter.get('/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
authRouter.get('/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/venmo');
});
authRouter.get('/steam', passport.authorize('openid', { state: 'SOME STATE' }));
authRouter.get('/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
authRouter.get('/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
authRouter.get('/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/api/pinterest');
});

module.exports = authRouter;
