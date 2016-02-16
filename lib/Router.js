//var subManager = new.SubscribtionManager();

var Subs = new SubsManager({
  // will be cached only 20 recently used subscriptions
  cacheLimit: 200,
  // any subscription will be expired after 5 minutes of inactivity
  expireIn: 5
});

Router.configure({
    layoutTemplate: 'mainLayout',
    loadingTemplate: 'loading',
    onAfterAction: function(){
        if (Meteor.isClient)
            window.scrollTo(0, 0);
    }
    
});
Router.route('/dailyPopup', {

    name: 'dailyPopup'
});
Router.route('/testview', {

    name: 'testview'
});
Router.route('/',{
    //layoutTemplate: 'homeLayout',
    name:'home',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),TAPi18n.subscribe("list_product"),Subs.subscribe("banner")];
    },
    //fastRender: true
});

Router.route('/login', {
    name: 'login'
});

Router.route('/adminpanel', {
    name: 'adminpanel'
});

Router.map(function () {
  this.route('payment', {
    path: '/payment/',
    //template: 'payment',
    where: 'server',
    action: function () {
        //console.log('dataa:'+JSON.stringify(this.params));
        console.log('request:'+JSON.stringify(this.request.body));
        if (typeof this.request.body.State === 'undefined' || this.request.body.State === null) {
            console.log('No paramater from this payment!');
        }else{
            console.log('...');
            var reponse={
                state:this.request.body.State,
                resNum:this.request.body.ResNum,
                mid:this.request.body.MID,
                refnum:this.request.body.RefNum,
                trace:this.request.body.TRACENO
            };

            
            console.log('Payment has result:'+JSON.stringify(reponse));
            
            this.response.writeHead(200, {'Content-Type': 
                'text/html; charset=utf-8'});
            var html='<a href="/checkout">Back to safir</a>';
            this.response.end(JSON.stringify(html));
        }
    //this.render('login');
}
})
});


Router.route('/member', {
    name: 'member'
});
Router.route('/addquestion', {
    name: 'addquestion'
});

Router.route('/registerSuccess', {
    name: 'registerSuccess'
});

//admin
Router.route('/addproduct',{
    name:'addproduct',
    waitOn : function () {
        return [TAPi18n.subscribe("parent_tags"),TAPi18n.subscribe("tags"),TAPi18n.subscribe("categories"),Subs.subscribe("attribute_value")];

    }
    
});

// admin Products
Router.route('/manageproduct',{
    name:'manageproduct',
    waitOn : function () {
        return [TAPi18n.subscribe("categories"),TAPi18n.subscribe("products",-1),Subs.subscribe("attribute",-1),TAPi18n.subscribe("parent_tags")];
    }

});


Router.route('/updateproduct/:_id',{
    name: 'updateproduct',
    template: 'addproduct',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),TAPi18n.subscribe("parentattr"),Subs.subscribe("attribute",-1),TAPi18n.subscribe("tags"),TAPi18n.subscribe("parent_tags"),TAPi18n.subscribe("categories"),Subs.subscribe("attribute_value")];
    },
    data: function(){
        var id = this.params._id;
        var da = products.findOne({_id: id });
        return da;
    }
});


Router.route('/linkselling', {
    name: 'linkselling',
    waitOn : function () {
        return [Subs.subscribe("question"),Subs.subscribe("linkselling")];
    },
});

