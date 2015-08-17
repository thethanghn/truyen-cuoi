var RoomActors = React.createClass({
    getDefaultProps: function() {
        return {
            actors: []
        }
    },
    renderRole: function(actor) {
        return (<span>
            {actor.isHost ? 'Host' : 'Guest'}
        </span>);
    },
    renderActors: function() {
        var actors = this.props.actors;
        var _this = this;
        return actors.map(function(actor, index){
            return <li key={index}>{_this.renderRole(actor)}: {actor.name}({actor.actorNr}) - {PlayerStatusText[actor.customProperties.status]}</li>;
        });
    },
    render: function() {
        return <ul>
            {this.renderActors()}
        </ul>;
    }
});