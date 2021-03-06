const _ = require('lodash');
const async = require('async');

/**
 * Split into declaration and initialization for better startup performance.
 */
let validator;
let cheerio;
let graph;
let LastFmNode;
let tumblr;
let foursquare;
let Github;
let Twit;
let stripe;
let twilio;
let Linkedin;
let BitGo;
let clockwork;
let paypal;
let lob;
let ig;
let Y;
let request;

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/foursquare
 * Foursquare API example.
 */
exports.getFoursquare = (req, res, next) => {
  foursquare = require('node-foursquare')({
    secrets: {
      clientId: process.env.FOURSQUARE_ID,
      clientSecret: process.env.FOURSQUARE_SECRET,
      redirectUrl: process.env.FOURSQUARE_REDIRECT_URL
    }
  });

  const token = _.find(req.user.tokens, { kind: 'foursquare' });
  async.parallel({
    trendingVenues: (callback) => {
      foursquare.Venues.getTrending('40.7222756', '-74.0022724', { limit: 50 }, token.accessToken, (err, results) => {
        callback(err, results);
      });
    },
    venueDetail: (callback) => {
      foursquare.Venues.getVenue('49da74aef964a5208b5e1fe3', token.accessToken, (err, results) => {
        callback(err, results);
      });
    },
    userCheckins: (callback) => {
      foursquare.Users.getCheckins('self', null, token.accessToken, (err, results) => {
        callback(err, results);
      });
    }
  },
  (err, results) => {
    if (err) {
      return next(err);
    }
    res.render('api/foursquare', {
      title: 'Foursquare API',
      trendingVenues: results.trendingVenues,
      venueDetail: results.venueDetail,
      userCheckins: results.userCheckins
    });
  });
};

/**
 * GET /api/tumblr
 * Tumblr API example.
 */
exports.getTumblr = (req, res, next) => {
  tumblr = require('tumblr.js');

  const token = _.find(req.user.tokens, { kind: 'tumblr' });
  let client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_KEY,
    consumer_secret: process.env.TUMBLR_SECRET,
    token: token.accessToken,
    token_secret: token.tokenSecret
  });
  client.posts('mmosdotcom.tumblr.com', { type: 'photo' }, (err, data) => {
    if (err) {
      return next(err);
    }
    res.render('api/tumblr', {
      title: 'Tumblr API',
      blog: data.blog,
      photoset: data.posts[0].photos
    });
  });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
exports.getFacebook = (req, res, next) => {
  graph = require('fbgraph');

  const token = _.find(req.user.tokens, { kind: 'facebook' });
  graph.setAccessToken(token.accessToken);
  async.parallel({
    getMe: (done) => {
      graph.get(req.user.facebook + "?fields=id,name,email,first_name,last_name,gender,link,locale,timezone", (err, me) => {
        done(err, me);
      });
    },
    getMyFriends: (done) => {
      graph.get(req.user.facebook + '/friends', (err, friends) => {
        done(err, friends.data);
      });
    }
  },
  (err, results) => {
    if (err) {
      return next(err);
    }
    res.render('api/facebook', {
      title: 'Facebook API',
      me: results.getMe,
      friends: results.getMyFriends
    });
  });
};

/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = (req, res, next) => {
  cheerio = require('cheerio');
  request = require('request');

  request.get('https://news.ycombinator.com/', (err, request, body) => {
    const $ = cheerio.load(body);
    let links = [];
    $('.title a[href^="http"], a[href^="https"]').each( () => {
      links.push($(this));
    });
    res.render('api/scraping', {
      title: 'Web Scraping',
      links: links
    });
  });
};

/**
 * GET /api/github
 * GitHub API Example.
 */
exports.getGithub = (req, res, next) => {
  Github = require('github-api');

  const token = _.find(req.user.tokens, { kind: 'github' });
  const github = new Github({ token: token.accessToken });
  const repo = github.getRepo('sahat', 'requirejs-library');
  repo.show( (err, repo) => {
    if (err) {
      return next(err);
    }
    res.render('api/github', {
      title: 'GitHub API',
      repo: repo
    });
  });

};

/**
 * GET /api/aviary
 * Aviary image processing example.
 */
exports.getAviary = (req, res) => {
  res.render('api/aviary', {
    title: 'Aviary API'
  });
};

/**
 * GET /api/nyt
 * New York Times API example.
 */
