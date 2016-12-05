var w = 600,
  h = 800,
  radius = 20,
  node,
  link,
  root;

function chart1() {
//JS for d3

var force = d3.layout.force()
  .on("tick", tick)
  .charge(function(d) {
    return -900;
  })
  .linkDistance(function(d) {
    return d.target._children ? 50 : 110;
  })
  .size([w, h - 180]);
    var classes = [{
      "group": 1,
      "name": "Economics/Business",
      "word": "main node",
      "children": [{
        "group": 0,
        "name": "Applied",
        "children": [{
          "group": 2,
          "name": "ECON C142",
          "class": "Applied Econometrics and Public Policy"
        }, {
          "group": 2,
          "name": "ECON 141",
          "class": "Econometric Analysis"
        }, {
          "group": 2,
          "name": "ECON 140",
          "class": "Economic Statistics and Econometrics"
        }, {
          "group": 2,
          "name": "UGBA 122",
          "class": "Financial Information Analysis"
        }, {
          "group": 2,
          "name": "UGBA 161",
          "class": "Marketing Research: Tools and Techniques for Data Collection and Analysis"
        }]
      }, {
        "group": 0,
        "name": "Applied-Foundational",
        "children": [{
          "group": 3,
          "name": "STAT 20",
          "class": "Introduction to Probability and Statistics"
        }, {
          "group": 3,
          "name": "COMPSCI 61A",
          "class": "Structure and Interpretation of Computer Programs"
        }, {
          "group": 3,
          "name": "COMPSCI 61B",
          "class": "Data Structures"
        }]
      }, {
        "group": 0,
        "name": "Multidisciplinary",
        "children": [{
          "group": 4,
          "name": "COMPSCI C8",
          "class": "Introduction to Data Science"
        }]
      }]
    }];

// All graphs have same SVG, but they bind to different divs
var svg = d3.select("#econ").append("svg")
  .attr("width", w)
  .attr("height", h);


// This is where it differes, all graphs have different nodes/classes
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
      return d.class;
    });

  // Exit any old nodes.
  node.exit().remove();

  title = svg.selectAll("node.title")
    .data(nodes);

  // Enter any new titles.
  title.enter()
    .append("text")
    .attr("class", "title")
    .attr("dx", function(d) {
      return -d.name.length * 2.8;
    })
    .attr("dy", 40)
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
      case 0: //dark blue
        return "#081F3F";
        break;
      case 1: //yellow
        return "#FCB326";
        break;
      case 2: //teal
        return "#00B2A5";
        break;
      case 3: //pink
        return "#EE1F60";
        break;
      case 4: //bright green
        return "#CFDD45";
        break;
      case 5: //pale orange
        return "#EC6851";
        break;
      case 6: //blue
        return "#51758D";
        break;
      default:
        return "#53626F";
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
}



window.onload = function(){
  chart1();
}