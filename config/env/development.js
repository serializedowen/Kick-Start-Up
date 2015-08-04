'use strict';

module.exports = {
	db: 'mongodb://adminkick:adminkick@ds041671.mongolab.com:41671/kickstartup',
	app: {
		title: 'Kick-Start-Up - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '491282591040878',
		clientSecret: process.env.FACEBOOK_SECRET || '293558bc25577b260f7395ee8dac4b23',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'f2b84ba6ef79d8dca01b',
		clientSecret: process.env.GITHUB_SECRET || '96b9f2815eb5ad565b19c8b7418733b4a8c2c29b',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'kickstartup1@gmail.com',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'kickstartup1',
				pass: process.env.MAILER_PASSWORD || 'csc309kickstartup'
			}
		}
	}
};
