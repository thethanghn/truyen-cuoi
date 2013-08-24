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
//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require bootstrap-wysihtml5
//= require masonry/jquery.masonry
//= require_tree .

$(function(){
  
  $('.topnote').mouseover(function(){
    var news = [
      'Double click on story after reading to hide',
      'Scroll down is infinite',
      'Switch between read/unread stories',
      'Columns are reorganized after finished',
      'You can drag my avatar to where you want',
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
  
  $('.wysihtml5').each(function(i, elem) {
    $(elem).wysihtml5();
  });
  
  $container = $('#masonry-container');
  $container.masonry({
    itemSelector: '.post',
    gutter: 5
  });
  
  
  $container.infinitescroll({
    debug: true,
    navSelector  : '.pagination',    // selector for the paged navigation 
    nextSelector : '.pagination ul li a[rel="next"]',  // selector for the NEXT link (to page 2)
    itemSelector : '#masonry-container .post',     // selector for all items you'll retrieve
    loading: {
        finishedMsg: 'No more pages to load.',
        img: 'http://i.imgur.com/6RMhx.gif'
      }
    },
    // trigger Masonry as a callback
    function( newElements ) {
      // hide new items while they are loading
      var $newElems = $( newElements ).css({ opacity: 0 });
      // ensure that images load before adding to masonry layout
      $newElems.imagesLoaded(function(){
        // show elems now they're ready
        $newElems.animate({ opacity: 1 });
        $container.masonry( 'appended', $newElems, true ); 
      });
    }
  );
  

});