Session.setDefault("SHOP_ID",undefined);
Template.manageCollect.helpers({
	getCollect:function(){
		var shop = Session.get("SHOP_ID");
		if(shop){
			return collect.find({shop:shop});
		}else{
			return collect.find();
		}
	},
	getshopname:function(shop){
		return shops.findOne({_id:shop}).name;
	},
	getShop:function(shop){
		return shops.find();
	},
	getdate:function(timestamp){
		var date = new Date(timestamp);

	    var month = date.getMonth() + 1;
	    var day = date.getDate();
	    var hour = date.getHours();
	    var min = date.getMinutes();
	    var sec = date.getSeconds();

	    month = (month < 10 ? "0" : "") + month;
	    day = (day < 10 ? "0" : "") + day;
	    /*hour = (hour < 10 ? "0" : "") + hour;
	    min = (min < 10 ? "0" : "") + min;
	    sec = (sec < 10 ? "0" : "") + sec;*/

	    var str = date.getFullYear() + "-" + month + "-" + day;

	    return str;
	}
});

Template.updateCollect.events({
	'click #btn-update':function(e,tpl){
		e.preventDefault();
		var id = this._id;
		alert(id);
		var shop = $('#shopName').val();
		//alert(shop);
		var status = $('#status').val();
		var date = new Date();
		var timestamp = date.getTime();
		//alert(status);
		var obj ={
			shop:shop,
			order:"123456789",
			date:timestamp,
			status:status
		}
		Meteor.call("Updatecollect",id,obj,function(error){
			if(error){
				console.log("Updatecollect error"+error.reason());
			}else{
				console.log("updateCollect success");
				Router.go("/manageCollect");
			}
		})
	}
});

Template.updateCollect.helpers({
	getUpdateCollect:function(){
		return shops.find();
	},
	currentCol:function(id){
		return shops.findOne({_id:id}).name;
	}
})
Template.manageCollect.events({
	'click #remove':function(){
		var id = this._id;
		if(confirm("Are you sure want to delete this?")){
			Meteor.call("deleteCollect",id);
		}
	},
	"change #shopName":function(e){
		e.preventDefault();
		var shop = $("#shopName").val();
		if(shop == "")
			Session.set("SHOP_ID",undefined);
		else
			Session.set("SHOP_ID",shop);
			
	}
});