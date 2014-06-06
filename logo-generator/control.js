var element = d3.select('.weareyvr-mark');
var vis = d3.select('.weareyvr-mark svg');

var height = 100;
var text = 'black';

// Canonical.
// var radius = 50;
// var topLeft = 50;
// var topRight = 50;
// var bottomRight = 0;
// var bottomLeft = 0;
var colour  = '#10988b';

// Randomize.
var radius = Math.floor(Math.random()*101);
var topLeft = Math.floor(Math.random()*101);
var topRight = Math.floor(Math.random()*101);
var bottomRight = Math.floor(Math.random()*101);
var bottomLeft = Math.floor(Math.random()*101);
d3.select('input[name="radius"]').property('value', radius)
d3.select('input[name="topLeft"]').property('value', topLeft)
d3.select('input[name="topRight"]').property('value', topRight)
d3.select('input[name="bottomRight"]').property('value', bottomRight)
d3.select('input[name="bottomLeft"]').property('value', bottomLeft)

var draw = function() {
  // Having troubling finding a nice data driven way to do this, since
  // each arc and line is kind of unique, so just remove all and redraw.
  d3.select('.radius-value').text(radius);
  d3.select('.topLeft-value').text(topLeft);
  d3.select('.topRight-value').text(topRight);
  d3.select('.bottomRight-value').text(bottomRight);
  d3.select('.bottomLeft-value').text(bottomLeft);
  d3.select('.height-value').text(height);
  vis.selectAll('*').remove();
  drawMark(vis, height, text, colour,  radius, topLeft, topRight, bottomRight, bottomLeft);
  document.body.style.backgroundColor = text === 'white' || colour === 'white' ? '#bdcbca' : '#f2f5f5';
};

// Controls
var change = function() {
  eval(this.name + ' = "' + this.value + '"'); // DIRTY!
  // var transition = vis.transition().duration(250);
  // // var delay = function(d, i) { return i * 50; };
  // transition.selectAll(".one")
  //   // .delay(delay)
  //   .attr("transform", "translate(" + one.x + ',' + one.y + ")");
  draw();
};

d3.selectAll('input[name="height"]').on('change', change);
d3.selectAll('input[name="height"]').on('keyup', change);
d3.selectAll('input[type="range"], input[type="radio"]').on('change', change);

d3.selectAll('#reset').on('click', function() {
  radius = 50;
  topLeft = 50;
  topRight = 50;
  bottomRight = 0;
  bottomLeft = 0;
  draw();
});

d3.selectAll('input[type="text"].generate').on('keyup', function() {
  var hashed = hex_md5(this.value);
  var crc = (parseInt(hashed, 16) % 9999999999).toString(); // Get a 10 digit number
  radius = parseInt(crc.slice(0, 2), 10) || 0;
  topLeft = parseInt(crc.slice(2, 4), 10) || 0;
  topRight = parseInt(crc.slice(4, 6), 10) || 0;
  bottomRight = parseInt(crc.slice(6, 8), 10) || 0;
  bottomLeft = parseInt(crc.slice(8, 10), 10) || 0;

  d3.select('input[name="radius"]').property('value', radius)
  d3.select('input[name="topLeft"]').property('value', topLeft)
  d3.select('input[name="topRight"]').property('value', topRight)
  d3.select('input[name="bottomRight"]').property('value', bottomRight)
  d3.select('input[name="bottomLeft"]').property('value', bottomLeft)

  draw();
});

d3.selectAll('#download-svg').on('click', function() {
  var sources = getSources(window.document);
  download(sources[0]);
});

var downloadCanvas = document.createElement('canvas');

// Canvas needs a tick to draw the SVG to canvas, do
// this on hover and then download on click.
d3.selectAll('#download-png').on('mouseover', function() {
  var sources = getSources(window.document);
  downloadCanvas.width = sources[0].width;
  downloadCanvas.height = sources[0].height;
  var ctx = downloadCanvas.getContext('2d');
  var img = new Image();
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
  }
  var url = window.URL.createObjectURL(new Blob(sources[0].source, { "type" : "image/svg+xml" }));
  img.src = url;
  window.URL.revokeObjectURL(url);
});

d3.selectAll('#download-png').on('click', function() {
  var url = downloadCanvas.toDataURL();
  this.href = url;
  this.download = 'WeAreYVR.png';
});

// Difficult to differentiate which browsers work, so we only support Chrome:
// - Safari has a security warning because we're inserting the SVG to the canvas from a blob, which marks the canvas as dirty.
// - Firefox doesn't seem to get the size correct.
if (!navigator.userAgent.match(/chrome/i)) {
  d3.selectAll('#download-png').remove();
  d3.selectAll('#download-use-chrome').classed('show', true);
}

draw();