Router.route('/listing/:name',{
    name: 'listing_slug',
    template:'listproducts',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1)];
    },
    data: function() {
        var name=this.params.id;
        name=name.replace(/-/g, " ");
        //alert('title='+title);
        var l=categories.findOne({"title": { $regex: new RegExp("^" + name, "i") } });
        var parent=l._id;
        var arr=[parent];
        Session.set('subcategories',arr);
        //ROUND 1
        var finalList=[];
        finalList.push(parent);
        var lvl1=categories.find({"parent":parent}).fetch();
        for(var i=0;i>lvl1.length;i++){
            var cur1=lvl1[i]._id;
            finalList.push(cur1);
            var lvl2=categories.find({"parent":cur1}).fetch();
            for(var j=0;j<lvl2.length;j++){
                var cur2=lvl2[j];
                finalList.push(cur2);
                var lvl3=categories.find({"parent":cur2}).fetch();
                for(var k=0;k<lvl3.length;k++){
                    var cur3=lvl3[k];
                    finalList.push(cur3);
                    var lvl4=categories.find({"parent":cur3}).fetch();
                    for(var l=0;l<lvl4.length;l++){
                        var cur4=lvl4[l];
                        finalList.push(cur4);
                    }
                }
            }
        }
        console.log('all subcategories:'+finalList);
        Session.set('subcategories',finalList);
        //var fils=Meteor.call('getChildrenList',parent,function(err,result){
                //console.log('fils:'+result);
                //console.log('err:'+err);
             //   var finalList=result;
              //  finalList.push(parent);
                //Session.set('subcategories',finalList);
                //console.log('subcategories:'+Session.get('subcategories'));
                
           // }); 

            var limit=Session.get('querylimit');/////////////////
            //console.log('PNC limit:'+limit);
            Session.set('currentCategory',parent);
            Session.get('curCategory',parent);
            var toSort =  Session.get("GETName");
            var listtags=Session.get('list_tag').split(';');

            console.log('Categories'+Session.get('subcategories'));
            console.log('tags:'+Session.get('list_tag'));
            console.log('listtags.length: '+listtags.length);
            if(toSort == "name"){
                if(Session.get('list_tag')=='')
                    var result=products.find({"category":{$in:Session.get('subcategories')}},{limit:limit,sort:{title:1}});///////////////return products.find({},{sort:{title:1}});
                else
                    var result=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}},{limit:limit,sort:{title:1}});
            }else if(toSort == "price"){
                if(Session.get('list_tag')=="")
                    var result=products.find({"category":{$in:Session.get('subcategories')}},{limit:limit,sort:{price:-1}});//return products.find({},{sort:{price:-1}});
                else
                    var result=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}},{limit:limit,sort:{price:-1}});
            }else if(toSort == "sell"){
                if(Session.get('list_tag')=="")
                    var result=products.find({"category":{$in:Session.get('subcategories')}},{limit:limit,sort:{ratio:-1}});//return products.find({},{sort:{price:-1}});
                else
                    var result=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}},{limit:limit,sort:{ratio:-1}});
            }
            else{
                if(Session.get('list_tag')=="")
                    var result=products.find({"category":{$in:Session.get('subcategories')}},{limit:limit});
                else
                    var result=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}},{limit:limit});
            }
            //var result=products.find({"category":{$in:Session.get('subcategories')}},{limit:limit});///////////////
            Session.set('nbproducts',result.fetch().length);
            console.log("nbproducts: "+result.fetch().length)
            
            console.log('finishQuizz: '+Session.get('finishQuizz'));
            if(Session.get('finishQuizz')==''){
                var j=journey.find({"category":parent}).fetch();
                console.log("Result of quizz:"+j.length);
                if(j.length>0){
                    console.log('Display popup');
                    //$('#myJourney').modal('show');
                }
                
            }
            return {products:result};
        //return categories.findOne({_id: this.params.id},{limit:Session.get('querylimit')});
    },
    onStop: function () {
        console.log('leaving category!');
        Session.set('currentAnswer','');
        Session.set('parentAnswer','');
        Session.set('finishQuizz','');
        Session.set('list_tag','');
    }
});

