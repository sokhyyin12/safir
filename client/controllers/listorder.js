Template.listorder.helpers({
	getOrder:function(){
		return order.find({},{sort: {total:-1}});
	},
	getUserorderName:function(userId){
		var result = users.findOne({_id:userId});
		return result.profile.firstname+" "+result.profile.lastname;
		
	}
});
Template.listorder.events({
	"change .status":function(e,tpl){
		e.preventDefault();
		var id = this._id;
		var status = $(e.currentTarget).val();
		var obj ={
			status:status
		}
		//alert('status '+status);
		Meteor.call('update',id,obj);
	}
});
Template.listitem.helpers({
	getItem:function(){
		return order.find();
	},
	getItemProduct:function(id_product){
		var result= products.findOne({_id:id_product});
		//console.log("tile pro "+result.title)
		return result.title;
	}
});
Template.orderItem.helpers({
	getItem:function(){
		return order.find();
	},
	getItemProduct:function(id_product){
		var result= products.findOne({_id:id_product});
		//console.log("tile pro "+result.title)
		return result.title;
	},
	getUserorderName:function(userId){
		var result = users.findOne({_id:userId});
		return result.profile.firstname+" "+result.profile.lastname;
		
	}
});
Template.orderItemShop.helpers({
	// getOrderByShop:function(){
	// 	return order.find({});
	// },
	getOrderShop:function(){
		var result = shops.find({});
		return result;
	},
	getItemProNames:function(id_product){
		var result= products.findOne({_id:id_product});
		return result.title;
	},
	getNameShop:function(){
		var shopId = Session.get('GETSHOPNAME');
		var re = order.find({shop:shopId});
		return re;
	},
	getItemOrder:function(){
		var shopId = Session.get("GETSHOPNAME");
		var ord = order.find();
		var arr = [];
		if(shopId){
			ord.forEach(function(i){
	    		i.items.forEach(function(it){
					if(it.shop == shopId){
						arr.push(it);
					}
				});
			});
		}else{
			ord.forEach(function(j){
	    		j.items.forEach(function(it){
						arr.push(it);
				});
			});
		}
		return arr;	
	}
});
Template.orderItemShop.events({
	'change .shop':function(e){
		e.preventDefault();
		var shop = $(e.currentTarget).val();
		Session.set("GETSHOPNAME", shop);
	}
});