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
        // clientState: settings.clientState,
        gameState: settings.gameState,
        leaveHandler: function() {
            _this.leave();
        },
        startHandler: function() {
            _this.photonClient.myActorReady();
        },
        sendMessageHandler: function(message) {
            console.log('sendMessageHandler');
            _this.photonClient.sendMessage(message);
        }
    };
    this.svg = d3.select(this.settings.canvasElement).attr({width: this.settings.width, height: this.settings.height});

    this.photonClient = new MysteryXiangqiClient(this, this.settings);
    this.moveChecker = new MoveChecker(this);
    this.onMovePiece = null;
    this.ready = false;
    this.rendered = false;
};

Game.prototype.data = function() {
    return this.state.gameState.data;
}

Game.prototype.pushMessage = function(actor, message) {
    this.state.gameState.messages.push({actor: actor.name, text: message});

    renderScreen();
}

Game.prototype.startClient = function() {
    this.photonClient.start();
}

Game.prototype.render = function() {
    if (!this.ready) return;
    if (!this.rendered) {
        this.initResources();

        this.drawLines();

        this.rendered = true;
    }

    this.drawSpots();

    this.drawPieces();

    // this.attachHandlers();
}


Game.prototype.leave = function() {
    console.log('leave');
    // when a player want to leave, if the game is not finished yet, we should confirm that it means he loses the game, if he agrees then he can leave
    if (this.state.phase == 'ongoing') {
        var ok = confirm('The game is ongoing, if you leave, you will lose this game');
        if (ok) {
            this.photonClient.myActorResign();
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
    blankSpots.selectAll('.rect-spot').remove();
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
                    console.log('spot clicked');
                    var spotData = d3.select(this).data()[0];
                    console.log(spotData);
                    if (_this.onMovePiece && _this.moveChecker.canMove(_this.onMovePiece, spotData)) {
                        _this.movePiece(_this.onMovePiece, spotData);
                        //send it to client
                        _this.synchState();
                        _this.resetPiece();
                    }
                });
}

Game.prototype.drawPieces = function() {
    var svg = this.svg;
    var pieces = svg.append('g').attr({width: this.settings.width, height: this.settings.height})
        .attr('class', 'pieces')
        .attr('background-color', 'red');
    var _this = this;
    var data = this.data().filter(function(x) { return x.coords[1] >= 0;});
    pieces.selectAll('.piece')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function(d) { return 'rect-piece ' + d.id })
        .attr('transform', function(d) { return _this.translateFromPosition(d.coords)})
        .attr('width', this.settings.pieceSize)
        .attr('height', this.settings.pieceSize)
        .attr('fill', function(d) { return 'url(#img' + [d.code, d.set].join('') + ')';})
        .on('click', function(x){
            clearSpotStyle();
            var ele = d3.select(this);
            var pieceData = ele.data()[0];
            if (_this.onMovePiece) {
                //check if it is different set
                if (_this.onMovePiece.set != pieceData.set) {
                    var temp = pieceData.coords.slice();
                    var pieceToDelete = _this.data().filter(function(x) { return x.id == pieceData.id;})[0];
                    pieceToDelete.coords[1] = 10;
                    _this.movePiece(_this.onMovePiece, temp);
                    ele.remove();
                    //send it to client
                    _this.synchState();
                    _this.resetPiece();
                    renderScreen();
                    return;
                }
            }
                
            ele.attr('style', 'stroke:darkblue;stroke-width:1');
            _this.onMovePiece = pieceData;
            _this.moveChecker.highlightMoves(pieceData);
        });
}

Game.prototype.updatePieces = function() {
    var svg = this.svg;
    var pieces = svg.selectAll('.rect-piece').remove();
    this.drawPieces();
}

// Game.prototype.attachHandlers = function() {
//     var self = this;

//     var pieceClickSource = Rx.Observable.fromEvent($('.rect-piece'), 'click');
//     pieceClickSourceSubscriber = pieceClickSource.subscribe(
//         function(x) {
//             clearSpotStyle();
//             var ele = d3.select(x.target);
//             var pieceData = ele.data()[0];
//             ele.attr('style', 'stroke:darkblue;stroke-width:1');
//             onMovePiece = pieceData;
//             MoveChecker.highlightMoves(pieceData);
//         },
//         function(e) { console.log('error on piece click');},
//         function() { console.log('comleted');}
//     );