Router.route('/category/:id',{
    name: 'listing',
    template:'listproducts',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),TAPi18n.subscribe('categories'),TAPi18n.subscribe('parent_tags'),TAPi18n.subscribe('tags')];
    },
    data: function() {
        //Session.set('querylimit',16);
        var parent=this.params.id;
        //=========makara=============
            if(Session.get('oldUrlId')!==parent){
                Session.set('querylimit',16);
                //delete Session.keys['advanced_brand','advanced_tags'];
                Session.set('advanced_brand','');
                Session.set('advanced_tags','');
                Session.set('parentTagId','');
            }
            Session.set('oldUrlId',parent);
            Session.set('refineCateId',parent);
        //=========end makara=========
        var arr=[parent];
        Session.set('subcategories',arr);
        var finalList=[];
        finalList.push(parent);
        console.log('papa:'+parent);
        var lvl1=categories.find({"parent":parent}).fetch();
        //console.log('papa:'+parent+' / '+categories.find({"parent":parent}).fetch().length);
        for(var i=0;i<lvl1.length;i++){
            console.log('lvl1');
            var cur1=lvl1[i]._id;
            finalList.push(cur1);
            var lvl2=categories.find({"parent":cur1}).fetch();
            for(var j=0;j<lvl2.length;j++){
                console.log('lvl2');
                var cur2=lvl2[j]._id;
                finalList.push(cur2);
                var lvl3=categories.find({"parent":cur2}).fetch();
                for(var k=0;k<lvl3.length;k++){
                    console.log('lvl3');
                    var cur3=lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4=categories.find({"parent":cur3}).fetch();
                    for(var l=0;l<lvl4.length;l++){
                        console.log('lvl4');
                        var cur4=lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        console.log('all subcategories:'+finalList);
        Session.set('subcategories',finalList);

            var limit=Session.get('querylimit');/////////////////
            //console.log('PNC limit:'+limit);
            Session.set('currentCategory',parent);
            Session.get('curCategory',parent);
            var toSort =  Session.get("GETName");
            var listtags=Session.get('list_tag').split(';');

            console.log('Categories'+Session.get('subcategories'));
            console.log('tags:'+Session.get('list_tag'));
            console.log('listtags.length: '+listtags.length);
            if(toSort == "name"){
                if(Session.get('list_tag')==''){
                    var result=products.find({"category":{$in:Session.get('subcategories')}},{limit:limit,sort:{title:1}});///////////////return products.find({},{sort:{title:1}});
                    var total=products.find({"category":{$in:Session.get('subcategories')}}).count();///////////////return products.find({},{sort:{title:1}});

                }
                else{
                    var result=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}},{limit:limit,sort:{title:1}});
                    var total=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}}).count();

                }
            }
            else if(toSort == "price"){
                if(Session.get('list_tag')==""){
                    var result=products.find({"category":{$in:Session.get('subcategories')}},{limit:limit,sort:{price:-1}});//return products.find({},{sort:{price:-1}});
                    var total=products.find({"category":{$in:Session.get('subcategories')}}).count();//return products.find({},{sort:{price:-1}});

                }
                else{
                    var result=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}},{limit:limit,sort:{price:-1}});
                    var total=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}}).count();
                }
                    
            }else if(toSort == "sell"){
                if(Session.get('list_tag')==""){
                    var result=products.find({"category":{$in:Session.get('subcategories')}},{limit:limit,sort:{ratio:-1}});//return products.find({},{sort:{price:-1}});
                    var total=products.find({"category":{$in:Session.get('subcategories')}}).count();//return products.find({},{sort:{price:-1}});
                }
                else{
                    var result=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}},{limit:limit,sort:{ratio:-1}});
                    var result=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}}).count();
                }
                    
            }
            else{
                if(Session.get('list_tag')==""){
                    var result=products.find({"category":{$in:Session.get('subcategories')}},{limit:limit});
                    var total=products.find({"category":{$in:Session.get('subcategories')}}).count();
                
                }   
                else{
                     var result=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}},{limit:limit});
                     var total=products.find({"category":{$in:Session.get('subcategories')},"tags.value":{$in:listtags}}).count();
                 }
                   
            }
            //var result=products.find({"category":{$in:Session.get('subcategories')}},{limit:limit});///////////////
            Session.set('nbproducts',result.fetch().length);
            Session.set('allproducts',total);
            console.log("nbproducts: "+result.fetch().length)
            
            console.log('finishQuizz: '+Session.get('finishQuizz'));
            if(Session.get('finishQuizz')==''){
                var j=journey.find({"category":parent}).fetch();
                console.log("Result of quizz:"+j.length);
                if(j.length>0){
                    console.log('Display popup');
                    //$('#myJourney').modal('show');
                }
                
            }
            return {products:result};
        //return categories.findOne({_id: this.params.id},{limit:Session.get('querylimit')});
    },
    onStop: function () {
        console.log('leaving category!');
        Session.set('currentAnswer','');
        Session.set('parentAnswer','');
        Session.set('finishQuizz','');
        Session.set('list_tag','');
    }
});

Router.route('/details/:id', {
    name: 'details',
    waitOn : function () {        
        console.log('SELECTION DES ATTRIBUTS DE '+this.params.id);
        //console.log('SELECTION DES ATTRIBUTS DE '+this.params.id);
        return [TAPi18n.subscribe("products",-1),Subs.subscribe("attribute",-1),TAPi18n.subscribe("parent_tags"),TAPi18n.subscribe("tags"),TAPi18n.subscribe("parentattr"),Subs.subscribe("contents")];

    },
    data: function() {
        //======makara========
        $('.close').click(); //close modal when go to detail
        //======end makara====
        Session.set('miniature',0);

        //alert('ROUTZER');
        //var prod=products.findOne({"_id": this.params.id});
        var title=this.params.id;
         title = title.replace(/\-/g," ");
        title = title.replace(/\(percentag\)/g,"%");
        title = title.replace(/\(plush\)/g,"+");
        title = title.replace(/\(ocir\)/g,"ô");
        title = title.replace(/\(minus\)/g,"-");
        title = title.replace(/\(copyright\)/g,"®");
        title = title.replace(/\(number\)/g,"°");
        title = title.replace(/\(bigocir\)/g,"Ô");
        title = title.replace(/\(square\)/g,"²");
        title = title.replace(/\(accentaigu\)/g,"`");
        title = title.replace(/\(eaccentaigu\)/g,"é");
        title = title.replace(/\(bigeaccentaigu\)/g,"É");
        title = title.replace(/\(and\)/g,"&");
        title = title.replace(/\(slash\)/g,"/");
        title = title.replace(/\(apostrophe\)/g,"’");
        title = title.replace(/\(quote\)/g,"'");
        title = title.replace(/\(warning\)/g,"!");
        title = title.replace(/\(question\)/g,"?");
        title = title.replace(/\(dolla\)/g,"$");
        title = title.replace(/\(eaccentgrave\)/g,"è");
        title = title.replace(/\(hyphen\)/g,"–");

        console.log("TITLE="+title);
        var prod = products.findOne({ "title" : {$regex : new RegExp(title, "i") }});

        //finding users
        //console.log('PRODUICT='+prod._id);
        if(typeof prod != "undefined" && typeof prod.review != "undefined"){
            console.log("WOOOW");
            var list_users=[];
            for(var i=0;i<prod.review.length;i++){
                list_users.push(prod.review[i].user);
                console.log(prod.review[i].user);
            }
            console.log('finish susbcri');
            Session.set('users_to_subsribe',list_users);
        }
        if(prod!=null){
            console.log('mon titre'+prod);
            var attr=attribute.findOne({"product":prod.oldId});
            //console.log('RECUP LE PRIX:'+p.fetch()[0].price);
            if(attr!=null){
                Session.set('selected_price',attr.price);
                Session.set('selected_point',attr.point);
            }
            console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
            Session.set('currentCategory',prod.category);
            return prod;
        }
    }
});


