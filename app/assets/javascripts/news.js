var Source = function(container, url) {
  this.url = url;
  this.container = container;

  var self = this;
  
  function getRss() {
    return $.ajax({
      url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(self.url),
      dataType: 'json',
      success: function(data) {
        return data.responseData.feed;
      }
    }).promise();
  }

  return {
    getRss: getRss
  };
};

var Renderer = (function(){
  function makeRow(data) {
    var thehtml = "<li>";
    thehtml += '<h5><a data-href="'+data.link+'" class="feed-item">'+data.title+'</a>';
    thehtml += '<small> - ' + data.source + ' - ' + data.publishedDate.fromNow() + '</small>';
    thehtml += "</h5>";
    thehtml += "</li>";
    return thehtml;
  }


  return {
    render: function(container, value){
      var thehtml = makeRow(value);
      $(container).append(thehtml);
    }
  };
})();

var ContentCleaner = {
  selectors: ['.v5-art-tools', '.skybet.rounded', '.base-art-tools', '#ob_iframe', '.OUTBRAIN', '.block_timer_share', '.block_share_icon', '.box26', '.emailprint', '.base-gallery-thumbs'],
  clean: function() {
    var self = this;
    var container = $('.content-pane');
    setInterval(function(){
      $.each(self.selectors, function(key, value){
        container.find(value).fadeOut('fast');
      });
    }, 1000);
  }
};