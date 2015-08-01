const PIECE_CODES = ['a', 'c', 'r', 'e', 'g', 'h', 's'];
const LINE_POSITIONS = [
        //rows
        [[0, 0], [8, 0]],
        [[0, 1], [8, 1]],
        [[0, 2], [8, 2]],
        [[0, 3], [8, 3]],
        [[0, 4], [8, 4]],
        [[0, 5], [8, 5] ],
        [[0, 6], [8, 6]],
        [[0, 7], [8, 7]],
        [[0, 8], [8, 8]],
        [[0, 9], [8, 9]],
        //cols
        [[0, 0], [0, 9]],
        [[8, 0], [8, 9]],
        [[1, 0], [1, 4]],
        [[1, 5], [1, 9]],
        [[2, 0], [2, 4]],
        [[2, 5], [2, 9]],
        [[3, 0], [3, 4]],
        [[3, 5], [3, 9]],
        [[4, 0], [4, 4]],
        [[4, 5], [4, 9]],
        [[5, 0], [5, 4]],
        [[5, 5], [5, 9]],
        [[6, 0], [6, 4]],
        [[6, 5], [6, 9]],
        [[7, 0], [7, 4]],
        [[7, 5], [7, 9]],
        //advisor crossing
        [[3, 0], [5, 2]],
        [[3, 2], [5, 0]],
        [[3, 7], [5, 9]],
        [[3, 9], [5, 7]],
    ];
const MESSAGE_EVENT = 1,
    GAME_EVENT = 2
;



var Game = function(container, settings) {
    var W = container.width();
    var columns = 9;
    var rows = 10;
    var pieceSize = Math.floor(60 * W / 800);
    var colHeight = Math.floor(W/columns);
    var rowHeight = Math.floor(W/rows);
    this.settings = $.extend({
        width: 800,
        height: 800,
        columns: columns,
        rows: rows,
        pieceSize: pieceSize,
        colHeight: colHeight,
        rowHeight: rowHeight
    }, settings);

    var _this = this;
    this.state = {
        phase: 'init',
        hasEnoughPlayers: false,
        ongoing: false,
        actors: [],
        messages: [],
        leaveHandler: function() {
            _this.leave();
        },
        sendMessageHandler: function(message) {
            console.log('sendMessageHandler');
            _this.photonClient.sendMessage(message);
        }
    };
    this.data = this.getInitialPiece();
    this.svg = d3.select(this.settings.canvasElement).attr({width: this.settings.width, height: this.settings.height});

    this.photonClient = new MysteryXiangqiClient(this, this.settings);
};

Game.prototype.pushMessage = function(actor, message) {
    this.state.messages.push({actor: actor.name, text: message});

    renderScreen();
}

Game.prototype.startClient = function() {
    this.photonClient.start();
}

Game.prototype.render = function() {
    
    this.initResources();

    this.drawLines();

    this.drawSpots();

    this.drawPieces();

    this.attachHandlers();
}


Game.prototype.leave = function() {
    console.log('leave');
    // when a player want to leave, if the game is not finished yet, we should confirm that it means he loses the game, if he agrees then he can leave
    if (this.state.ongoing) {
        var ok = confirm('The game is ongoing, if you leave, you will lose this game');
        if (ok) {
            raiseEvent('he loses');
        } else {
            //nothing happens
        }
    } else {
        this.goToLobby();
    }
}