Router.route('/detail/:name', {
    name: 'detail',
    template:'details',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),Subs.subscribe("attribute")];
    },
    data: function() {
        Session.set('miniature',0);
        //alert('ROUTZER');
        var title=this.params.name;
        title=title.replace(/\(o-cir\)/g, "ô");
        title=title.replace(/\(plus\)/g, "+");
        title=title.replace(/-/g, " ");
        
        alert(title);
        //alert('title='+title);{$regex: new RegExp(keyword, "i")}
        var prod=products.findOne({"title": { $regex: new RegExp(title, "i") } });

        
        if(prod!=null){
            console.log('mon titre'+prod);
            var attr=attribute.findOne({"product":prod.oldId});


            //console.log('RECUP LE PRIX:'+p.fetch()[0].price);
            if(attr!=null){
                Session.set('selected_price',attr.price);
                Session.set('selected_point',attr.point);
                //Session.set('barcode',attr.barcode);
            }
            
            console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
            Session.set('currentCategory',prod.category);
            return prod;
        }
        
    }
    
    
});


Router.route('/translateproduct/:id', {
   name: 'translateproduct',
   template:'translateproduct',
   data: function() {
    
    var prod=products.findOne({"_id": this.params.id});
    if(prod!=null){
        console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
        Session.set('currentCategory',prod.category);
        return prod;
    }
    
}
});
Router.route('/producttranslate/:id', {
    name: 'producttranslate',
    template:'producttranslate',
    data: function() {
        
        var prod=products.findOne({"_id": this.params.id});
        if(prod!=null){
            console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
            Session.set('currentCategory',prod.category);
            return prod;
        }
        
    }
});
Router.route('/translate_category/:id',{
    name: 'translate_category',
    template:'translate_category',
    data: function() {
        
        var prod=categories.findOne({"_id": this.params.id});
        if(prod!=null){
            //console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
            Session.set('currentCategory',prod.category);
            return prod;
        }
        
    }
});
Router.route('/translateparentTag/:id',{
    name: 'translateparentTag',
    template:'translateparentTag',
    data: function() {
        
        var prod=parent_tags.findOne({"_id": this.params.id});
        if(prod!=null){
            //console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
            Session.set('currentCategory',prod.category);
            return prod;
        }
        
    }
});
Router.route('/translatTags/:id',{
    name: 'translatTags',
    template:'translatTags',
    data: function() {
        
        var prod=tags.findOne({"_id": this.params.id});
        if(prod!=null){
            //console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
            Session.set('currentCategory',prod.category);
            return prod;
        }
        
    }
});
Router.route('/translatParent_attr/:id',{
    name: 'translatParent_attr',
    template:'translatParent_attr',
    data: function() {
        
        var prod=parentattr.findOne({"_id": this.params.id});
        if(prod!=null){
            //console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
            Session.set('currentCategory',prod.category);
            return prod;
        }
        
    }
});


//Subs.subscribe("attribute")
Router.route('/transleattribute_value/:id',{
    name: 'transleattribute_value',
    template:'transleattribute_value',
    data: function() {
        
        var prod=attribute_value.findOne({"_id": this.params.id});
        if(prod!=null){
            //console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
            Session.set('currentCategory',prod.category);
            return prod;
        }
        
    },
    waitOn : function () {
        return [Subs.subscribe("attribute",-1),Subs.subscribe("attribute_value")];
    }
});
Router.route('/transleshops/:id',{
    name: 'transleshops',
    template:'transleshops',
    data: function() {
        
        var prod=shops.findOne({"_id": this.params.id});
        if(prod!=null){
            //console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
            Session.set('currentCategory',prod.category);
            return prod;
        }
        
    }
});

Router.route('/profile', {
    name: 'profile',
    waitOn : function () {
        return [Subs.subscribe('address'),Subs.subscribe("question")];
    }

});
Router.route('/editprofile', {
    name: 'editprofile'  ,
    waitOn : function () {
        return [Subs.subscribe('address')];
    }
});

Router.route('/reward', {
    name: 'reward',
    waitOn : function () {
        return [Subs.subscribe('users',this.userId),TAPi18n.subscribe("products",-1)];
    }
});

// admin categories
Router.route('/managecategory',{
    name: 'managecategory',
    data: function(){
        Session.set('multiUploadCategory','');
    }

});
Router.route('/addcategory',{
    name: 'addcategory'
    
});

