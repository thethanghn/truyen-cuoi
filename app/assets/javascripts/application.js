// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery2
//= require jquery_ujs
//= require bootstrap
//= require bootstrap-wysihtml5
//= require masonry/jquery.masonry
//= require jquery-ui-1.9.2.custom.min
//= require jquery.infinitescroll.min
//= require d3.min
//= require rx.all
//= require reactjs/react-with-addons
//= require reactjs/JSXTransformer
//= require zepto.min
//= require moment
//= require growlyflash
//= require override
//= require posts
//= require news
//= require_self

$(function(){
  
  $('.topnote').mouseover(function(){
    var news = [
      'Double click on story after reading to hide (desktop)',
      'Scroll down is infinite',
      'Switch between read/unread stories',
      'Columns are reorganized after finished',
      'You can drag my avatar to where you want (desktop)',
      'Post now has number at the right bottom',
      'I will not tell you the same story again'
    ];
    var html = 'Feature: <ul>';
    for (var i = 0; i < news.length; i++) {
      html += '<li>' + news[i] + '</li>';
    }
    html += '</ul>';
    $(this).popover({
      html: true,
      content: html,
      placement: 'bottom'
    });
  });
  
  $('.topimg').click(function(){
    if (main) main.stop();
    if ($('.narrator').is(':visible')) {
          main = new Player([[0, 'Good byee...'],[2,'...']],{finished: function(){
            $('.narrator, .popover').fadeOut();      
          }});
          main.play();
    } else {
      $('.narrator').fadeIn(500, function() {
          main = new Player([[1, 'Pheeww! Here am I again! :S ']],{finished: function(){}});
          main.play();
        });
    }
  });
  
  
  

});