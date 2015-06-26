var Source = function(container, url) {
  this.url = url;
  this.container = container;

  var self = this;
  function makeRow(data) {
    var thehtml = "<li>";
    thehtml += '<h5><a data-href="'+data.link+'" class="feed-item">'+data.title+'</a>';
    thehtml += '<small> - ' + data.source + '</small>';
    thehtml += "</h5>";
    thehtml += "</li>";
    return thehtml;
  }
  function getRss() {
    return $.ajax({
      url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(self.url),
      dataType: 'json',
      success: function(data) {
        //console.log(data.responseData.feed);
        // $(container).html('<h2>'+ data.responseData.feed.title +'</h2>');
   
        $.each(data.responseData.feed.entries, function(key, value){
          var thehtml = makeRow({ title: value.title, link: value.link, source: data.responseData.feed.title});
          $(container).prepend(thehtml);
        });
      }
    }).promise();
  }

  return {
    getRss: getRss
  };
};