Router.route('/updatecategory/:_id',{
    name: 'updatecategory',
    data: function(){
        var id = this.params._id;
        var da = categories.findOne({_id: id });
        Session.set('multiUploadCategory','');
        return da;
        
    }
});


// shop
Router.route('/manageshop',{

    name:'manageshop'

});

Router.route('/shopdetail/:id',{
    name:'shopdetail',
    data: function(){
        var id = this.params.id;
        var da = shops.findOne({_id: id });
        return da;
    }
});

Router.route('/updateshop/:_id',{
    name: 'updateshop',
    data: function(){
        var id = this.params._id;
        var da = shops.findOne({_id: id });
        return da;
    }
});


Router.route('/manageparenttag',{
    name:'manageparenttag'
    ,waitOn : function () {
        return [TAPi18n.subscribe('parent_tags')];
    }

});

Router.route('/updateparenttag/:_id',{
    name:'updateparenttag',

    data: function(){
        var id = this.params._id;
        var result = parent_tags.findOne({_id: id});
        return result;
    }
    ,waitOn : function () {
        return [TAPi18n.subscribe('parent_tags')];
    }

});


Router.route('/managetag',{

    name:'managetag'
    ,waitOn : function () {
        return [TAPi18n.subscribe('parent_tags'),TAPi18n.subscribe("tags")];
    }    

});
Router.route('/edittag/:_id',{
    name:'edittag',
    data: function(){
        return tags.findOne({_id: this.params._id});
    },waitOn : function () {
        return [TAPi18n.subscribe('parent_tags'),TAPi18n.subscribe("tags")];
    }

});

Router.route('/listproducts/:brand',{
    name:'listproducts',
    waitOn : function () {
        return [TAPi18n.subscribe('products',-1)];
    },
    data: function(){
        
        Session.set('limit',-1);
        Session.set('querylimit',16);
        var brand = this.params.brand;
        var result = products.find({"Brand":brand},{limit:Session.get('querylimit')});
        Session.set('nbproducts',result.fetch().length);
        return result;

    }
});

Router.route('/advanced',{
    name:'advanced',
    template: 'listproducts',
    waitOn : function () {
        return [TAPi18n.subscribe('products',-1),TAPi18n.subscribe('categories'),TAPi18n.subscribe('parent_tags'),TAPi18n.subscribe('tags')];
    },
    data: function(){
        var list_categories=[];
        if(Session.get('currentCategory')=='' || Session.get('currentCategory')=='undefined'){
            console.log('pas encore de categories');
            var allCat=categories.find({}).fetch();
            console.log('pas de cat in session:'+allCat.length);
            for(var i=0;i<allCat.length;i++){
                
                list_categories.push(allCat[i]._id);
            }
        }else{
            console.log('already:'+Session.get('currentCategory'));
            list_categories.push(Session.get('currentCategory'));
        }

        console.log('CURRENTCATEGORY='+list_categories);

        Session.set('limit',-1);
        Session.set('querylimit',16);
        var list_brand=[];
        var list_tags=[];
        var review_part={};

        console.log('brands:'+Session.get('advanced_brand'));
        if(Session.get('advanced_brand')!='')
            list_brand = Session.get('advanced_brand').split(';');
        if(Session.get('advanced_tags')!='')
            list_tags = Session.get('advanced_tags').split(';');

        var priceMin=0;
        if(Session.get('advanced_price_min')!= "")
            priceMin=Number(Session.get('advanced_price_min'));

        var priceMax=Number.MAX_VALUE;
        if(Session.get('advanced_price_max')!="")
            priceMax=Session.get('advanced_price_max');
        priceMax=Number(priceMax);

        //list_tags=Session.get('advanced_tags').split(';');
        //var list_tags=Session.get('advanced_tags');


        var has_comment=Session.get('advanced_has_comment');
        var is_favorite=Session.get('advanced_is_favorite');

        if(list_brand.length==0){
            
            var allProducts=products.find().fetch();
            console.log('Remplissage des Brand: '+allProducts.length);
            for(var i=0;i<allProducts.length;i++){
                if(list_brand.indexOf(allProducts[i].Brand)<0)
                    list_brand.push(allProducts[i].Brand);
            }

        }
        //alert('list_brand='+list_brand);
        console.log('list_brand='+list_brand);
        
        

                /*
                if(list_tags.length==0){
                    var allProducts=products.find();
                    for(var i=0;i<allProducts.length;i++){
                        if(list_tags.indexOf(allProducts[i].Brand)==-1)
                            list_brand.push(allProducts[i].Brand);
                    }
                }{review : {$exists:true}, {$where:'this.review.length>0'}}
                */

                //alert('PriceMin= '+priceMin);
                //alert('PriceMax= '+priceMax);
                console.log('list_categories='+list_categories);
                console.log('list_brand='+list_brand);
                console.log('queryLimit:'+Session.get('querylimit'));
                var arrayobj=[];
                /*if(has_comment==0){DfwSwoSezQetwuGYy
                    var result = products.find({$and:[{category:{$in:list_categories}},{Brand:{$in:list_brand}}]});
                    result.forEach(function(value){
                        if(value.price>=priceMin && value.price<priceMax){
                            //alert('hello');
                            arrayobj.push(value);
                        }
                    });
                }
                else{*/
                    if(list_tags.length>0){
                        var result = products.find({category:{$in:list_categories},Brand:{$in:list_brand},"tags.value":{$in:list_tags}});
                    }else{
                        var result = products.find({category:{$in:list_categories},Brand:{$in:list_brand}});
                    }
                    
                    console.log('resultat du refine:'+result.count());
                    result.forEach(function(value){
                        if(typeof value.price === "undefined"){
                            arrayobj.push(value);
                        }else{
                            if(value.price>=priceMin && value.price<priceMax){
                            //alert('hello');
                            arrayobj.push(value);
                        }
                    }
                    
                });
                //}
                
                Session.set('nbproducts',arrayobj.length);
                return {products:arrayobj};

            }
        });

