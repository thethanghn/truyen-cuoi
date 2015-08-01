var RightPanel = React.createClass({
  render: function(){
    return (
      <div className="right-panel">
        <RoomActors actors={this.props.actors}/>
        <GameActions leaveHandler={this.props.leaveHandler} />
        <Chat sendMessageHandler={this.props.sendMessageHandler} messages={this.props.messages}/>
      </div>
    );
  }
});