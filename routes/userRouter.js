const express = require('express');
const passport = require('passport');

const userController = require('../controllers/user');
const passportConfig = require('../config/passport');

const userRouter = express.Router();

userRouter.get('/login', userController.getLogin);
userRouter.post('/login', userController.postLogin);
userRouter.get('/logout', userController.logout);
userRouter.get('/forgot', userController.getForgot);
userRouter.post('/forgot', userController.postForgot);
userRouter.get('/reset/:token', userController.getReset);
userRouter.post('/reset/:token', userController.postReset);
userRouter.get('/signup', userController.getSignup);
userRouter.post('/signup', userController.postSignup);
userRouter.get('/account', passportConfig.isAuthenticated, userController.getAccount);
userRouter.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
userRouter.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
userRouter.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
userRouter.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

module.exports = userRouter;
