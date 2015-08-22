var MoveChecker = function(game){
    this.game = game;
    var self = this;

    this.data = function() {
        return self.game.state.gameState.data;
    }

    this._hasPieceAt = function(spot) {
        var b = this.data().filter(function(p) {
            return p.coords[0] == spot[0] && p.coords[1] == spot[1];
        });
        return b.length > 0;
    }

    this._isOccupiedSpot = function(spot, set) {
        var occupied = this.data().filter(function(piece) {
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
                    var res = this.data().filter(function(p) {
                        return p.coords[0] == piece.coords[0] &&  p.coords[1] > spot[1] && p.coords[1] < piece.coords[1];
                    });

                    length = res.length;
                } else if (spot[1] > piece.coords[1]) {
                    var res = this.data().filter(function(p) {
                        return p.coords[0] == piece.coords[0] &&  p.coords[1] > piece.coords[1] && p.coords[1] < spot[1];
                    });

                    length = res.length;
                } else if (spot[0] < piece.coords[0]) {
                    var res = this.data().filter(function(p) {
                        return p.coords[1] == piece.coords[1] &&  p.coords[0] > spot[0] && p.coords[0] < piece.coords[0];
                    });

                    length = res.length;
                } else if (spot[0] > piece.coords[0]) {
                    var res = this.data().filter(function(p) {
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
                    var res = this.data().filter(function(p) {
                        return p.coords[0] == piece.coords[0] &&  p.coords[1] > spot[1] && p.coords[1] < piece.coords[1];
                    });

                    length = res.length;
                } else if (spot[1] > piece.coords[1]) {
                    var res = this.data().filter(function(p) {
                        return p.coords[0] == piece.coords[0] &&  p.coords[1] > piece.coords[1] && p.coords[1] < spot[1];
                    });

                    length = res.length;
                } else if (spot[0] < piece.coords[0]) {
                    var res = this.data().filter(function(p) {
                        return p.coords[1] == piece.coords[1] &&  p.coords[0] > spot[0] && p.coords[0] < piece.coords[0];
                    });

                    length = res.length;
                } else if (spot[0] > piece.coords[0]) {
                    var res = this.data().filter(function(p) {
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
};