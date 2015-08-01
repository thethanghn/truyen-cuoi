var Chat = React.createClass({
  getDefaultProps: function() {
    return {
      messages: [
        { actor: 'Thang', text: 'Hello World'}
      ]
    };
  },
  renderMessages: function(){
    var msgs = this.props.messages;
    return msgs.map(function(msg){
      return <div classNameName="message">{msg.actor}: {msg.text}</div>;
    });
  },
  submitHandler: function() {
    var input = this.refs.input.getDOMNode();
    var msg = input.value;
    if (msg) {
      this.props.sendMessageHandler(msg);
      input.value = '';
      input.focus();
    }
    return false;
  },
  componentDidUpdate: function() {
    var input = this.refs.dialog.getDOMNode();
    input.scrollTop = input.scrollHeight;
  },
  render: function(){
    return (
      <div classNameName="chat-window">
        <h4>Chat windows</h4>
        <div id="theDialogue" ref="dialog">
          {this.renderMessages()}
        </div>
        <h4>Your message:</h4>
        <form className="form-message horizontal-form" id="mainfrm">
            <div className="form-group">
                <textarea className="form-control" type="text" id="input" ref="input" rows="3"></textarea>
            </div>
            <div className="form-group">
                <input type="button" value="Send" className="btn btn-primary" onClick={this.submitHandler}/>
            </div>
        </form>
      </div>
    );
  }
});