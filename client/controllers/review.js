Template.details.events({
		'submit form': function(e, tpl){
		e.preventDefault();
		var userid=Meteor.userId();
		if(userid==null){
			alert("You have to be logged to submit a review!");
			return;
		}
		var title=tpl.$("#title").val();
		var text=tpl.$("#comment").val();
		var grade=tpl.$("#sel1").val();
		$("#bt_review").click();
		Meteor.call('addReview',title,text,grade,userid,this._id);
		alert("Review added successfully!")
	}
	
});
Template.addreview.events({
	'click #bt_review': function(e,tpl){
		if(tpl.$("#add_review").css("display")=='none')
			tpl.$("#add_review").css("display","block");
		else
			tpl.$("#add_review").css("display",'none');
	}
})

Template.addreview.helpers({
	getImgUrl: function(userid){
		console.log('avatar='+userid);
		var user=users.findOne({"_id":userid});
		if(!user.hasOwnProperty('image'))
            return 'unknown.png';
		var img = images.findOne({_id:user.image});
            console.log("current img="+img);
            
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }else{
                return;
            }
	}
});


/*Template.review.helpers({
	userAvatar:function(user){
		var u=users.findOne({"_id":user});
		console.log('DJIBIMAG='+user);
		return u.image;
	},
	getUsername: function(userid){
		//Meteor.subscribe("users",userid);
		return users.findOne({_id:userid}).username;
	},
	getImgUrl: function(){
		console.log('avatar='+userid);
		var user=users.findOne({"_id":userId()});
		if(!user.hasOwnProperty('image'))
            return 'unknown.png';
		var img = images.findOne({_id:user.image});
            console.log("current img="+img);
            
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }else{
                return;
            }
	}
});*/
Template.review.helpers({
	getUsername: function(userid){
		return users.findOne({_id:userid}).emails[0].address;
	},
	getImgUrl: function(userid){
		console.log('avatar='+userid);
		var user=users.findOne({"_id":userid});
		if(!user.hasOwnProperty('image'))
            return 'unknown.png';
		var img = images.findOne({_id:user.image});
            console.log("current img="+img);
            
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }else{
                return;
            }
	}
});