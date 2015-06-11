/**
 * Created by maispride786 on 9/6/15.
 */
$(document).ready(function(){
    var regex = new RegExp("[\\?&]qs=([^&#]*)");
    results = regex.exec(location.search);
    id = results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    if(id.length<1){
        $('body').hide();
    }else {
        var data = new Object();
        data["post_id"] = id;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "https://samepinch.herokuapp.com/api/webviews.json",
            data: {command: 'post', body: data},
            success: function (data) {
                render_as_html(data.body);
            },
            error: function (data) {
                response = JSON.parse(data.responseText);
                alert(response.message);
            }
        });
    }

});

render_as_html= function(data){
    add_meta_tags(data);
    $("#postContent #content").html(data.content);
    $(".profilepic-img").html(data.photo && data.photo.length>1 ? "<img src="+data.photo+" >" : "<div class='profilepic-placeholder'>"+data.initials+"</div>")
    $(".profile-name").html(data.name);
    $(".pViews").html(data.views);
    $(".plikes").html(data.upvote_count);
    $(".pTime").html(data.createdAt);
    $('span#tags').html("");

    $.map(data.tags,function(t){
        $('span#tags').append("<div class=tag>"+t+"</div>");
    });
   if(data.comments) {
       $.map(data.comments, function (c) {
           comment(c);
       });
   }
    $("#viewPost .row").show();
};

comment = function(arg){
    $('#comments').append("<div class='col-md-12 nopadding row-padding border-bottom'>" +
                        "<div class='col-md-1'>"+(arg.photo? "<img src="+arg.photo+" class='comment-profile'>" : "<div class='profilepic-placeholder'>"+ arg.initials +"</div>") +
                        "</div><div class='col-md-6 pull-left'>" +
                        "<div>"+arg.text+"</div>" +
                        "<div class=time>"+arg.createdAt+"</div></div> " +
                        "<div class='col-md-5'><div class='pull-right'> <span class='light-color'>" +
                        "<img src='/img/icon-like-count.png' width=18 height=18>"+arg.upvote_count+" </span> <span class='pull-right'>" +
                        "<img src='/img/icon-comment-more.png' width=8 height=25> </span></div> </div>" +
                        "</div>" +
                        "<div class=clearfix></div>");

};

add_meta_tags = function(data){
   console.log(data)
   $('head').append("<title>"+data.title+"</title>" +
       "<meta name='author' content='"+data.name+"'>" +
       "<meta name='description' content='"+data.desc+"'>" +
       "<meta name='keywords' content='"+data.name+", "+data.keywords+"'>" +
       "<meta property='og:title' content='"+data.title+"'>" +
       "<meta property='og:image' content='"+data.image+"'>" +
       "<meta property='og:url' content='"+location+"'>" +
       "<meta property='og:type' content= 'article'>" +
       "<meta property='og:site_name' content='SamPinch'>" +
       "<meta name='twitter:card' content='"+data.title+"'>" +
       "<meta name='twitter:title' content='"+data.title+"'>" +
       "<meta name='twitter:description' content='"+data.desc+"'>" +
       "<meta name='twitter:image' content='"+data.image+"'>" +
       "<meta itemprop=name content='"+data.title+"'>" +
       "<meta itemprop=description content='"+data.desc+"'>" +
       "<meta itemprop=image content='"+data.image+"'>")
}

