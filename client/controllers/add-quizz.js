Session.set('NUM_QUESTION',0);
// ============================ ADD QUIZZ AND ANSWER ===================== //
Template.addquizz.events({
	"click #btn-save":function(){
		var arr_result = [];
		var quizz_name = $("#quizz_name").val();
		var quizz_type = $("#quizz_type").val();
		alert(quizz_name+quizz_type);
		$(".tbodyquestion .quess-tbody").each(function(val){
			var arr_answer = [];
			var question = $('tr.quest-list',this).attr("data-question");
			var par_tag = $('tr.quest-list',this).attr("data-par");
			var quest_image = $('tr.quest-list',this).attr("data-quesImage");
			console.log("question"+question);
			$("tr.answer-list",this).each(function(val){
				var answer = $(this).attr("data-answer");
				var answer_image = $(this).attr("data-answerImage");
				var answer_tag = $(this).attr("data-answertag");
				console.log("answer"+answer);
				arr_answer.push({value:answer,image:answer_image,tag:answer_tag});
			});
			arr_result.push({question:question,parent_tag:par_tag,image:quest_image,answers:arr_answer});
		});
		console.log(arr_result);
		var new_obj = {
			name:quizz_name,
			type:quizz_type,
			question:arr_result
		}
		Meteor.call("AddQuizz",new_obj,function(error){
			if(error){
				console.log("AddQuizz problem!!"+error.reason());
			}else{
				console.log("AddQuizz Success");
				Router.go("managequizz");
			}
		});
	},
	"click #add-answer":function(e){
		e.preventDefault();
		//alert("helo");
    	var html = "";
    	var num = Session.get('NUM_QUESTION');
    	console.log("ANSWER_MYNUM="+num);
        var answer = $('#answer').val();
        var answer_image =  Session.get('ANSWER_IMAGE');
        	alert(answer_image);
        var answer_tag = $("#tag_answer option:selected").text();
        html += '<tr class="answer-list" data-answer="'+answer+'" data-answertag="'+answer_tag+'" data-answerImage="'+answer_image+'">';
            html += '<td>';
        		html += '<img src="/images/2-bg.png" width="40">';
        	html += '</td>';
            html += '<td>*** :) Answer: '+answer+'</td>';
			html += '<td>';
				html += '<a href="#" class="remove pull-right">remove</a>';
			html += '</td>';
		html += '</tr>';
        $(".answer-list"+num).append(html);
	},
	"click #add-question":function(e){
		e.preventDefault();
		var num = Session.get("NUM_QUESTION") + 1;
		Session.set("NUM_QUESTION",num);
		console.log("MYNUM="+num);	
    	var html = "";
    	var Remove = "remove";
    	var question_img = Session.get('QUESTION_IMAGE');
    		alert(question_img);
        var question = $('#question').val();
        var par_tag = $('#par_tag option:selected').text();
        alert(par_tag);
        html += '<tbody class="quess-tbody answer-list'+num+'">';
	        html += '<tr class="quest-list" data-question="'+question+'" data-par="'+par_tag+'" data-quesImage="'+question_img+'">';
	        	html += '<td>';
	        		html += '<img src="/images/p1.jpg" width="40">';
	        	html += '</td>';
	        	html += '<td style="color:red">* Question : '+question+'</td>';
	        	html += '<td>';
					html += '<a href="#" class="remove_div pull-right">remove</a>';
				html += '</td>';
	        html += '<tr>';
	    html += '</tbody>'
        $('.tbodyquestion').append(html);	
	},
	"change #img_quest": function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function (err, fileObj) {
                Session.set('QUESTION_IMAGE', fileObj._id);
            });
        }
    },
    "change #img_answer": function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function (err, fileObj) {
                Session.set('ANSWER_IMAGE', fileObj._id);
            });
        }
    },
    "change #par_tag":function(){
    	var tagname = $("#par_tag").val();
    	Session.set("TAG_VALUE",tagname);
    },
    'click .remove': function(e,tpl){
		$(e.currentTarget).parent().parent().remove();
	}
});
Template.addquizz.helpers({
	getParentTag:function(){
		return parent_tags.find();
	},
	getTag:function(){
		var tag = Session.get("TAG_VALUE");
		return tags.find({parent:tag});
	}
})