Router.route('/favorite', {
    name:'favorite',
    template:'listproducts',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),Subs.subscribe("favorite")];
    },
    data: function(){
        Session.set('limit',-1);
        var parent=this.params.id;
        if(Session.get('oldUrlId')!==parent){
                Session.set('querylimit',16);
            }
        Session.set('oldUrlId',parent);
        var object=[];
        var ses=false;
        if(Meteor.userId()){
            ses=Meteor.userId();
        }else{
            ses=Session.get('userId');
        }
          var data=favorite.find({userId:ses},{limit:Session.get('querylimit')});
          var obj={};
          data.forEach(function(entry) {
            var proid=entry.proId;
            //===makara=====
            var like="#like"+entry.proId;
            var unlike="#unlike"+entry.proId;
            $(like).removeClass('nonelike');
            $(unlike).addClass('nonelike');
            //===end makara=
            obj=products.findOne({_id:proid});
            object.push(obj);
            
        });
          console.log(object);
          //alert('favorite='+object.length);
          Session.set('nbproducts',object.length);
          return {products:object};            
    }

});
Router.route('/searchproduct/:slug',{
    template:'searchproduct',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),Subs.subscribe("contents")];
    },
    data: function(){
        var productsearch = Session.get('keyword'); 
        // alert("ok" + productsearch);

            /*var keyword = Session.get('keyword');
            console.log('parameter:'+keyword);
            if(keyword==""){
                Session.set('nbproducts',0);
                return null;
            }
                
            var result = "";
            result = products.find({title: {$regex: new RegExp(keyword, "i")}},{limit:Session.get('querylimit')});
            Session.set('nbproducts',result.fetch().length);
            console.log("pro:"+result.count());
            return result;
            */

            var querylimit=Session.get('querylimitsearch');

            var keyword = Session.get('keyword');
            //=========makara=============
            if(Session.get('oldKey')!==keyword){
                Session.set('querylimitsearch',16);
            }
            Session.set('oldKey',keyword);
            //=========end makara=========
            //alert('router:'+keyword);
            var groupid = parseInt(Session.get('groupsearch'));
        //alert('groupid:'+groupid);
        if( keyword != ""){
            console.log("group:"+groupid);
            var result = [];
            var result1=[];
            if( groupid == 1){
                console.log('search products');
                result = products.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{description: {$regex: new RegExp(keyword, "i")}}]},{limit:querylimit}).fetch();
                Session.set("searchall","");
            }
            else if( groupid == 4 ){
                console.log('search webzine');
                var webzine = contents_type.findOne({type:"Webzine"});
                result1 = contents.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{content: {$regex: new RegExp(keyword, "i")}}], typeid:webzine._id},{limit:querylimit}).fetch();
                Session.set("searchall","");
            }
            else if( groupid == 5 ){
                console.log('search tuto');
                var tuto = contents_type.findOne({type:"Tuto"});
                result1 = contents.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{content: {$regex: new RegExp(keyword, "i")}}], typeid:tuto._id},{limit:querylimit}).fetch();
                Session.set("searchall","");
            }
            else{
                //alert('hollo');
                console.log('search all on all');
                result = products.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{description: {$regex: new RegExp(keyword, "i")}}]},{limit:querylimit}).fetch();
                result1 = contents.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{content: {$regex: new RegExp(keyword, "i")}}]},{limit:querylimit}).fetch();
                Session.set("searchall",1);
                
            }

            Session.set('nbproducts',result.length);
            Session.set('nbcontents',result1.length);
            //alert('FINISH ROUTING');
            return {product:result,content:result1};
            
        }else{
            Session.set('nbproducts',0);
            Session.set('nbcontents',0);
            return;
        }
    }
});

Router.route('/checkout',{
    name:'checkout',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1)];
    }
});

