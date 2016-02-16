Template.loginsocial.events({
	'click #twitter-login': function(event) {
		Meteor.loginWithTwitter({}, function(err) {
			if (err) {
				throw new Meteor.Error("Twitter login failed");
			}
		});
	},
	'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({}, function(err) {
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
        });
    },
	'click #google-login': function(event) {
        Meteor.loginWithGoogle({}, function(err) {
            if (err) {
                throw new Meteor.Error("Google login failed");
            }
        });
    },
	'click #insta-login': function(event) {
        Meteor.loginWithInstagram({}, function(err) {
            if (err) {
                throw new Meteor.Error("Instagram login failed");
            }
        });
    },
	'click #logout': function(event) {
		Meteor.logout(function(err) {
			if (err) {
				throw new Meteor.Error("Logout failed");
			}
		})
	}
});