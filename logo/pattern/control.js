// var element = d3.select('.weareyvr-mark');
// var vis = d3.select('.weareyvr-mark svg');
var height = 100;
var colours = [
  "wr-spruce",
  "wr-red",
  "wr-pink",
  "wr-orange",
  "wr-green",
  "wr-blue",
  "wr-purple",
  "wr-brown",
];

function draw() {
  var scale = height/100;
  var paddingCol = scale * 50;
  var paddingRow = paddingCol * 619/378; // Magic number to get vertical padding close to horizontal padding.
  var element = d3.select('#canvas-svg');
  element.selectAll('*').remove();

  var cols = parseInt(d3.select('input[name="cols"]').property('value'));
  var rows = parseInt(d3.select('input[name="rows"]').property('value'));

  for (var i = 0; i < cols * rows; i++) {
    drawMark(element.append("svg"), height, 'none', colours[Math.floor(Math.random()*colours.length)]);
  }

  var downloadCanvas = document.getElementById('canvas');

  var scaleSize = height/500;
  var widthSize = height * 0.95;
  var sources = getSources(window.document, Math.ceil(widthSize + (635-475)*scaleSize), parseInt(height,10));
  downloadCanvas.width = (sources[0].width + paddingCol) * cols;
  downloadCanvas.height = (sources[0].height + paddingRow) * rows;
  var ctx = downloadCanvas.getContext('2d');
  // var ctxbg = document.getCSSCanvasContext("2d", "pattern", downloadCanvas.width, downloadCanvas.height);
  ctx.clearRect(0,0,sources[0].width*cols, sources[0].height*rows);
  // ctxbg.clearRect(0,0,downloadCanvas.width, downloadCanvas.height);
  var currentRow = 0;
  var currentCol = 0;
  sources.forEach(function(source) {
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, currentCol * (source.width + paddingCol) + paddingCol/2, currentRow * (source.height + paddingRow) + paddingRow/2);
      // ctxbg.drawImage(img, currentCol * (source.width + paddingCol) + paddingCol/2, currentRow * (source.height + paddingRow) + paddingRow/2);
      currentRow++;
      if (currentRow % rows === 0) {
        currentRow = 0;
        currentCol++;
      }
    }
    var url = window.URL.createObjectURL(new Blob(source.source, { "type" : "image/svg+xml" }));
    img.src = url;
    window.URL.revokeObjectURL(url);
  });
}

d3.selectAll('#reshuffle').on('click', function() {
  draw();
});

d3.selectAll('#download-png').on('click', function() {
  var url = document.getElementById('canvas').toDataURL();
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

d3.selectAll('input[name="cols"], input[name="rows"]').on('change', draw);

d3.selectAll('input[name="colour"]').on('change', function() {
  colours = [];
  var i = 0;
  var checkboxes = d3.selectAll('input[name="colour"]')
  var done = function() {
    draw();
  }
  checkboxes.each(function() {
    if (this.checked) {
      colours.push(this.value);
    }
    if (i++ >= 9) {
      done();
    }
  });
});

var changeHeight = function() {
  if (this.value === 'other') {
    d3.select('#height-other').classed('show', true);
  }
  else {
    if (this.id !== 'height-other') {
      d3.select('#height-other').classed('show', false);
    }
    height = this.value;
    draw();
  }
}

d3.selectAll('input[name="height"]').on('change', changeHeight);
d3.selectAll('input[name="height"]').on('keyup', changeHeight);

draw();
