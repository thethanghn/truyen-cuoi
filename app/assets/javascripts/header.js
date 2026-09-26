// Header behaviour (feature popover, narrator toggle). `main` and `Player` come from shared/_me on the canvas layout.

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
    if (typeof Player === 'undefined') return; // narrator only exists on the canvas layout
    if (window.main) main.stop();
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