exports.getNewYorkTimes = (req, res, next) => {
  request = require('request');

  const query = {
    'list-name': 'young-adult',
    'api-key': process.env.NYT_KEY
  };

  request.get({ url: 'http://api.nytimes.com/svc/books/v2/lists', qs: query }, (err, request, body) => {
    if (request.statusCode === 403) {
      return next(new Error('Invalid New York Times API Key'));
    }
    const bestsellers = JSON.parse(body);
    res.render('api/nyt', {
      title: 'New York Times API',
      books: bestsellers.results
    });
  });
};

/**
 * GET /api/lastfm
 * Last.fm API example.
 */
exports.getLastfm = (req, res, next) => {
  request = require('request');
  LastFmNode = require('lastfm').LastFmNode;

  const lastfm = new LastFmNode({
    api_key: process.env.LASTFM_KEY,
    secret: process.env.LASTFM_SECRET
  });

  async.parallel({
    artistInfo: (done) => {
      lastfm.request('artist.getInfo', {
        artist: 'The Pierces',
        handlers: {
          success: (data) => {
            done(null, data);
          },
          error: (err) => {
            done(err);
          }
        }
      });
    },
    artistTopTracks: (done) => {
      lastfm.request('artist.getTopTracks', {
        artist: 'The Pierces',
        handlers: {
          success: (data) => {
            let tracks = [];
            _.each(data.toptracks.track, (track) => {
              tracks.push(track);
            });
            done(null, tracks.slice(0,10));
          },
          error: (err) => {
            done(err);
          }
        }
      });
    },
    artistTopAlbums: (done) => {
      lastfm.request('artist.getTopAlbums', {
        artist: 'The Pierces',
        handlers: {
          success: (data) => {
            let albums = [];
            _.each(data.topalbums.album, (album) => {
              albums.push(album.image.slice(-1)[0]['#text']);
            });
            done(null, albums.slice(0, 4));
          },
          error: (err) => {
            done(err);
          }
        }
      });
    }
  },
  (err, results) => {
    if (err) {
      return next(err.message);
    }
    const artist = {
      name: results.artistInfo.artist.name,
      image: results.artistInfo.artist.image.slice(-1)[0]['#text'],
      tags: results.artistInfo.artist.tags.tag,
      bio: results.artistInfo.artist.bio.summary,
      stats: results.artistInfo.artist.stats,
      similar: results.artistInfo.artist.similar.artist,
      topAlbums: results.artistTopAlbums,
      topTracks: results.artistTopTracks
    };
    res.render('api/lastfm', {
      title: 'Last.fm API',
      artist: artist
    });
  });
};

/**
 * GET /api/twitter
 * Twiter API example.
 */
exports.getTwitter = (req, res, next) => {
  Twit = require('twit');

  const token = _.find(req.user.tokens, { kind: 'twitter' });
  const T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.get('search/tweets', { q: 'nodejs since:2013-01-01', geocode: '40.71448,-74.00598,5mi', count: 10 }, (err, reply) => {
    if (err) {
      return next(err);
    }
    res.render('api/twitter', {
      title: 'Twitter API',
      tweets: reply.statuses
    });
  });
};

/**
 * POST /api/twitter
 * Post a tweet.
 */
exports.postTwitter = (req, res, next) => {
  req.assert('tweet', 'Tweet cannot be empty.').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/twitter');
  }

  const token = _.find(req.user.tokens, { kind: 'twitter' });
  const T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.post('statuses/update', { status: req.body.tweet }, (err, data, response) => {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Tweet has been posted.'});
    res.redirect('/api/twitter');
  });
};

/**
 * GET /api/steam
 * Steam API example.
 */
exports.getSteam = (req, res, next) => {
  request = require('request');

  const steamId = '76561197982488301';
  const params = { l: 'english', steamid: steamId, key: process.env.STEAM_KEY };

  async.parallel({
    playerAchievements: (done) => {
      params.appid = '49520';
      request.get({ url: 'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/', qs: params, json: true }, (err, request, body) => {
        if (request.statusCode === 401) {
          return done(new Error('Invalid Steam API Key'));
        }
        done(err, body);
      });
    },
    playerSummaries: (done) => {
      params.steamids = steamId;
      request.get({ url: 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/', qs: params, json: true }, (err, request, body) => {
        if (request.statusCode === 401) {
          return done(new Error('Missing or Invalid Steam API Key'));
        }
        done(err, body);
      });
    },
    ownedGames: (done) => {
      params.include_appinfo = 1;
      params.include_played_free_games = 1;
      request.get({ url: 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', qs: params, json: true }, (err, request, body) => {
        if (request.statusCode === 401) {
          return done(new Error('Missing or Invalid Steam API Key'));
        }
        done(err, body);
      });
    }
  },
  (err, results) => {
    if (err) {
      return next(err);
    }
    res.render('api/steam', {
      title: 'Steam Web API',
      ownedGames: results.ownedGames.response.games,
      playerAchievemments: results.playerAchievements.playerstats,
      playerSummary: results.playerSummaries.response.players[0]
    });
  });
};

