Session.set('children1','');
Session.set('children2','');
Session.set('selected_menu','');
Template.header.helpers({
	getParent: function(){
		return categories.find({"$or":[{"parent":"0"},{"parent":" "}]}).map(function(document, index) {
            document.index = index + 1;
            return document;
        });
	},
	getChildren: function(parent){
		return categories.find({"parent":parent}).map(function(document, index) {
            document.index = index + 1;
            return document;
        });
	},
	changeLanguage: function(){
		if(TAPi18n.getLanguage()=='fa')
			return 'English';
		if(TAPi18n.getLanguage()=='en')
			return 'فارسی';
	}
});
Template.header.onRendered(function () {


		
  
  var userId = Meteor.userId();
  var time = Date.now();
  var currenturl = window.location.href;
  if( !Session.get('userId') || Session.get('userId') == ""){
         			var newId=Random.id();
         			Session.setPersistent('userId',newId);
         			console.log('Newid'+newId);
  }
  console.log('MY CART USER ID='+Session.get('userId'));
  //alert(currentPage);
	//Meteor.call('getMonIp',userId,time,currenturl);
	//alert('inserted');
});
Template.footer.events({
	'mouseenter #footer':function(e){
		e.preventDefault();
		//alert("hi");
		var userId = Meteor.userId();
		var time = Date.now();
		var currenturl = window.location.href
		var location = 'Footer';
		//alert(currenturl);
		//Meteor.call('getfooter',userId,time,location, currenturl);
		//alert('footer');
	}
});
Template.header.events({
	'mouseenter #header':function(e){
		e.preventDefault();
		//alert("hi");
		var userId = Meteor.userId();
		var time = Date.now();
		var currenturl = window.location.href
		var location = 'Header';
		//alert(currenturl);
		//Meteor.call('getheader',userId,time,location,currenturl);
		//alert('header');
	}
});
Template.mainLayout.events({
	'mouseenter #mainContent':function(e){
		e.preventDefault();
		var userId = Meteor.userId();
		var time = Date.now();
		var currenturl = window.location.href
		var location = 'Content';
		//alert(currenturl);
		//Meteor.call('contenttrack',userId,time,location,currenturl);
		//alert('contenttrack');
	}
});


Template.header.events({
	'click #en':function(e,tpl){
		//alert(TAPi18n.getLanguage());
		if(TAPi18n.getLanguage()=='fa'){			
			$("body").css("font-family","HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, sans-serif");
			var lang='en';
		}
		else{			
			$('body').css('font-family','Nazanin Bold');
			var lang='fa';
		}
			
		
		TAPi18n.setLanguage(lang)
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });

	},
	'mouseover #child1': function(e,tpl){
		tpl.$(".list").html('');
		tpl.$(".num2").html('');
		var catId=this._id;
		
		var list=categories.find({"parent":catId}).fetch();
		console.log('length1: '+list.length);
		for(var i=0;i<list.length;i++)
			tpl.$(".num2").append('<li><a href="/category/'+list[i]._id+'" id="child2" data-id="'+list[i]._id+'">'+list[i].title+'</a></li>');
		
		
	},
	'mouseover .biglink': function(e,tpl){
		//$('.biglink').removeClass('selected_item');
		/*var current=$(e.currentTarget).attr('id');
		current='#'+current;
		Session.set('selected_menu',current);
		console.log('setting selected item= '+current);
	},
	'mouseover #back': function(e,tpl){
		/*console.log('event mouseover');
		var current=Session.get('selected_menu');
		if(current!=''){
			if($(current).attr('class').indexOf('selected_item')==-1)
				$(current).addClass('selected_item');
		}*/
	},
	'mouseleave #back': function(e,tpl){
		/*console.log('event mouse leave');
		var current=Session.get('selected_menu');
		if(current!=''){
			if($(current).attr('class').indexOf('selected_item')!=-1)
				$(current).removeClass('selected_item');
			Session.set('selected_menu','');
		}*/
		/*console.log('event mouse leave');
		Session.set('selected_menu','none');
		console.log('session: '+Session.get('selected_menu'));
		$("li").removeClass('selected_item');*/
	},
	'mouseover #child2': function(e,tpl){
		tpl.$(".list").html('');
		//tpl.$(".num2").html('');
		var catId=e.currentTarget.getAttribute('data-id');;
		var list=categories.find({"parent":catId}).fetch();
		console.log('length2: '+list.length);
		for(var i=0;i<list.length;i++)
			tpl.$(".list").append('<li><a href="/category/'+list[i]._id+'" id="child3" data-id="'+list[i]._id+'">'+list[i].title+'</a></li>');
		console.log("hover!!!!! "+this.title);
	},
	'mouseleave #staticmenu': function(e,tpl){
		console.log('resetting menu!');
		tpl.$(".list").html('');
		tpl.$(".num2").html('');
	},
	'mouseover .megamenu_drop1': function(e,tpl){
		console.log('resetting BIG menu!');
		tpl.$(".list").html('');
		tpl.$(".num2").html('');
	},
	'click .kesearch': function(e,tpl){
		var search=tpl.$("#textToSearch").val();
		Session.set('keyword',search);
		var url="/searchproduct"+"/"+search;
		Router.go(url);
		//var listProducts=products.find({"title":{"$regex": search}});
		 // if (Router.current().route.getName() == "search") { // new
   //      products.update(t.data._id, {$set: search});
   //      Router.go('/properties/' + t.data._id);
   //  } else { // edit 
   //      var id = Properties.insert(searchproduct);
   //      Router.go('/properties/' + id + '/edit');
   //  }   
// }
		
	}
});