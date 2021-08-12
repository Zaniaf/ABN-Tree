// Generation of the tree diagram

let margin = {top: 20, right: 120, bottom: 20, left: 120};
let width = 960 - margin.right - margin.left;
let height = 500 - margin.top - margin.bottom;

let i = 0;
let duration = 750;
let root;

let tree = d3.layout.tree()
    .size([height, width]);

let diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

let svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let selectedNode = null;


// HTML elements handle
const descriptionBox = document.getElementById('box');
const closeButton    = document.getElementById('closeButton');
const errorMessage   = document.getElementById('errorMessage');

closeButton.onclick = () => {
    descriptionBox.innerHTML = '';
    closeButton.style.display = 'none';
    selectedNode = null;
    update();
}

/*
 * Make http request to get the data and generate the diagram
**/
const http = new XMLHttpRequest();
http.open('GET', '/data');
http.send();

http.onreadystatechange = () => {
    if (http.readyState === XMLHttpRequest.DONE) {
        let status = http.status;
        if (status === 0 || (status >= 200 && status < 400)) {
            const treeData = JSON.parse(http.responseText);

            root = treeData[0];

            root.x0 = height / 2;
            root.y0 = 0;

            create(root);
        } else {
            errorMessage.style.display = 'block';
        }
    }
}

/*
 * Node click event handler
 * Update description box and highlight node
**/
const onNodeClick = (node) => {
    if (node === selectedNode) {
        descriptionBox.innerHTML = '';
        closeButton.style.display = 'none';
        selectedNode = null;
    } else {
        descriptionBox.innerHTML = node.description;
        closeButton.style.display = 'block';
        selectedNode = node;
    }
    update();
}

/*
 * Create the diagram
**/
const create = (source) => {
    // Compute the new tree layout.

    let nodes = tree.nodes(root).reverse();
    let links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    let node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    let nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", onNodeClick);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d === selectedNode ? "forestgreen" : "#fff"; });

    nodeEnter.append("text")
        .attr("x", function(d) { return d.children ? -13 : 13; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.name; })

    // Transition nodes to their new position.
    let nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 10)
        .style("fill", function(d) { return d === selectedNode ? "forestgreen" : "#fff"; });

    // Update the links…
    let link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            let o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            let o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

/*
 * Update the diagram on node selection
**/
const update = () => {
    let nodes = tree.nodes(root).reverse();

    nodes.forEach(function(d) { d.y = d.depth * 180; });

    let node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    let nodeUpdate = node.transition()
        .duration(duration)

    nodeUpdate.select("circle")
        .attr("r", 10)
        .style("fill", function(d) { return d === selectedNode ? "forestgreen" : "#fff"; });
}