Router.route('/webzinelisting',{
    name: 'webzinelisting',
    waitOn : function () {
        return [Subs.subscribe('contents'),Subs.subscribe('banner')];
    } 
});
Router.route('/webzinedetails/:_id', {
    name: 'webzinedetails' ,
    data: function(){
     return contents.findOne({_id: this.params._id});
    } ,
     waitOn : function () {
        return [Subs.subscribe('contents'),TAPi18n.subscribe("products",-1)];
    }
});

Router.route('/addContent', {
    name: 'addContent',

    template:'addContent',


});

Router.route('/updateContent/:_id', {
    name: 'updateContent',
    data: function(){
        return contents.findOne({_id: this.params._id});
    },
    waitOn : function () {
        return [Subs.subscribe("images"),Subs.subscribe("contents")];
    }

});

Router.route('/managecontent', {
    name: 'managecontent',
    waitOn : function () {
        return [Subs.subscribe('contents')];
    }
});
//end kis

//Parent Attribute
Router.route('/parentattr', {
    name: 'parentattr',
    waitOn : function () {
        return [TAPi18n.subscribe("parentattr")];
    }
    
});

Router.route('/editparentattr/:_id', {
    name: 'editparentattr',
    data: function() {
        return parentattr.findOne({_id: this.params._id});
    },
    waitOn : function () {
        return [TAPi18n.subscribe("parentattr")];
    }

});
//Attribute
Router.route('/attribute', {
    name: 'attribute',
    waitOn : function () {
        return [Subs.subscribe("attribute",-1),TAPi18n.subscribe("parentattr"),Subs.subscribe('attribute_value')];
    }
});

Router.route('/editattr/:_id', {
    name: 'editattr',
    data: function() {
        var attr= attribute.findOne({_id: this.params._id});
        Session.setPersistent('id',attr.productImage);//store field productImage to use in helper to get file dispay
        Session.setPersistent('attrId',this.params._id);//store id attribute to use delete file
        var id =attr.parentId;
        var parent=parentattr.findOne({_id:id})
        Session.setPersistent('parentID',parent._id);//store id parent attribute to find where not equal parentId
        var dataAll={
            attr:attr,
            parent:parent
        }
        return dataAll;
    }
    ,
    waitOn : function () {
        return [Subs.subscribe("attribute",-1),TAPi18n.subscribe("parentattr")];
    }
    
});
Router.route('/tutolisting/:_id',{
    name:'tutolisting',
    data:function(){
        return categories.findOne({_id: this.params._id});
    },
    waitOn : function () {
        return [Subs.subscribe("contents")];
    }
});
Router.route('/tutodetails/:_id',{
    name:'tutodetails',
    waitOn : function () {
        return [Subs.subscribe("contents"),TAPi18n.subscribe("products",-1)];
    },
    data:function(){
        return contents.findOne({_id: this.params._id});
    }
});
Router.route('/tuto',{
    name:'tutonew',
    waitOn : function () {
        return [TAPi18n.subscribe("categories")];
    },
    data: function(){
        var cat=categories.find({"parent":" "});
        console.log("count: "+cat.count());
        return {getTutoCategory:cat};
    }
});

Router.route('/journey', {
    name: 'journey'  
});


Router.route('/test', {
    name: 'test',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1)];
    }  
});

Router.route('/addlistproduct', {
    name: 'addlistproduct',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),TAPi18n.subscribe("list_product")];
    }
});

Router.route('/updatelistproduct/:_id',{
    name: 'updatelistproduct',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),TAPi18n.subscribe("list_product")];

    },
    data: function(){
        var id = this.params._id;
        var da = list_product.findOne({_id: id });
        return da;
    }
});


Router.route('/addList', {
    name: 'addList',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),TAPi18n.subscribe("list_product")];
    } ,
    data: function(){
        var arr=[];
        for(var i=0;i<10;i++){
            arr[i]=i;
        }
        //[0,1,2,3,4,5,6,7,8,9]
        return {p: arr};
    }
});

Router.route('/confirmorder',{
    name: 'confirmorder'
});
Router.route('/confirmorder1',{
    name: 'confirmorder1',
    waitOn : function () {
        return [Subs.subscribe('address')];
    }
});
Router.route('/confirmorder2',{
    name: 'confirmorder2',
    waitOn : function () {
        return [Subs.subscribe('address')];
    }
});

Router.route('/listTranslate',{
    name: 'listTranslate',
    waitOn : function () {
        return [Subs.subscribe("translation")];
    }
    
});

Router.route('/new',{
    name:'new'
});
Router.route('/email',{
    name: 'email'
});
Router.route('/veryfy',{
    name:'veryfy'
});
Router.route('/ForgotPassword',{
    name:'ForgotPassword'
});
Router.route('/ResetPassword',{
    name:'ResetPassword'
});

Router.route('/slider',{
    name:'slider'
});

Router.route('/success',{
    name:'success'
});
Router.route('/banner',{
    name:'banner',
    waitOn : function () {
        return [Subs.subscribe("banner")];
    }
    });


