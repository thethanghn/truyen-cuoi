var RoomActors = React.createClass({
    getDefaultProps: function() {
        return {
            actors: []
        }
    },
    renderActors: function() {
        var actors = this.props.actors;
        var _this = this;
        return actors.map(function(actor){
            return <li>{actor.name}({actor.actorNr}) - {actor.customProperties.status}</li>;
        });
    },
    render: function() {
        return <ul>
            {this.renderActors()}
        </ul>;
    }
});