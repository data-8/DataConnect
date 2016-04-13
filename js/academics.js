var w = 600,
  h = 600,
  radius = 25,
  node,
  link,
  root;

var force = d3.layout.force()
  .on("tick", tick)
  .charge(function(d) {
    return -500;
  })
  .linkDistance(function(d) {
    return d.target._children ? 150 : 200;
  })
  .size([w, h - 180]);

var svg = d3.select("body").append("svg")
  .attr("width", w)
  .attr("height", h);

root = classes[0]; //set root node
root.fixed = true;
root.x = w / 2;
root.y = h / 2 - 75;
update();

function update() {
  var nodes = flatten(root),
    links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force
    .nodes(nodes)
    .links(links)
    .start();

  // Update the links…
  link = svg.selectAll(".link")
    .data(links);

  // Enter any new links.
  link.enter().insert("svg:line", ".node")
    .attr("class", "link")
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  // Exit any old links.
  link.exit().remove();

  // Update the nodes…
  node = svg.selectAll("circle.node")
    .data(nodes)
    .style("fill", color);

  node.transition()
    .attr("r", radius);

  // Enter any new nodes.
  node.enter().append("svg:circle")
    .attr("class", "node")
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", radius)
    .style("fill", color)
    .call(force.drag);

  node.append("title")
    .text(function(d) {
      return d.name;
    });

  // Exit any old nodes.
  node.exit().remove();

  title = svg.selectAll("node.title")
    .data(nodes);

  // Enter any new titles.
  title.enter()
    .append("text")
    .attr("class", "title")
    .attr("dx", -32)
    .attr("dy", 43)
    .text(function(d) {
      return d.name;
    });

  // Exit any old titles.
  title.exit().remove();
}

function tick() {
  link.attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  node.attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });

  title.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
  if (d._children) {
    return "#95a5a6";
  } else {
    switch (d.group) {
      case 1: //teal
        return "#29B0A5";
        break;
      case 2: //gray
        return "#53626D";
        break;
      case 3: //green
        return "#CFD95C";
        break;
      case 4: //orange
        return "#E84E3E";
        break;
      default: //pink
        return "#E82B64";
    }
  }
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [],
    i = 0;

  function recurse(node) {
    if (node.children) node.size = node.children.reduce(function(p, v) {
      return p + recurse(v);
    }, 0);
    if (!node.id) node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root);
  return nodes;
}
