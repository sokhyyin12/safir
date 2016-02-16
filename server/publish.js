
TAPi18n.publish("categories", function () {//console.log('categories:'+categories.find({}).fetch().length);
    return categories.i18nFind({});
});
//Meteor.publish('products', function (limit){ 
TAPi18n.publish('products', function (limit){ 
  if(limit!=-1)
    return products.i18nFind({},{limit:limit});//return products.find({},{limit:limit});
  else
    return products.i18nFind({});
});
Meteor.publish('images', function (){ 
  return images.find({});
});

Meteor.publish('shops', function (){ 
  return shops.find({})
});
TAPi18n.publish('parent_tags', function (){ 
  return parent_tags.i18nFind({});
});
TAPi18n.publish('tags', function (){ 
  return tags.i18nFind({});
});
Meteor.publish('stats', function (){ 
  return stats.find({});
});
Meteor.publish('answerquizz', function (){ 
  return answerquizz.find({});
});
Meteor.publish('quizzQA', function (){ 
  return quizzQA.find({});
});

Meteor.publish("attribute", function (product) {
    
    if(product==-1)
      return attribute.find({});
    else{
      var old=products.findOne({"title":product});
      //console.log('SOUSCRIRE A '+old.oldId);
      return attribute.find({"product":old.oldId});
    }
      
 });

TAPi18n.publish("parentattr", function () {
    return parentattr.i18nFind({});
 });


Meteor.publish("users", function (tab) {
    if(tab==null)
      tab=[];
    tab.push(this.userId);
    if(tab[0]==-1)
      return Meteor.users.find();
    //for(var i=0;i<tab.length;i++)
      //  console.log('subscribing to : '+tab[i]);
    return Meteor.users.find({"_id":{ $in: tab }});
 });


Meteor.publish("cart", function (id) {
    return cart.find({"userId":id});
 });
//contents
Meteor.publish("contents", function () {
    return contents.find({});
 });
Meteor.publish("contents_type", function () {
    return contents_type.find({});
 });
// address
Meteor.publish("address", function () {
    return address.find({});
 });
 Meteor.publish("favorite", function () {
    return favorite.find({});
 });
 Meteor.publish("role", function () {
    return Meteor.roles.find({});
 
});
 //Question
 Meteor.publish("question", function () {
    return question.find({});
});

  Meteor.publish("journey", function () {
    return journey.find({});
});

  Meteor.publish("linkselling", function () {
    return linkselling.find({});
});

  Meteor.publish("membershipcard", function () {
    return membershipcard.find({});
});

    TAPi18n.publish("list_product", function () {
    return list_product.i18nFind({});
});

Meteor.publish('attribute_value', function (){ 
  return attribute_value.find({});
});

Meteor.publish('translation', function (){ 
  return translation.find({});
});

Meteor.publish('payments', function (){ 
  return payments.find({});
});
Meteor.publish('banner', function (){ 
  return banner.find({});
});
Meteor.publish('daily', function (){ 
  return daily.find({});
});
Meteor.publish('imedation',function(){
  return imedation.find({});
});
Meteor.publish('anwser',function(){
  return anwser.find({});
});

Meteor.publish('barcode',function(){
  return barcode.find({});
});

Meteor.publish('userTracking',function(){
  return userTracking.find({});
});

Meteor.publish('mouse',function(){
  return mouse.find({});
});
Meteor.publish('quizz', function (){ 
    return quizz.find({});
});
Meteor.publish('tracking',function(){
  return tracking.find({});
});

Meteor.publish('order',function(){
  return order.find({});
});



Meteor.publish('stock',function(name,barcode){
  return stock.find({"RetailStoreName":name,"Barcode":barcode});
});
Meteor.publish('discount',function(){
  return discount.find({});
});
Meteor.publish('collect',function(){
  return collect.find({});
});


