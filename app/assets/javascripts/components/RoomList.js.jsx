var RoomList = React.createClass({
    joinGameHandler: function(ev) {
        var roomId = $(ev.target).data('room');
        if (this.props.joinGameHandler) {
            this.props.joinGameHandler.call(null, roomId);
        }
    },
    renderRooms: function(){
        var rooms = this.props.rooms;
        var self = this;
        return rooms.map(function(room) {
            return <li>{room.title} - <a href="#" data-room={room.id} onClick={self.joinGameHandler}>Join</a></li>;
        });
    },
    renderList: function(){
        return <ul>
            {this.renderRooms()}
        </ul>;
    },
    renderEmpty: function() {
        return <div>No Active Room</div>;
    },
    render: function() {
        return (
            this.props.rooms.length > 0 ? this.renderList() : this.renderEmpty()
            );
    }
});