Game.prototype.getInitialPiece = function() {
    return [
        { coords: [0, 0], code: 'r', set: 1, id: 'r-1-1' },
        { coords: [1, 0], code: 'h', set: 1, id: 'h-1-2' },
        { coords: [2, 0], code: 'e', set: 1, id: 'e-1-3' },
        { coords: [3, 0], code: 'a', set: 1, id: 'a-1-4' },
        { coords: [4, 0], code: 'g', set: 1, id: 'g-1-5' },
        { coords: [5, 0], code: 'a', set: 1, id: 'a-1-6' },
        { coords: [6, 0], code: 'e', set: 1, id: 'e-1-7' },
        { coords: [7, 0], code: 'h', set: 1, id: 'h-1-8' },
        { coords: [8, 0], code: 'r', set: 1, id: 'r-1-9' },
        { coords: [1, 2], code: 'c', set: 1, id: 'c-1-10' },
        { coords: [7, 2], code: 'c', set: 1, id: 'c-1-11' },
        { coords: [0, 3], code: 's', set: 1, id: 's-1-12' },
        { coords: [2, 3], code: 's', set: 1, id: 's-1-13' },
        { coords: [4, 3], code: 's', set: 1, id: 's-1-14' },
        { coords: [6, 3], code: 's', set: 1, id: 's-1-15' },
        { coords: [8, 3], code: 's', set: 1, id: 's-1-16' },
        { coords: [0, 9], code: 'r', set: 2, id: 'r-2-17' },
        { coords: [1, 9], code: 'h', set: 2, id: 'h-2-18' },
        { coords: [2, 9], code: 'e', set: 2, id: 'e-2-19' },
        { coords: [3, 9], code: 'a', set: 2, id: 'a-2-20' },
        { coords: [4, 9], code: 'g', set: 2, id: 'g-2-21' },
        { coords: [5, 9], code: 'a', set: 2, id: 'a-2-22' },
        { coords: [6, 9], code: 'e', set: 2, id: 'e-2-23' },
        { coords: [7, 9], code: 'h', set: 2, id: 'h-2-24' },
        { coords: [8, 9], code: 'r', set: 2, id: 'r-2-25' },
        { coords: [1, 7], code: 'c', set: 2, id: 'c-2-26' },
        { coords: [7, 7], code: 'c', set: 2, id: 'c-2-27' },
        { coords: [0, 6], code: 's', set: 2, id: 's-2-28' },
        { coords: [2, 6], code: 's', set: 2, id: 's-2-29' },
        { coords: [4, 6], code: 's', set: 2, id: 's-2-30' },
        { coords: [6, 6], code: 's', set: 2, id: 's-2-31' },
        { coords: [8, 6], code: 's', set: 2, id: 's-2-32' }
    ];
}

Game.prototype.initResources = function() {
    var svg = this.svg;
    var defs = svg.append("defs");
    for(var j = 1; j <= 2; j++) {
        for(var i = 0; i < PIECE_CODES.length; i++) {
            var code = PIECE_CODES[i];
            var path = ['/xiangqi/', code, j, '.png'].join('');
            var pattern = defs.append("pattern")
                    .attr({ id: ["img", code, j].join(''), width: this.settings.pieceSize, height: this.settings.pieceSize, patternUnits:"userSpaceOnUse"})
                    .append("svg:image")
                    .attr("xlink:href", path)
                    .attr("width", this.settings.pieceSize)
                    .attr("height", this.settings.pieceSize)
                    .attr("x", 0)
                    .attr("y", 0);
        }
    }
}

Game.prototype.drawLines = function() {
    var svg = this.svg;
    var lines = svg.append('g').attr({width: this.settings.width, height: this.settings.height});
    for(var i = 0; i < LINE_POSITIONS.length; i++) {
        var pair = LINE_POSITIONS[i];
        var point1 = pair[0];
        var point2 = pair[1];
        lines.append('line')
            .attr('x1', this.settings.colHeight * point1[0] + this.settings.pieceSize / 2)
            .attr('y1', 2 + this.settings.rowHeight * point1[1] + this.settings.pieceSize / 2)
            .attr('x2', this.settings.colHeight * point2[0] + this.settings.pieceSize / 2)
            .attr('y2', 2 + this.settings.rowHeight * point2[1] + this.settings.pieceSize / 2)
            .attr('style', 'stroke: #000; stroke-width: 1');
    }
}