Router.route('/updatebanner/:_id',{
    name:'updatebanner',
    template:'banner',
    data:function(){
        //Session.set('bannerId',this.params._id);
        return banner.findOne({_id: this.params._id});
    },
    waitOn : function () {
        return [Subs.subscribe("banner")];
    }
});

Router.route('/menulink',{
    name:'menulink'
});
Router.route('/managequestion',{
    name:'managequestion',
    waitOn : function () {
        return [Subs.subscribe("question")];
    }

});
Router.route('/updatequestion/:_id',{
    name:'updatequestion',
    data:function(){
        //Session.set('bannerId',this.params._id);
        return question.findOne({_id: this.params._id});
    },
    waitOn : function () {
        return [Subs.subscribe("question")];
    }
});
Router.route('/imedation',{
    name:'imedation'
});


Router.route('/zoom',{
    name:'zoom'
});

Router.route('/addanwser',{
    name:'addanwser'
});

Router.route('/import', {

    name: 'import',
    data:function(){
        Meteor.call("readCSV");
        //return question.findOne({_id: this.params._id});
    }
});
Router.route('/listorder',{
    name:'listorder',
    waitOn : function () {
        return [Subs.subscribe("order")];

    }
   
});
Router.route('/manageUserTracking',{
    name: 'manageUserTracking',
    waitOn : function () {
        return [Subs.subscribe("tracking")];
    },data: function(){
        Session.set('users_to_subsribe',[-1]);

    }
});

Router.route('/listitem',{
    name: 'listitem',
    waitOn : function () {
        return [Subs.subscribe("order")];

    }
});

Router.route('/orderItem',{
    name:'orderItem',
    waitOn : function () {
        return [Subs.subscribe("order")];

    }
});

Router.route('/orderItemShop',{
    name:'orderItemShop',
    waitOn : function () {
        return [Subs.subscribe("order")];

    }
});

Router.route('/stock',{
    name:'stock'
});
Router.route('/userOrderList',{
    name: 'userOrderList',
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),TAPi18n.subscribe("products")];
    }
});

Router.route('/logintwitter',{
    name:'logintwitter'

});
Router.route('/loginsocial',{
    name:'loginsocial'

});
Router.route('/orderDetail/:_id',{
    name:"orderDetail",
    waitOn : function () {
        return [TAPi18n.subscribe("products",-1),TAPi18n.subscribe("products")];
    },
     data: function(){
        return order.findOne({_id: this.params._id});
        }
});

Router.route('/mousetracking', {
    name: 'mouseTracking',
    waitOn : function () {
        return [Subs.subscribe("userTracking")];
    }
});

Router.route('/quizzQA/2GCnaSzZ8tqyBmTEt', {

    name: 'quizzQA',
    waitOn : function () {
        return [Subs.subscribe("quizz")];
    },
    data: function(){
         //var id = this.params._id;
         //console("QUIZZID="+id);
        var da = quizz.findOne({_id:"2GCnaSzZ8tqyBmTEt"});
        console.log(da);
        return da;
    }
});

Router.route('/memberReview',{
    name:'memberReview',
     waitOn : function () {
        return [TAPi18n.subscribe("products",-1)];
    }

});
Router.route('/next',{
    name : 'next'
});
Router.route('/sliderResponsive',{
    name:'sliderResponsive'
});
// ============= QUIZZ PAGE  =================//
Router.route('/addquizz', {
    name: 'addquizz',
    waitOn : function () {
        return [TAPi18n.subscribe("parent_tags"),TAPi18n.subscribe("tags")];

    }
});
Router.route('/managequizz', {
    name: 'managequizz',
    waitOn : function () {
        return [Subs.subscribe("quizz")];
    }
});
Router.route('/updatequizz/:_id', {
    name: 'updatequizz',
    waitOn : function () {
        return [Subs.subscribe("quizz")];
    },
    data:function(){
        return quizz.findOne({_id: this.params._id});
    }
});
Router.route('/prodiscount',{
    name:'proDiscount',
    waitOn : function () {
        return [TAPi18n.subscribe('discount'),TAPi18n.subscribe("products")];
    }
    
});
Router.route('/manageDiscount',{
    name:'manageDiscount'
});

Router.route('/updateProDiscount/:_id', {
    name: 'updateProDiscount',
    waitOn : function () {
        return [TAPi18n.subscribe('discount'),TAPi18n.subscribe("products")];
    },
    data:function(){
        //Session.set('bannerId',this.params._id);
        return discount.findOne({_id: this.params._id});
    }
});

Router.route('/manageCollect', {
    name: 'manageCollect',
    waitOn : function () {
        return [TAPi18n.subscribe('collect')];
    }
});

Router.route('/division', {
    name: 'division',
});

Router.route('/updateCollect/:_id', {
    name: 'updateCollect',
    waitOn : function () {
        return [TAPi18n.subscribe('collect')];
    },
    data:function(){
        //Session.set('bannerId',this.params._id);
        return collect.findOne({_id: this.params._id});
    }
});
