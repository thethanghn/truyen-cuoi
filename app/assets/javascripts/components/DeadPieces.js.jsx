var DeadPieces = React.createClass({
    getDefaultProps: function() {
        return {
            pieces: []
        }
    },
    imagePath: function(piece) {
        return ['/xiangqi/', piece.code, piece.set, '.png'].join('');
    },
    renderPiece: function(piece) {
        var _this = this;
        return (
            <span className="piece">
                <img src={_this.imagePath(piece)}/>
            </span>
        );
    },
    renderPieces: function(pieces) {
        var _this = this;
        return pieces.map(function(piece, index){
            return <li className="dead-piece" key={index}>{_this.renderPiece(piece)}</li>;
        });
    },
    render: function() {
        var _this = this;
        var pieces = this.props.pieces;
        var myPieces = pieces.filter(function(x) { return x.set == 1;});
        var oppPieces = pieces.filter(function(x) { return x.set != 1});
        return (
            <div class="dead-pieces-container">
                <ul className="dead-pieces my-pieces">
                    {this.renderPieces(myPieces)}
                </ul>
                <ul className="dead-pieces opp-pieces">
                    {this.renderPieces(oppPieces)}
                </ul>
            </div>
        );
    }
});