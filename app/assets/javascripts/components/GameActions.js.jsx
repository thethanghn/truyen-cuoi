var GameActions = React.createClass({
  getDefaultProps: function() {
    return {
      phase: 'init'
    };
  },
  _getActor: function(nbr) {
    var actor = false;
    if (nbr > 0) {
      var actors = this.props.actors.filter(function(x) {
        return x.nbr == nbr;
      });
      actor = actors.length > 0 ? actors[0] : false;
    }
    return actor;
  },
  host: function() {
    return this._getActor(this.props.myActorNbr);
  },
  guest: function() {
    return this._getActor(this.props.oppActorNbr);
  },
  leaveHandler: function() {
    this.props.leaveHandler();
  },
  startHandler: function() {
    this.props.startHandler();
  },
  renderInitPhase: function() {
    return (
      <div>
        {this.renderLeaveBtn()}
      </div>
    );
  },
  renderReadyPhase: function() {
    console.log('renderReadyPhase');
    return (
        <div>
          {this.renderStartBtn()}
          {this.renderLeaveBtn()}
        </div>
      );
  },
  renderNotReadyPhase: function() {
    return (
      <div>
        {this.renderDisabledStartBtn()}
        {this.renderLeaveBtn()}
      </div>
    );
  },
  renderOngoingPhase: function() {
    return (
      <div>
        {this.renderDrawBtn()}
        {this.renderResignBtn()}
        {this.renderLeaveBtn()}
      </div>
    );
  },
  renderLeaveBtn: function() {
    return <button className="btn btn-warning btn-leave" onClick={this.leaveHandler}>Leave</button>
  },
  renderStartBtn: function(){
    return <button className="btn btn-info btn-start" onClick={this.startHandler}>Start</button>
  },
  renderDisabledStartBtn: function(){
    return <button className="btn btn-default btn-start" disabled="true">Waiting</button>
  },
  renderDrawBtn: function(){
    return <button className="btn btn-info btn-draw">Ask for Draw</button>
  },
  renderResignBtn: function(){
    return <button className="btn btn-info btn-resign">Resign</button>
  },
  renderPlayerStatus: function() {
    var _this = this;
    var host = this.host();
    var guest = this.guest();
    if (!host) {
      //actor join room event has not fired yet
      return _this.renderInitPhase();
    } else {
      switch (host.status) {
        case PlayerStatus.New:
        case PlayerStatus.JoinedLobby:
          return _this.renderInitPhase();
        case PlayerStatus.JoinedRoom:
        case PlayerStatus.NotReady:
          return _this.renderNotReadyPhase();
        case PlayerStatus.Ready:
          return _this.renderReadyPhase();
        default:
          throw new Error('Unknown player status:' + host.status);
      }
    }
  },
  render: function() {
    var _this = this;
    var phase = this.props.phase;
    return (
      <div className="game-actions">{
          (function(){
            switch(phase) {
              case GamePhase.StandBy:
                return _this.renderPlayerStatus();
                break;
              case GamePhase.OnGoing:
                return _this.renderOngoingPhase();
                break;
              default:
                throw new Error('Unrecognized game phase:' + phase);
            }
          })()
        }
      </div>
    );
  }
});