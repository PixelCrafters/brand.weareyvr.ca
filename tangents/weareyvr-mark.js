d3.selectAll(".weareyvr-mark").each(function() {
  var element = d3.select(this);
  drawMark(element.append("svg"), element.attr('data-height'), element.attr('data-colour'),  element.attr('data-radius'), element.attr('data-one'), element.attr('data-two'), element.attr('data-three'), element.attr('data-four'));
});

function drawMark(vis, height, colour, radius, one, two, three, four) {
  var width = height * 0.95;
  var radius = ((parseInt(radius, 10)*70/100)+5)*height/500;
  var stroke = (3/500)*height;
  if (stroke < 1) stroke = 1;

  vis.attr('width', width).attr('height', height);

  // Top left.
  var one = parseInt(one, 10);
  var topLeft = {
    radius: radius,
    x: (radius + stroke) + (one > 50 ? ((one-50)/50)*1.15*(width/2-2*radius) : 0),
    y: (radius + stroke) - (one < 50 ? ((one-50)/50)*2*(height/2-2*radius) : 0),
  };

  // Top right.
  var two = parseInt(two, 10);
  var topRight = {
    radius: radius,
    x: (width - radius - stroke) - (two > 50 ? ((two-50)/50)*1.15*(width/2-2*radius) : 0),
    y: (radius + stroke) - (two < 50 ? ((two-50)/50)*2*(height/2-2*radius) : 0),
  }

  // Bottom right.
  var three = parseInt(three, 10);
  var bottomRight = {
    radius: radius,
    x: (width - radius - stroke) + (three < 50 ? ((three-50)/50)*1.15*(width/2-2*radius) : 0),
    y: (height - radius - stroke) - (three > 50 ? ((three-50)/50)*2*(height/2-2*radius) : 0),
  };

  // Bottom left.
  var four = parseInt(four, 10);
  var bottomLeft = {
    radius: radius,
    x: (radius + stroke) - (four < 50 ? ((four-50)/50)*1.15*(width/2-2*radius) : 0),
    y: (height - radius - stroke) - (four > 50 ? ((four-50)/50)*2*(height/2-2*radius) : 0),
  }

  // Port of: http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Tangents_between_two_circles
  var tangent = function(c1, c2, tangentIndex) {
    var d_sq = (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y);

    if (d_sq <= (c1.radius - c2.radius) * (c1.radius - c2.radius)) {
      return [ [] ];
    }

    var d = Math.sqrt(d_sq);
    var vx = (c2.x - c1.x) / d;
    var vy = (c2.y - c1.y) / d;

    var res = [];

    var i = 0;

    for (var sign1 = 1; sign1 >= -1; sign1 -= 2) {
      var c = (c1.radius - sign1 * c2.radius) / d;

      if (c * c > 1.0) {
        continue;
      }
      var h = Math.sqrt(Math.max(0.0, 1.0 - c * c));

      for (var sign2 = 1; sign2 >= -1; sign2 -= 2) {
        var nx = vx * c - sign2 * h * vy;
        var ny = vy * c + sign2 * h * vx;
      
        res[i] = {
          x1: c1.x + c1.radius * nx,
          y1: c1.y + c1.radius * ny,
          x2: c2.x + sign1 * c2.radius * nx,
          y2: c2.y + sign1 * c2.radius * ny,
        }
        i++;
      }
    }
    return res[tangentIndex];
  }

  // Lines

  // Top left to top right.
  var tangentTopLeftToTopRight = tangent(topLeft, topRight, 1);
  vis.append("line")
    .attr("x1", tangentTopLeftToTopRight.x1)
    .attr("y1", tangentTopLeftToTopRight.y1)
    .attr("x2", tangentTopLeftToTopRight.x2)
    .attr("y2", tangentTopLeftToTopRight.y2)
    .attr("stroke-width", stroke)
    .attr("stroke", colour);

  // Top right to bottom left.
  var tangentTopRightToBottomLeft = tangent(topRight, bottomLeft, 3);
  vis.append("line")
    .attr("x1", tangentTopRightToBottomLeft.x1)
    .attr("y1", tangentTopRightToBottomLeft.y1)
    .attr("x2", tangentTopRightToBottomLeft.x2)
    .attr("y2", tangentTopRightToBottomLeft.y2)
    .attr("stroke-width", stroke)
    .attr("stroke", colour);

  // Bottom left to bottom right.
  var tangentBottomLeftToBottomRight = tangent(bottomLeft, bottomRight, 0);
  vis.append("line")
    .attr("x1", tangentBottomLeftToBottomRight.x1)
    .attr("y1", tangentBottomLeftToBottomRight.y1)
    .attr("x2", tangentBottomLeftToBottomRight.x2)
    .attr("y2", tangentBottomLeftToBottomRight.y2)
    .attr("stroke-width", stroke)
    .attr("stroke", colour);

  // Bottom right to top left.
  var tangentBottomRightToTopLeft = tangent(bottomRight, topLeft, 2);
  vis.append("line")
    .attr("x1", tangentBottomRightToTopLeft.x1)
    .attr("y1", tangentBottomRightToTopLeft.y1)
    .attr("x2", tangentBottomRightToTopLeft.x2)
    .attr("y2", tangentBottomRightToTopLeft.y2)
    .attr("stroke-width", stroke)
    .attr("stroke", colour);

  // Arcs

  // Top left.
  var arc = d3.svg.arc()
    .innerRadius(topLeft.radius - stroke/2)
    .outerRadius(topLeft.radius - stroke/2 + stroke)
    .startAngle(Math.PI + Math.atan((topLeft.x - tangentBottomRightToTopLeft.x2) / (tangentBottomRightToTopLeft.y2 - topLeft.y)))
    .endAngle(2 * Math.PI + Math.atan((topLeft.x - tangentTopLeftToTopRight.x1) / (tangentTopLeftToTopRight.y1 - topLeft.y)))

  vis.append("path")
    .attr("d", arc)
    .style("fill", colour)
    .attr("transform", "translate(" + topLeft.x + ',' + topLeft.y + ")")

  // Top right.
  var arc = d3.svg.arc()
    .innerRadius(topRight.radius - stroke/2)
    .outerRadius(topRight.radius - stroke/2 + stroke)
    .startAngle(Math.atan((topRight.x - tangentTopLeftToTopRight.x2) / (tangentTopLeftToTopRight.y2 - topRight.y)))
    .endAngle(Math.PI + Math.atan((topRight.x - tangentTopRightToBottomLeft.x1) / (tangentTopRightToBottomLeft.y1 - topRight.y)))

  vis.append("path")
    .attr("d", arc)
    .style("fill", colour)
    .attr("transform", "translate(" + topRight.x + ',' + topRight.y + ")")

  // Bottom right.
  var arc = d3.svg.arc()
    .innerRadius(bottomRight.radius - stroke/2)
    .outerRadius(bottomRight.radius - stroke/2 + stroke)
    .startAngle(Math.atan((bottomRight.x - tangentBottomRightToTopLeft.x1) / (tangentBottomRightToTopLeft.y1 - bottomRight.y)))
    .endAngle(Math.PI + Math.atan((bottomRight.x - tangentBottomLeftToBottomRight.x2) / (tangentBottomLeftToBottomRight.y2 - bottomRight.y)))

  vis.append("path")
    .attr("d", arc)
    .style("fill", colour)
    .attr("transform", "translate(" + bottomRight.x + ',' + bottomRight.y + ")")

  // Bottom left.
  var arc = d3.svg.arc()
    .innerRadius(bottomLeft.radius - stroke/2)
    .outerRadius(bottomLeft.radius - stroke/2 + stroke)
    .startAngle(Math.PI + Math.atan((bottomLeft.x - tangentBottomLeftToBottomRight.x1) / (tangentBottomLeftToBottomRight.y1 - bottomLeft.y)))
    .endAngle(2 * Math.PI + Math.atan((bottomLeft.x - tangentTopRightToBottomLeft.x2) / (tangentTopRightToBottomLeft.y2 - bottomLeft.y)))

  vis.append("path")
    .attr("d", arc)
    .style("fill", colour)
    .attr("transform", "translate(" + bottomLeft.x + ',' + bottomLeft.y + ")")
}
