
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
