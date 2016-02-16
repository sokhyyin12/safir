Template.proDiscount.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();
});
Template.proDiscount.helpers({
	getProducts:function(){
		return products.find();
	}
});
Template.proDiscount.events({
	'click #btn-save':function(e,tpl){
		e.preventDefault();
		var name = tpl.$("#name").val();
		var pro_id = Session.get("PRODUCTNAME");
		var image = Session.get('ADDIMAGEID');
		var discount = tpl.$('#pro_discount').val();
		var startDate = tpl.$('#startDate').val();
		var endDate = tpl.$('#endDate').val();
		var obj ={
			name:name,
			image:image,
			proId:pro_id,
			percentage:discount,
			startDate:startDate,
			endDate:endDate
		}
		Meteor.call("insertProDiscount",obj,function (err){
			if(err)
				console.log("Discount Error: "+err.reason);
			else 
				console.log("Success!!!");
		});
	},
	'change #image': function(event, template) {
		event.preventDefault();
		var files = event.target.files;
		for (var i = 0, ln = files.length; i < ln; i++) {
			images.insert(files[i], function (err, fileObj) {
				console.log('inserted image: '+fileObj);
				console.log('error:'+JSON.stringify(err));
				Session.set('ADDIMAGEID', fileObj._id);
			});
		}
	},
	'change #product_name':function(e){
		e.preventDefault();
		var pro_name = $('#product_name').val();
		Session.set("PRODUCTNAME",pro_name);
	},
	getImage: function(id){
            var img = images.findOne({_id:id});
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }
            else{
                return;
            }
    }
});
Template.manageDiscount.helpers({
	getDiscount:function(){
		return discount.find();
	},
	getImage: function(id){
            var img = images.findOne({_id:id});
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }
            else{
                return;
            }
    }

});
Template.manageDiscount.events({
	'click #remove':function(){
		var id = this._id;
		alert("my id here:"+id);
		Meteor.call("deletediscount",id);

	}
});
//=============================update Product discount=============
Template.updateProDiscount.helpers({
	getProducts:function(){
		return products.find();
	},
	currentPro:function(id){
		return products.findOne({_id:id}).title;
	}
});
Template.updateProDiscount.events({
	'click #btn-update':function(e,tpl){
		e.preventDefault();
		var name = tpl.$("#name").val();
		var pro_id = Session.get("PRODUCTNAME");
		var image = Session.get('ADDIMAGEID');
		var discount = tpl.$('#pro_discount').val();
		var startDate = tpl.$('#startDate').val();
		var endDate = tpl.$('#endDate').val();
		var obj ={
			name:name,
			image:image,
			proId:pro_id,
			percentage:discount,
			startDate:startDate,
			endDate:endDate
		}
		Meteor.call("insertProDiscount",obj,function (err){
			if(err)
				console.log("Discount Error: "+err.reason);
			else 
				console.log("Success!!!");
		});
	},
	'change #image': function(event, template) {
		event.preventDefault();
		var files = event.target.files;
		for (var i = 0, ln = files.length; i < ln; i++) {
			images.insert(files[i], function (err, fileObj) {
				console.log('inserted image: '+fileObj);
				console.log('error:'+JSON.stringify(err));
				Session.set('ADDIMAGEID', fileObj._id);
			});
		}
	},
	'change #product_name':function(e){
		e.preventDefault();
		var pro_name = $('#product_name').val();
		Session.set("PRODUCTNAME",pro_name);
	},
	getImage: function(id){
            var img = images.findOne({_id:id});
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }
            else{
                return;
            }
    }
});
Template.updateProDiscount.helpers({
	getDiscount:function(){
		return discount.find();
	},
	getImage: function(id){
            var img = images.findOne({_id:id});
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }
            else{
                return;
            }
    }

});