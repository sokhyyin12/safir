Meteor.methods({
	removeTracking:function(id){
		tracking.remove(id);
	}
});