Game.prototype.drawSpots = function() {
    var svg = this.svg;
    var blankSpots = svg.append('g').attr({width: this.settings.width, height: this.settings.height});
    var spots = [];
    for(var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            spots.push([i, j]);
        }
    }
    var _this = this;
    blankSpots.selectAll('.spot')
                .data(spots)
                .enter()
                .append('rect')
                .attr('class', function(d) { return 'rect-spot ' + getSpotCls(d)})
                .attr('transform', function(d) { return _this.translateFromPosition(d);})
                .attr('width', this.settings.pieceSize)
                .attr('height', this.settings.pieceSize)
                .attr('fill', '#fff')
                .attr('fill-opacity', 0)
                .on('mouseover', function() {
                    d3.select(this).attr('style', 'stroke-width: 1px; stroke: yellow;');
                })
                .on('mouseout', function() {
                    d3.select(this).attr('style', 'stroke-width: 0;');  
                })
                .on('click', function() {
                    console.log('blankspot clicked');
                });
}

Game.prototype.drawPieces = function() {
    var svg = this.svg;
    var pieces = svg.append('g').attr({width: this.settings.width, height: this.settings.height})
        .attr('class', 'pieces')
        .attr('background-color', 'red');
    var _this = this;
    pieces.selectAll('.piece')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('class', function(d) { return 'rect-piece ' + d.id })
        .attr('transform', function(d) { return _this.translateFromPosition(d.coords)})
        .attr('width', this.settings.pieceSize)
        .attr('height', this.settings.pieceSize)
        .attr('fill', function(d) { return 'url(#img' + [d.code, d.set].join('') + ')';});

}

Game.prototype.attachHandlers = function() {
    var self = this;
    var pieceClickSource = Rx.Observable.fromEvent($('.rect-piece'), 'click');
    pieceClickSourceSubscriber = pieceClickSource.subscribe(
        function(x) {
            clearSpotStyle();
            var ele = d3.select(x.target);
            var pieceData = ele.data()[0];
            ele.attr('style', 'stroke:darkblue;stroke-width:1');
            onMovePiece = pieceData;
            MoveChecker.highlightMoves(pieceData);
        },
        function(e) { console.log('error on piece click');},
        function() { console.log('comleted');}
    );

    var spotClickSource = Rx.Observable.fromEvent($('.rect-spot'), 'click');
    spotClickSourceSubscriber = spotClickSource.subscribe(
        function(x) {
            console.log('spot clicked');
            var spotData = d3.select(x.target).data()[0];
            console.log(spotData);
            if (onMovePiece && MoveChecker.canMove(onMovePiece, spotData)) {
                Game.movePiece(onMovePiece, spotData);
                //send it to client
                demo.raiseEvent(GAME_EVENT, {gameState: this.data }, { cache: Photon.LoadBalancing.Constants.EventCaching.ReplaceCache });
                Game.resetPiece();
            }
        },
        function(e) { console.log('error on piece click');},
        function() { console.log('comleted');}
    );
}



function getPieceCls(coords) {
    return ['piece', coords[0], coords[1]].join('-');
}

function getSpotCls(spot) {
    return ['spot', spot[0], spot[1]].join('-');
}

Game.prototype.xyFromPosition = function(coords) {
    c0 = Player.host ? coords[0] : COLUMNS - coords[0] - 1;
    c1 = Player.host ? coords[1] : ROWS - coords[1] - 1;
    // c0 = coords[0];
    // c1 = coords[1];
    x = this.settings.colHeight * c0;
    y = this.settings.rowHeight * c1;
    return [x, y];
}

Game.prototype.translateFromPosition = function(coords) {
    var xy = this.xyFromPosition(coords);
    return ['translate(', xy[0], ',', xy[1] , ')'].join('');
}

function resetGame() {
    $('.pieces').remove();
    var svg = d3.select('#svg');
    drawPieces(svg);
}

function clearSpotStyle() {
    d3.selectAll('.rect-spot').attr('style', 'stroke-width: 0');
}