// ============================ UPDATE QUIZZ AND ANSWER ===================== //

Template.updatequizz.events({
	"click #btn-save":function(){
		var arr_result = [];
		var id = this._id;
		var quizz_name = $("#quizz_name").val();
		var quizz_type = $("#quizz_type").val();
		alert(quizz_name+quizz_type);
		$(".tbodyquestion .quess-tbody").each(function(val){
			var arr_answer = [];
			var question = $('tr.quest-list',this).attr("data-question");
			var par_tag = $('tr.quest-list',this).attr("data-par");
			var quest_image = $('tr.quest-list',this).attr("data-quesImage");
			console.log("question"+question);
			$("tr.answer-list",this).each(function(val){
				var answer = $(this).attr("data-answer");
				var answer_image = $(this).attr("data-answerImage");
				var answer_tag = $(this).attr("data-answertag");
				console.log("answer"+answer);
				arr_answer.push({value:answer,image:answer_image,tag:answer_tag});
			});
			arr_result.push({question:question,parent_tag:par_tag,image:quest_image,answers:arr_answer});
		});
		console.log(arr_result);
		var new_obj = {
			name:quizz_name,
			type:quizz_type,
			question:arr_result
		}
		Meteor.call("UpdateQuizz",id,new_obj,function(error){
			if(error){
				console.log("AddQuizz problem!!"+error.reason());
			}else{
				console.log("AddQuizz Success");
				Router.go("/managequizz");
			}
		});
	},
	"click #add-answer":function(e){
		e.preventDefault();
		//alert("helo");
    	var html = "";
    	var num = Session.get('NUM_QUESTION');
    	console.log("ANSWER_MYNUM="+num);
        var answer = $('#answer').val();
        var answer_image =  Session.get('ANSWER_IMAGE');
        var answer_tag = $("#tag_answer option:selected").text();
        html += '<tr class="answer-list" data-answer="'+answer+'" data-answertag="'+answer_tag+'" data-answerImage="'+answer_image+'">';
            html += '<td>';
        		html += '<img src="/images/2-bg.png" width="40">';
        	html += '</td>';
            html += '<td>*** :) Answer: '+answer+'</td>';
			html += '<td>';
				html += '<a href="#" class="remove pull-right">remove</a>';
			html += '</td>';
		html += '</tr>';
        $(".answer-list"+num).append(html);
	},
	"click #add-question":function(e){
		e.preventDefault();
		var num = Session.get("NUM_QUESTION") + 1;
		Session.set("NUM_QUESTION",num);
		console.log("MYNUM="+num);	
    	var html = "";
    	var Remove = "remove";
    	var question_img = Session.get('QUESTION_IMAGE');
    		//alert(question_img);
        var question = $('#question').val();
        var par_tag = $('#par_tag option:selected').text();
        alert(par_tag);
        html += '<tbody class="quess-tbody answer-list'+num+'">';
	        html += '<tr class="quest-list" colspan="10" data-question="'+question+'" data-par="'+par_tag+'" data-quesImage="'+question_img+'">';
	        	html += '<td>';
	        		html += '<img src="/images/p1.jpg" width="40">';
	        	html += '</td>';
	        	html += '<td style="color:red">* Question : '+question+'</td>';
	        	html += '<td>';
					html += '<a href="#" class="remove_div pull-right">remove</a>';
				html += '</td>';
	        html += '</tr>';
	    html += '</tbody>'
        $('.tbodyquestion').append(html);	
	},
	"change #img_quest": function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function (err, fileObj) {
                Session.set('QUESTION_IMAGE', fileObj._id);
            });
        }
    },
    "change #img_answer": function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function (err, fileObj) {
                Session.set('ANSWER_IMAGE', fileObj._id);
            });
        }
    },
    'click .remove': function(e,tpl){
		$(e.currentTarget).parent().parent().remove();
	}
});
Template.updatequizz.helpers({
	getImage: function(image){
        var img = images.findOne({_id:image});
        if(img){
            console.log(img.copies.images.key);
            return img.copies.images.key;
        }else{
            return;
        }
    }
});
// ============================ MANAGE QUIZZ AND ANSWER ===================== //

Template.managequizz.helpers({
	getquizz:function(){
		return quizz.find();
	}
})