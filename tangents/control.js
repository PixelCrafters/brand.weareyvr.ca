var element = d3.select(".weareyvr-mark");
var vis = d3.select(".weareyvr-mark svg");

var radius = 50;
var topLeft = 50;
var topRight = 50;
var bottomRight = 0;
var bottomLeft = 0;
var colour  = "black";

// Controls
d3.selectAll('input[type="range"], input[type="radio"]').on("change", function change() {
  eval(this.name + ' = "' + this.value + '"'); // DIRTY!
  console.log(this.name + ' = "' + this.value + '"');
  // var transition = vis.transition().duration(250);
  // // var delay = function(d, i) { return i * 50; };
  // transition.selectAll(".one")
  //   // .delay(delay)
  //   .attr("transform", "translate(" + one.x + ',' + one.y + ")");


  // Having troubling finding a nice data driven way to do this, since
  // each arc and line is kind of unique, so just remove all and redraw.
  vis.selectAll('*').remove();
  drawMark(vis, element.attr('data-height'), colour,  radius, topLeft, topRight, bottomRight, bottomLeft);
});
