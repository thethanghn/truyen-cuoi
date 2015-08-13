var RoomActors = React.createClass({
    getDefaultProps: function() {
        return {
            actors: []
        }
    },
    renderActors: function() {
        var actors = this.props.actors;
        console.log('renderActors');
        console.log(actors);
        var _this = this;
        return actors.map(function(actor, index){
            return <li key={index}>{actor.name}({actor.actorNr}) - {actor.customProperties.status}</li>;
        });
    },
    render: function() {
        return <ul>
            {this.renderActors()}
        </ul>;
    }
});