var MoveChecker = (function(){

    var self = this;

    this._hasPieceAt = function(spot) {
        var b = this.data.filter(function(p) {
            return p.coords[0] == spot[0] && p.coords[1] == spot[1];
        });
        return b.length > 0;
    }

    this._isOccupiedSpot = function(spot, set) {
        var occupied = this.data.filter(function(piece) {
            return piece.coords[0] == spot[0] && piece.coords[1] == spot[1] && piece.set == set;
        });

        return occupied.length > 0;
    }

    this._isOutOfBound = function(spot) {
        return spot[0] < 0 || spot[0] > 8 || spot[1] < 0 || spot[1] > 9;
    }

    //some pieces have restriction
    this._isBlocked = function(spot, piece) {
        var result = false;
        switch(piece.code) {
            case 'h':
                //check each direction for blocking
                var toFind = null;
                //right
                if (spot[0] == piece.coords[0] + 1 || spot[0] == piece.coords[0] - 1) { //left
                    //top
                    if (spot[1] == piece.coords[1] - 2) {
                        toFind = [piece.coords[0], piece.coords[1] - 1];
                    } else { //bottom
                        toFind = [piece.coords[0], piece.coords[1] + 1];
                    }
                } else if (spot[1] == piece.coords[1] - 1 || spot[1] == piece.coords[1] + 1) {
                    if (spot[0] == piece.coords[0] + 2) {
                        toFind = [piece.coords[0] + 1, piece.coords[1]];
                    } else {
                        toFind = [piece.coords[0] - 1, piece.coords[1]];
                    }
                }

                if (toFind) {
                    result = self._hasPieceAt(toFind);
                }
            break;

            case 'c':
                //find the pieces in the middle
                var hasPiece = self._hasPieceAt(spot);
                var length = 0;
                //top
                if (spot[1] < piece.coords[1]) {
                    var res = this.data.filter(function(p) {
                        return p.coords[0] == piece.coords[0] &&  p.coords[1] > spot[1] && p.coords[1] < piece.coords[1];
                    });

                    length = res.length;
                } else if (spot[1] > piece.coords[1]) {
                    var res = this.data.filter(function(p) {
                        return p.coords[0] == piece.coords[0] &&  p.coords[1] > piece.coords[1] && p.coords[1] < spot[1];
                    });

                    length = res.length;
                } else if (spot[0] < piece.coords[0]) {
                    var res = this.data.filter(function(p) {
                        return p.coords[1] == piece.coords[1] &&  p.coords[0] > spot[0] && p.coords[0] < piece.coords[0];
                    });

                    length = res.length;
                } else if (spot[0] > piece.coords[0]) {
                    var res = this.data.filter(function(p) {
                        return p.coords[1] == piece.coords[1] &&  p.coords[0] > piece.coords[0] && p.coords[0] < spot[0];
                    });

                    length = res.length;
                }

                result =  (!hasPiece && res.length > 0) || (hasPiece && res.length != 1);
            break;

            case 'r':
                var length = 0;
                //top
                if (spot[1] < piece.coords[1]) {
                    var res = this.data.filter(function(p) {
                        return p.coords[0] == piece.coords[0] &&  p.coords[1] > spot[1] && p.coords[1] < piece.coords[1];
                    });

                    length = res.length;
                } else if (spot[1] > piece.coords[1]) {
                    var res = this.data.filter(function(p) {
                        return p.coords[0] == piece.coords[0] &&  p.coords[1] > piece.coords[1] && p.coords[1] < spot[1];
                    });

                    length = res.length;
                } else if (spot[0] < piece.coords[0]) {
                    var res = this.data.filter(function(p) {
                        return p.coords[1] == piece.coords[1] &&  p.coords[0] > spot[0] && p.coords[0] < piece.coords[0];
                    });

                    length = res.length;
                } else if (spot[0] > piece.coords[0]) {
                    var res = this.data.filter(function(p) {
                        return p.coords[1] == piece.coords[1] &&  p.coords[0] > piece.coords[0] && p.coords[0] < spot[0];
                    });

                    length = res.length;
                }

                result =  length > 0;
            break;

            case 'e':
                var toFind = null;
                //top
                if (spot[0] < piece.coords[0]) {
                    if (spot[1] < piece.coords[1]) {
                        toFind = [piece.coords[0] - 1, piece.coords[1] - 1];
                    } else {
                        toFind = [piece.coords[0] - 1, piece.coords[1] + 1];
                    }
                } else {
                    if (spot[1] < piece.coords[1]) {
                        toFind = [piece.coords[0] + 1, piece.coords[1] - 1];
                    } else {
                        toFind = [piece.coords[0] + 1, piece.coords[1] + 1];
                    }
                }

                result =  self._hasPieceAt(toFind);
            break;

            case 'g':
                if (piece.set == 1) {
                    result = spot[0] < 3 || spot[0] > 5 || spot[1] < 0 || spot[1] > 2;
                } else {
                    result = spot[0] < 3 || spot[0] > 5 || spot[1] < 7 || spot[1] > 9;
                }
            break;
        }
        return result;
    }

    this.soldierMoves = function(piece) {
        var coords = piece.coords;
        var spots = [];
        
        //only go down 1 step
        var y = coords[1];
        if (piece.set == 1) {
            if (y < 9) {
                spots.push([coords[0], y + 1]);
            }
            if (y > 4) {
                var x = coords[0];
                
                spots.push([x - 1, y]);
                spots.push([coords[0] + 1, y]);
            }
        } else {
            if (y > 0) {
                spots.push([coords[0], y - 1]);
            }
            if (y < 5) {
                var x = coords[0];
                spots.push([x - 1, y]);
                spots.push([coords[0] + 1, y]);
            }
        }
        return spots;
    }

    this.horseMoves = function(piece){
        var coords = piece.coords;
        var spots = [];
        
        //horse can move 8 ways
        //top
        spots.push([coords[0] - 1, coords[1] - 2]);
        spots.push([coords[0] + 1, coords[1] - 2]);
        //right
        spots.push([coords[0] + 2, coords[1] - 1]);
        spots.push([coords[0] + 2, coords[1] + 1]);
        //down
        spots.push([coords[0] - 1, coords[1] + 2]);
        spots.push([coords[0] + 1, coords[1] + 2]);
        //left
        spots.push([coords[0] - 2, coords[1] - 1]);
        spots.push([coords[0] - 2, coords[1] + 1]);
        
        return spots;
    }

    this.cannonMoves = function(piece) {
        var coords = piece.coords;
        var spots = [];
        
        //cannon can move left and right
        for (var i = 0; i < 9; i++) {
            if (i != coords[0]) {
                spots.push([i, coords[1]]);
            }
        }
        //cannon can move up and down
        for (var i = 0; i < 10; i++) {
            if (i != coords[1]) {
                spots.push([coords[0], i]);
            }
        }
        
        return spots;
    }

    this.rookMoves = function(piece) {
        //rook moves almost the same
        return self.cannonMoves(piece);
    }

    this.elephantMoves = function(piece) {
        var coords = piece.coords;
        var spots = [];
        
        //elephant can move 4 ways
        spots.push([coords[0] - 2, coords[1] - 2]);
        spots.push([coords[0] - 2, coords[1] + 2]);
        spots.push([coords[0] + 2, coords[1] - 2]);
        spots.push([coords[0] + 2, coords[1] + 2]);
        
        return spots;
    }

    this.advisorMoves = function(piece) {
        var coords = piece.coords;
        var spots = [];
        
        //elephant can move 4 ways
        spots.push([coords[0] - 1, coords[1] - 1]);
        spots.push([coords[0] - 1, coords[1] + 1]);
        spots.push([coords[0] + 1, coords[1] - 1]);
        spots.push([coords[0] + 1, coords[1] + 1]);
        
        return spots;
    }

    this.generalMoves = function(piece) {
        var coords = piece.coords;
        var spots = [];
        
        //elephant can move 4 ways
        spots.push([coords[0] - 1, coords[1]]);
        spots.push([coords[0] + 1, coords[1]]);
        spots.push([coords[0], coords[1] - 1]);
        spots.push([coords[0], coords[1] + 1]);
        
        return spots;
    }

    this.possibleMoves = function(piece) {
        console.log('possibleMoves');
        var spots = [];
        switch(piece.code) {
            case 's':
                spots = self.soldierMoves(piece);
                break;
            case 'h':
                spots = self.horseMoves(piece);
                break;
            case 'c':
                spots = self.cannonMoves(piece);
                break;
            case 'r':
                spots = self.rookMoves(piece);
                break;
            case 'e':
                spots = self.elephantMoves(piece);
                break;
            case 'a':
                spots = self.advisorMoves(piece);
                break;
            case 'g':
                spots = self.generalMoves(piece);
                break;
        }

        console.log(spots);

        spots = spots.filter(function(spot) { return !self._isOutOfBound(spot);});
        spots = spots.filter(function(spot) { return !self._isOccupiedSpot(spot, piece.set);});
        spots = spots.filter(function(spot) { return !self._isBlocked(spot, piece)});
        return spots;
    }

    this.highlightMoves = function(piece) {
        console.log('highlightMoves');
        var moves = self.possibleMoves(piece);
        for(var i = 0; i < moves.length; i++) {
            var m = moves[i];
            var ele = d3.select('.' + getSpotCls(m));
            ele.attr('style', 'stroke:green;stroke-width:1');
        }
    }

    this.canMove = function(piece, spot) {
        var spots = self.possibleMoves(piece);
        return spots.filter(function(d){ return d[0] == spot[0] && d[1] == spot[1]; }).length > 0;
    }

    return {
        highlightMoves: highlightMoves,
        canMove: canMove
    }
})();

