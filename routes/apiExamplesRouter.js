const express = require('express');
const path = require('path');

const apiController = require('../controllers/api');
const passportConfig = require('../config/passport');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '../uploads') });

const apiExamplesRouter = express.Router();

/**
 * API examples routes.
 */
apiExamplesRouter.get('/', apiController.getApi);
apiExamplesRouter.get('/lastfm', apiController.getLastfm);
apiExamplesRouter.get('/nyt', apiController.getNewYorkTimes);
apiExamplesRouter.get('/aviary', apiController.getAviary);
apiExamplesRouter.get('/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
apiExamplesRouter.get('/stripe', apiController.getStripe);
apiExamplesRouter.post('/stripe', apiController.postStripe);
apiExamplesRouter.get('/scraping', apiController.getScraping);
apiExamplesRouter.get('/twilio', apiController.getTwilio);
apiExamplesRouter.post('/twilio', apiController.postTwilio);
apiExamplesRouter.get('/clockwork', apiController.getClockwork);
apiExamplesRouter.post('/clockwork', apiController.postClockwork);
apiExamplesRouter.get('/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
apiExamplesRouter.get('/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
apiExamplesRouter.get('/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
apiExamplesRouter.get('/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
apiExamplesRouter.get('/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
apiExamplesRouter.post('/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
apiExamplesRouter.get('/venmo', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getVenmo);
apiExamplesRouter.post('/venmo', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postVenmo);
apiExamplesRouter.get('/linkedin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin);
apiExamplesRouter.get('/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
apiExamplesRouter.get('/yahoo', apiController.getYahoo);
apiExamplesRouter.get('/paypal', apiController.getPayPal);
apiExamplesRouter.get('/paypal/success', apiController.getPayPalSuccess);
apiExamplesRouter.get('/paypal/cancel', apiController.getPayPalCancel);
apiExamplesRouter.get('/lob', apiController.getLob);
apiExamplesRouter.get('/bitgo', apiController.getBitGo);
apiExamplesRouter.post('/bitgo', apiController.postBitGo);
apiExamplesRouter.get('/upload', apiController.getFileUpload);
apiExamplesRouter.post('/upload', upload.single('myFile'), apiController.postFileUpload);
apiExamplesRouter.get('/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
apiExamplesRouter.post('/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);

module.exports = apiExamplesRouter;
