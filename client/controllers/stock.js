Template.stock.helpers({
	listsStock:function(){
		
		return stock.find({},{limit:10});
	},
	loadMore:function(){
		var result = stock.find({},{limit:Session.get("limitTracking")});
		return result;
	},
	listShopname:function(){
		return shops.find({});
	},
	listBarcode:function(){
		return barcode.find({});
	},
	getAllStock:function(){
		var storeName = Session.get('storeName');
		var barcode = Session.get('RetailBarcode');
		var getStock = stock.find({$and: [{RetailStoreName:storeName},{Barcode:barcode}]});

		return getStock;
	}
});

Session.set('limitTracking',10);
var processScroll = true;
$(window).scroll(function() {
    if (processScroll  && $(window).scrollTop() > $(document).height() - $(window).height() - 100) {
        processScroll = false;
            var oldLimit=Session.get('limitTracking');
            oldLimit+=10;
            Session.set('limitTracking',oldLimit);
        processScroll = true;
    }
});
Template.stock.events({
	'change #shopname':function(event){
		event.preventDefault();
		var name = $('#shopname').val();
		Session.set('storeName',name);
		$('.listStore').css("display","block");
		$('.listAllstore').css("display","none");
	},
	'change #barcode':function(event){
		event.preventDefault();
		var barcode = $('#barcode').val();
		Session.set('RetailBarcode',barcode);
		$('.listStore').css("display","block");
		$('.listAllstore').css("display","none");
	}
});