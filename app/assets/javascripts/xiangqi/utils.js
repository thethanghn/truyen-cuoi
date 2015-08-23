
function getPieceCls(coords) {
    return ['piece', coords[0], coords[1]].join('-');
}

function getSpotCls(spot) {
    return ['spot', spot[0], spot[1]].join('-');
}

function resetGame() {
    $('.pieces').remove();
    var svg = d3.select('#svg');
    drawPieces(svg);
}

function clearSpotStyle() {
    d3.selectAll('.rect-spot').attr('style', 'stroke-width: 0');
}

function generateNewPiece() {
  var index = Math.floor(Math.random() * Pieces.length);
  var newCode = Pieces.slice(index, 1);
  var arr = [];
  for(var i = 0; i < Pieces.length; i++) {
      if (i != index) {
          arr.push(Pieces[i]);
      } else {
          newCode = Pieces[i];
      }
  }
  return newCode;
}