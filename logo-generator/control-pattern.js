// var element = d3.select('.weareyvr-mark');
// var vis = d3.select('.weareyvr-mark svg');

var height = 100;

var element = d3.select('#canvas-svg');

var cols = d3.select('input[name="cols"]').property('value');
var rows = d3.select('input[name="rows"]').property('value');

for (var i = 0; i < cols * rows; i++) {
  drawMark(element.append("svg"), 100);
}

var downloadCanvas = document.getElementById('canvas');

var sources = getSources(window.document);
downloadCanvas.width = sources[0].width * sources.length;
downloadCanvas.height = sources[0].height;
var ctx = downloadCanvas.getContext('2d');
sources.forEach(function(source, i) {
  var img = new Image();
  img.onload = function() {
    ctx.drawImage(img, i * source.width, 0);
  }
  var url = window.URL.createObjectURL(new Blob(source.source, { "type" : "image/svg+xml" }));
  img.src = url;
  window.URL.revokeObjectURL(url);
});
