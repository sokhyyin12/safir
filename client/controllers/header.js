Template.header.helpers({
	getCart: function(){
		mycart = cart.find({userId:Session.get('userId')}).count();
		return mycart;
	}
});