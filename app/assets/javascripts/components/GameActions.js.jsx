var GameActions = React.createClass({
  getDefaultProps: function() {
    return {
      phase: 'init'
    };
  },
  leaveHandler: function() {
    this.props.leaveHandler();
  },
  renderInitPhase: function() {
    return (
      <div>
        {this.renderLeaveBtn()}
      </div>
    );
  },
  renderWaitingPhase: function() {
    return (
      <div>
        {this.renderDrawBtn()}
        {this.renderResignBtn()}
        {this.renderLeaveBtn()}
      </div>
    );
  },
  renderOngoingPhase: function() {
    return (
      <div>
        {this.renderStartBtn()}
        {this.renderLeaveBtn()}
      </div>
    );
  },
  renderLeaveBtn: function() {
    return <button className="btn btn-default btn-leave" onClick={this.leaveHandler.bind(this)}>Leave</button>
  },
  renderStartBtn: function(){
    return <button className="btn btn-default btn-start">Start</button>
  },
  renderDrawBtn: function(){
    return <button className="btn btn-default btn-draw">Ask for Draw</button>
  },
  renderResignBtn: function(){
    return <button className="btn btn-default btn-resign">Resign</button>
  },
  render: function() {
    var _this = this;
    return (
      <div className="game-actions">{
          (function(){
            switch(_this.props.phase) {
              case 'init':
                return _this.renderInitPhase();
              case 'waiting':
                return _this.renderWaitingPhase();
              case 'ongoing':
                return _this.renderOngoingPhase();
              default:
                return '';
            }
          })()
        }
      </div>
    );
  }
});