/**
 * GET /api/stripe
 * Stripe API example.
 */
exports.getStripe = (req, res) => {
  stripe = require('stripe')(process.env.STRIPE_SKEY);

  res.render('api/stripe', {
    title: 'Stripe API',
    publishableKey: process.env.STRIPE_PKEY
  });
};

/**
 * POST /api/stripe
 * Make a payment.
 */
exports.postStripe = (req, res, next) => {
  const stripeToken = req.body.stripeToken;
  const stripeEmail = req.body.stripeEmail;
  stripe.charges.create({
    amount: 395,
    currency: 'usd',
    source: stripeToken,
    description: stripeEmail
  }, (err, charge) => {
    if (err && err.type === 'StripeCardError') {
      req.flash('errors', { msg: 'Your card has been declined.' });
      return res.redirect('/api/stripe');
    }
    req.flash('success', { msg: 'Your card has been charged successfully.' });
    res.redirect('/api/stripe');
  });
};

/**
 * GET /api/twilio
 * Twilio API example.
 */
exports.getTwilio = (req, res) => {
  twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

  res.render('api/twilio', {
    title: 'Twilio API'
  });
};

/**
 * POST /api/twilio
 * Send a text message using Twilio.
 */
exports.postTwilio = (req, res, next) => {
  req.assert('number', 'Phone number is required.').notEmpty();
  req.assert('message', 'Message cannot be blank.').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/twilio');
  }

  const message = {
    to: req.body.number,
    from: '+13472235148',
    body: req.body.message
  };
  twilio.sendMessage(message, (err, responseData) => {
    if (err) {
      return next(err.message);
    }
    req.flash('success', { msg: 'Text sent to ' + responseData.to + '.'});
    res.redirect('/api/twilio');
  });
};

/**
 * GET /api/clockwork
 * Clockwork SMS API example.
 */
exports.getClockwork = (req, res) => {
  clockwork = require('clockwork')({ key: process.env.CLOCKWORK_KEY });

  res.render('api/clockwork', {
    title: 'Clockwork SMS API'
  });
};

/**
 * POST /api/clockwork
 * Send a text message using Clockwork SMS
 */
exports.postClockwork = (req, res, next) => {
  const message = {
    To: req.body.telephone,
    From: 'Hackathon',
    Content: 'Hello from the Hackathon Starter'
  };
  clockwork.sendSms(message, (err, responseData) => {
    if (err) {
      return next(err.errDesc);
    }
    req.flash('success', { msg: 'Text sent to ' + responseData.responses[0].to });
    res.redirect('/api/clockwork');
  });
};

/**
 * GET /api/venmo
 * Venmo API example.
 */
exports.getVenmo = (req, res, next) => {
  request = require('request');

  const token = _.find(req.user.tokens, { kind: 'venmo' });
  const query = { access_token: token.accessToken };

  async.parallel({
    getProfile: (done) => {
      request.get({ url: 'https://api.venmo.com/v1/me', qs: query, json: true }, (err, request, body) => {
        done(err, body);
      });
    },
    getRecentPayments: (done) => {
      request.get({ url: 'https://api.venmo.com/v1/payments', qs: query, json: true }, (err, request, body) => {
        done(err, body);
      });
    }
  },
  (err, results) => {
    if (err) {
      return next(err);
    }
    res.render('api/venmo', {
      title: 'Venmo API',
      profile: results.getProfile.data,
      recentPayments: results.getRecentPayments.data
    });
  });
};

/**
 * POST /api/venmo
 * Send money.
 */
exports.postVenmo = (req, res, next) => {
  validator = require('validator');

  req.assert('user', 'Phone, Email or Venmo User ID cannot be blank').notEmpty();
  req.assert('note', 'Please enter a message to accompany the payment').notEmpty();
  req.assert('amount', 'The amount you want to pay cannot be blank').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/venmo');
  }

  const token = _.find(req.user.tokens, { kind: 'venmo' });
  const formData = {
    access_token: token.accessToken,
    note: req.body.note,
    amount: req.body.amount
  };
  if (validator.isEmail(req.body.user)) {
    formData.email = req.body.user;
  } else if (validator.isNumeric(req.body.user) && validator.isLength(req.body.user, 10, 11)) {
    formData.phone = req.body.user;
  } else {
    formData.user_id = req.body.user;
  }
  request.post('https://api.venmo.com/v1/payments', { form: formData }, (err, request, body) => {
    if (err) {
      return next(err);
    }
    if (request.statusCode !== 200) {
      req.flash('errors', { msg: JSON.parse(body).error.message });
      return res.redirect('/api/venmo');
    }
    req.flash('success', { msg: 'Venmo money transfer complete' });
    res.redirect('/api/venmo');
  });
};

