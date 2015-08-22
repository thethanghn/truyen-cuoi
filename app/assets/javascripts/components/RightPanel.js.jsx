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
    var actors = [];
    for(var key in state.actors) {
      actors.push(state.actors[key]);
    }

    var pieces = this.props.gameState.data.filter(function(x) {
      return x.coords[1] < 0 || x.coords[1] > 9;
    }).slice();

    return (
      <div className="right-panel">
        <DeadPieces pieces={pieces}/>
        <RoomActors actors={actors}/>
        <GameActions leaveHandler={this.props.leaveHandler} startHandler={this.props.startHandler} phase={phase} actors={actors} />
        <Chat sendMessageHandler={this.props.sendMessageHandler} messages={this.props.messages}/>
      </div>
    );
  }
});