//     var spotClickSource = Rx.Observable.fromEvent($('.rect-spot'), 'click');
//     spotClickSourceSubscriber = spotClickSource.subscribe(
//         function(x) {
//             console.log('spot clicked');
//             var spotData = d3.select(x.target).data()[0];
//             console.log(spotData);
//             if (onMovePiece && MoveChecker.canMove(onMovePiece, spotData)) {
//                 Game.movePiece(onMovePiece, spotData);
//                 //send it to client
//                 demo.raiseEvent(GAME_EVENT, {gameState: this.state.gameState }, { cache: Photon.LoadBalancing.Constants.EventCaching.ReplaceCache });
//                 Game.resetPiece();
//             }
//         },
//         function(e) { console.log('error on piece click');},
//         function() { console.log('comleted');}
//     );
// }



function getPieceCls(coords) {
    return ['piece', coords[0], coords[1]].join('-');
}

function getSpotCls(spot) {
    return ['spot', spot[0], spot[1]].join('-');
}

Game.prototype.getMyActor = function() {
    return this.state.gameState.actors[this.settings.myName] || { actorNr: -1 };
}

Game.prototype.xyFromPosition = function(coords) {
    var host = this.getMyActor().actorNr > 0 && this.getMyActor().actorNr == this.state.gameState.hostJoinToken ? true: false;
    c0 = host ? coords[0] : this.settings.columns - coords[0] - 1;
    c1 = host ? coords[1] : this.settings.rows - coords[1] - 1;
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

Game.prototype.findD3Piece = function(id) {
    return d3.select('.' + id);
};

Game.prototype.resetPiece = function() {
    if (this.onMovePiece) {
        var ele = this.findD3Piece(this.onMovePiece.id);
        ele.attr('style', 'stroke:0;');
        this.onMovePiece = null;
    }
};

Game.prototype.movePiece = function(piece, spot) {
    console.log('movePiece');
    // var ele = self.findD3Piece(piece.id);
    //update the coords
    piece.coords = spot;
    // ele.transition().attr('transform', translateFromPosition(spot));
    this.redraw();
    clearSpotStyle();
};

Game.prototype.redraw = function() {
    var _this = this;
    this.data().forEach(function(piece) {
        var ele = _this.findD3Piece(piece.id);
        ele.transition().attr('transform', _this.translateFromPosition(piece.coords));
    });
}

// Game.prototype.loadState = function(state) {
//     this.data() = state;
//     self.refresh();
// }

// Game.prototype.opponentMoveHandler = function(content) {
//     console.log('opponentMoveHandler');
//     var gameState = content.gameState;
//     console.log(gameState);
//     self.loadState(gameState);
// }

Game.prototype.getState = function() {
    return this.state;
}

Game.prototype.openRoom = function(joinToken) {
    this.state.gameState.hostJoinToken = joinToken;
    $.post(this.settings.initRoomUrl, {join_token: joinToken});
    // window.MyInfo.nbr = joinToken;
}

Game.prototype.setPhase = function(phase, params) {
    console.log('setPhase: ' + phase);
    params = params || {};
    switch(phase) {
        case 'init':
            break;
        case 'joined':
            var _this = this;
            $('.progress').fadeOut(function() {
                $('#svg').fadeIn(function(){
                    _this.render();
                });
            });
            break;
        case 'not_ready':
            break;
        case 'ready':
            break;
        case 'ongoing':
            break;
    }

    this.state = $.extend(this.state, params);
    this.state.phase = phase;

    renderScreen();
}

Game.prototype.refresh = function() {
    // var state = this.state;
    // state.gameState.actors = this.photonClient.getActors().map(function(x) {
    //     x.isHost = x.actorNr == state.gameState.hostJoinToken;
    //     return x;
    // });
    renderScreen();
    if (this.ready && this.rendered) {
        this.updatePieces();
    }
}

// Game.prototype.setJoinToken = function(joinToken) {
//     this.state.clientState.myActorNbr = joinToken;
// }

Game.prototype.renderCanvas = function() {
    var _this = this;
    $('.progress').fadeOut(function() {
        $('#svg').fadeIn(function(){
            _this.ready = true;
            _this.render();
        });
    });
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

Game.prototype.checkIfUsersReady = function() {
    var actors = this.state.actors;
    var readyActors = actors.filter(function(x) { return x.customProperties.status == 'ready' });
    if (readyActors.length == actors.length) {
        this.setPhase('ongoing');
    } else {
        this.setPhase('not_ready');
    }
}

Game.prototype.synchState = function() {
    this.photonClient.syncState();
}