/**
 * GET /api/linkedin
 * LinkedIn API example.
 */
exports.getLinkedin = (req, res, next) => {
  Linkedin = require('node-linkedin')(process.env.LINKEDIN_ID, process.env.LINKEDIN_SECRET, process.env.LINKEDIN_CALLBACK_URL);

  const token = _.find(req.user.tokens, { kind: 'linkedin' });
  const linkedin = Linkedin.init(token.accessToken);
  linkedin.people.me((err, $in) => {
    if (err) {
      return next(err);
    }
    res.render('api/linkedin', {
      title: 'LinkedIn API',
      profile: $in
    });
  });
};

/**
 * GET /api/instagram
 * Instagram API example.
 */
exports.getInstagram = (req, res, next) => {
  ig = require('instagram-node').instagram();

  const token = _.find(req.user.tokens, { kind: 'instagram' });
  ig.use({ client_id: process.env.INSTAGRAM_ID, client_secret: process.env.INSTAGRAM_SECRET });
  ig.use({ access_token: token.accessToken });
  async.parallel({
    searchByUsername: (done) => {
      ig.user_search('richellemead', (err, users, limit) => {
        done(err, users);
      });
    },
    searchByUserId: (done) => {
      ig.user('175948269', (err, user) => {
        done(err, user);
      });
    },
    popularImages: (done) => {
      ig.media_popular( (err, medias) => {
        done(err, medias);
      });
    },
    myRecentMedia: function(done) {
      ig.user_self_media_recent(function(err, medias, pagination, limit) {
        done(err, medias);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('api/instagram', {
      title: 'Instagram API',
      usernames: results.searchByUsername,
      userById: results.searchByUserId,
      popularImages: results.popularImages,
      myRecentMedia: results.myRecentMedia
    });
  });
};

/**
 * GET /api/yahoo
 * Yahoo API example.
 */
exports.getYahoo = function(req, res) {
  Y = require('yui/yql');

  async.parallel([
    function getFinanceStocks(done) {
      Y.YQL('SELECT * FROM yahoo.finance.quote WHERE symbol in ("YHOO", "TSLA", "GOOG", "MSFT")', function(response) {
        const quotes = response.query.results.quote;
        done(null, quotes);
      });
    },
    function getWeatherReport(done) {
      Y.YQL('SELECT * FROM weather.forecast WHERE (location = 10007)', function(response) {
        const location = response.query.results.channel.location;
        const condition = response.query.results.channel.item.condition;
        done(null, { location: location, condition: condition });
      });
    }
  ], function(err, results) {
    const quotes = results[0];
    const weather = results[1];

    res.render('api/yahoo', {
      title: 'Yahoo API',
      quotes: quotes,
      location: weather.location,
      condition: weather.condition
    });
  });
};

/**
 * GET /api/paypal
 * PayPal SDK example.
 */
exports.getPayPal = function(req, res, next) {
  paypal = require('paypal-rest-sdk');

  paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_ID,
    client_secret: process.env.PAYPAL_SECRET
  });

  const paymentDetails = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: '/api/paypal/success',
      cancel_url: '/api/paypal/cancel'
    },
    transactions: [{
      description: 'Hackathon Starter',
      amount: {
        currency: 'USD',
        total: '1.99'
      }
    }]
  };

  paypal.payment.create(paymentDetails, function(err, payment) {
    if (err) {
      return next(err);
    }
    req.session.paymentId = payment.id;
    const links = payment.links;
    for (let i = 0; i < links.length; i++) {
      if (links[i].rel === 'approval_url') {
        res.render('api/paypal', {
          approvalUrl: links[i].href
        });
      }
    }
  });
};

/**
 * GET /api/paypal/success
 * PayPal SDK example.
 */
exports.getPayPalSuccess = function(req, res) {
  const paymentId = req.session.paymentId;
  const paymentDetails = { payer_id: req.query.PayerID };
  paypal.payment.execute(paymentId, paymentDetails, function(err) {
    if (err) {
      res.render('api/paypal', {
        result: true,
        success: false
      });
    } else {
      res.render('api/paypal', {
        result: true,
        success: true
      });
    }
  });
};

/**
 * GET /api/paypal/cancel
 * PayPal SDK example.
 */