Game.prototype.findD3Piece = function(id) {
    return d3.select('.' + id);
};

Game.prototype.resetPiece = function() {
    if (onMovePiece) {
        var ele = self.findD3Piece(onMovePiece.id);
        ele.attr('style', 'stroke:0;');
        onMovePiece = null;
    }
};

Game.prototype.movePiece = function(piece, spot) {
    // var ele = self.findD3Piece(piece.id);
    //update the coords
    piece.coords = spot;
    // ele.transition().attr('transform', translateFromPosition(spot));
    self.refresh();
    clearSpotStyle();
};

Game.prototype.refresh = function() {
    var _this = this;
    this.data.forEach(function(piece) {
        var ele = self.findD3Piece(piece.id);
        ele.transition().attr('transform', _this.translateFromPosition(piece.coords));
    });
}

Game.prototype.loadState = function(state) {
    this.data = state;
    self.refresh();
}

Game.prototype.opponentMoveHandler = function(content) {
    console.log('opponentMoveHandler');
    var gameState = content.gameState;
    console.log(gameState);
    self.loadState(gameState);
}

Game.prototype.getState = function() {
    return this.state;
}

Game.prototype.setPhase = function(phase, params) {
    params = params || {};
    params.phase = phase;
    switch(phase) {
        case 'init':
            break;
        case 'waiting':
            console.log('waiting');
            this.state = $.extend(this.state, params);
            var _this = this;
            $.post(this.settings.initRoomUrl, {join_token: this.state.joinToken});
            $('.progress').fadeOut(function() {
                $('#svg').fadeIn(function(){
                    _this.render();
                });
            });
            break;
        case 'ready':
            this.state = $.extend(this.state, params);
            break;
    }

    renderScreen();
}

Game.prototype.updateProgress = function(pct) {
    $('.progress .progress-bar').css('width', pct + '%');
}

Game.prototype.goToLobby = function(msg) {
    if (msg) {
        alert(msg);
    }
    window.location.href = this.settings.lobbyUrl;
}

Game.prototype.handlePhotonError = function(errorCode, errorMsg) {
    var _this = this;
    $.post(this.settings.roomErrorUrl,
        { error: { errorCode: errorCode, errorMsg: errorMsg } })
    .always(function(){
        _this.goToLobby('Game ended due to error: ' + errorMsg);
    });
}