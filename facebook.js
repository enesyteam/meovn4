var passport = require('passport');
var passportFacebook = require('passport-facebook');

var FacebookStrategy = passportFacebook.Strategy;

exports.facebookAuth = function( server ) {
	const clientID = '1085772744867580';
	const clientSecret = 'ad08cb6d2d1e6cf4d463d398399ee3ee';

	function verify(accessToken, refreshToken, profile, verified) {
	    let email;
	    let avatarUrl;

	    if (profile.emails) {
	      email = profile.emails[0].value;
	    }

	    if (profile.photos && profile.photos.length > 0) {
	      avatarUrl = profile.photos[0].value;
	    }

	    try {
			var logged = { logged_in: true }
	      	verified(null, logged);
	    } catch (err) {
	      verified(err);
	      console.log(err); // eslint-disable-line
	    }
	  };

	passport.use(
	    new FacebookStrategy(
	      {
	        clientID,
	        clientSecret,
	        callbackURL: `https://www.meovnteam.com/auth/facebook/callback`,
	        profileFields: ["name", "email", "link", "locale", "timezone", "photos"],
	      },
	      verify,
	    ),
	  );

	server.use(passport.initialize());
  	server.use(passport.session());

  	server.get('/auth/facebook', (req, res, next) => {
	    const options = {
	      scope: ['email', 'manage_pages', 'user_posts', 'pages_show_list', 'publish_pages', 'read_page_mailboxes', 'business_management', 'pages_messaging', 'pages_messaging_subscriptions', 'public_profile']
	    };
	    passport.authenticate('facebook', options)(req, res, next);
	});

	server.get(
	    '/auth/facebook/callback',
	    passport.authenticate('facebook', {
	      failureRedirect: '/login',
	    }),
	    (req, res) => {
	      res.redirect('https://www.meovnteam.com/');
	    },
	);

	server.get('/logout', (req, res) => {
	    req.logout();
	    res.json({ logout: true})
	});
}