exports.getPayPalCancel = function(req, res) {
  req.session.paymentId = null;
  res.render('api/paypal', {
    result: true,
    canceled: true
  });
};

/**
 * GET /api/lob
 * Lob API example.
 */
exports.getLob = function(req, res, next) {
  lob = require('lob')(process.env.LOB_KEY);

  lob.routes.list({
    zip_codes: ['10007']
  }, function(err, routes) {
    if(err) {
      return next(err);
    }
    res.render('api/lob', {
      title: 'Lob API',
      routes: routes.data[0].routes
    });
  });
};

/**
 * GET /api/bitgo
 * BitGo wallet example
 */
exports.getBitGo = function(req, res, next) {
  BitGo = require('bitgo');

  const bitgo = new BitGo.BitGo({ env: 'test', accessToken: process.env.BITGO_ACCESS_TOKEN });
  const walletId = req.session.walletId;

  const renderWalletInfo = function(walletId) {
    bitgo.wallets().get({ id: walletId }, function(err, walletResponse) {
      walletResponse.createAddress({}, function(err, addressResponse) {
        walletResponse.transactions({}, function(err, transactionsResponse) {
          res.render('api/bitgo', {
            title: 'BitGo API',
            wallet: walletResponse.wallet,
            address: addressResponse.address,
            transactions: transactionsResponse.transactions
          });
        });
      });
    });
  };

  if (walletId) {
    renderWalletInfo(walletId);
  } else {
    bitgo.wallets().createWalletWithKeychains({
        passphrase: req.sessionID, // change this!
        label: 'wallet for session ' + req.sessionID,
        backupXpub: 'xpub6AHA9hZDN11k2ijHMeS5QqHx2KP9aMBRhTDqANMnwVtdyw2TDYRmF8PjpvwUFcL1Et8Hj59S3gTSMcUQ5gAqTz3Wd8EsMTmF3DChhqPQBnU'
      }, function(err, res) {
        req.session.walletId = res.wallet.wallet.id;
        renderWalletInfo(req.session.walletId);
      }
    );
  }
};

/**
 * POST /api/bitgo
 * BitGo send coins example
 */
exports.postBitGo = function(req, res, next) {
  const bitgo = new BitGo.BitGo({ env: 'test', accessToken: process.env.BITGO_ACCESS_TOKEN });
  const walletId = req.session.walletId;

  try {
    bitgo.wallets().get({ id: walletId }, function(err, wallet) {
      wallet.sendCoins({
        address: req.body.address,
        amount: parseInt(req.body.amount),
        walletPassphrase: req.sessionID
      }, function(err, result) {
        if (err) {
          req.flash('errors', { msg: err.message });
          return res.redirect('/api/bitgo');
        }
        req.flash('info', { msg: 'txid: ' + result.hash + ', hex: ' + result.tx });
        return res.redirect('/api/bitgo');
      });
    });
  } catch (err) {
    req.flash('errors', { msg: err.message });
    return res.redirect('/api/bitgo');
  }
};

exports.getFileUpload = function(req, res, next) {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = function(req, res, next) {
  req.flash('success', { msg: 'File was uploaded successfully.'});
  res.redirect('/api/upload');
};

/**
 * GET /api/pinterest
 * Pinterest API example.
 */
exports.getPinterest = function(req, res, next) {
  request = require('request');

  const token = _.find(req.user.tokens, { kind: 'pinterest' });
  request.get({ url: 'https://api.pinterest.com/v1/me/boards/', qs: { access_token: token.accessToken }, json: true }, function(err, request, body) {
    if (err) {
      return next(err);
    }

    res.render('api/pinterest', {
      title: 'Pinterest API',
      boards: body.data
    });
  });
};

/**
 * POST /api/pinterest
 * Create a pin.
 */
exports.postPinterest = function(req, res, next) {
  req.assert('board', 'Board is required.').notEmpty();
  req.assert('note', 'Note cannot be blank.').notEmpty();
  req.assert('image_url', 'Image URL cannot be blank.').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/pinterest');
  }

  request = require('request');

  const token = _.find(req.user.tokens, { kind: 'pinterest' });
  const formData = {
    board: req.body.board,
    note: req.body.note,
    link: req.body.link,
    image_url: req.body.image_url
  };
  request.post('https://api.pinterest.com/v1/pins/', { qs: { access_token: token.accessToken }, form: formData }, function(err, request, body) {
    if (err) {
      return next(err);
    }
    if (request.statusCode !== 201) {
      req.flash('errors', { msg: JSON.parse(body).message });
      return res.redirect('/api/pinterest');
    }
    req.flash('success', { msg: 'Pin created' });
    res.redirect('/api/pinterest');
  });
};
