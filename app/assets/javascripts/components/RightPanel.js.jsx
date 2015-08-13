var RightPanel = React.createClass({
  getPhase: function() {
    return this.props.gameState.phase;

  },
  getActors: function() {
    return this.props.gameState.actors;
  },
  render: function(){
    var state = this.props.gameState;
    var client = this.props.clientState;
    var phase = state.phase;
    var actors = state.actors;
    return (
      <div className="right-panel">
        <RoomActors actors={state.actors}/>
        <GameActions leaveHandler={this.props.leaveHandler} startHandler={this.props.startHandler} phase={phase} actors={actors} myActorNbr={client.myActorNbr} oppActorNbr={client.oppActorNbr}/>
        <Chat sendMessageHandler={this.props.sendMessageHandler} messages={this.props.messages}/>
      </div>
    );
  }
});