function setup() {
  createCanvas(800, 600)
  textSize(16)
}

const graph = new Graph();
const nodeSize = 15;
const edgeWeight = 3;

let green = '#6EEB83';
let red = '#FF5964';
let pathColor = '#DACC3E'

const user = {
  dragging: false,
  target: null,
  hovering: null
}

// const infoStartNode = select('#info-start-node')
// const infoEndNode = select('#info-end-node')
// const infoShortestPath = select('#info-shortest-path')

function draw() {
  background('#254441')
  noStroke()
  fill(255)
  stroke(175)
  graph.matrix.forEach((row, i) => {
    row.forEach((weight, j) => {
      if (weight !== Infinity && i !== j) {
        n1 = graph.nodes[i]
        n2 = graph.nodes[j]
        line(n1.x, n1.y, n2.x, n2.y)
      }
    })
  })

  strokeWeight(edgeWeight)
  if (user.target !== null && user.dragging && keyCode !== SHIFT)
    line(graph.nodes[user.target].x, graph.nodes[user.target].y, mouseX, mouseY)
    
  if (graph.start !== null && graph.end !== null)
    graph.findPath(graph.start, graph.end)
  
  if (graph.path)
    drawPath(graph.path)

  displayPathInformation()
  
  graph.nodes.forEach((p, i) => {
    noStroke()
    if (i === graph.start) fill(green)
    else if (i === graph.end) fill(red)
    else if (p.over) fill(blue)
    else fill(255)
    ellipse(p.x, p.y, nodeSize)
    textAlign(LEFT, CENTER)
    strokeWeight(4)
    stroke(50)
    text(i, p.x + nodeSize - 3, p.y + 1)
  })
  strokeWeight(edgeWeight)
}

// Determines if mouse press is near a node
const isPromixous = (p, mx, my) => dist(p.x, p.y, mx, my) < nodeSize * 2;

// Returns the index of the clicked node, if there is one
function getNearest(mx, my) {
  if (mx === undefined || my === undefined)
    throw new Error('no coordinates provided')

  let nearest = null;

  for (let i = 0; i < graph.nodes.length; i++) {
    if (isPromixous(graph.nodes[i], mx, my)) nearest = i;
  }
  return nearest;
}

function mousePressed() {
  const target = getNearest(mouseX, mouseY) ?? null

  if (target === null) {
    user.target = null;
    graph.addNode(mouseX, mouseY, false, false)
  }
}

function doubleClicked() {
  const target = getNearest(mouseX, mouseY) ?? null

  if (target !== null) {
    user.target = target;

    if (graph.start === null) graph.start = target
    else if (graph.end === null) graph.end = target

    console.log('start ' + graph.start, ', end ' + graph.end)
  }
  user.target = null;
}

function mouseDragged() {
  if (!user.dragging) {
    user.dragging = true
    user.target = getNearest(mouseX, mouseY) ?? null
  } 
  else if (keyCode === SHIFT && user.target !== null)
    graph.moveNode(user.target, mouseX, mouseY)
}

function mouseReleased() {
  const destination = getNearest(mouseX, mouseY) ?? null;

  if (destination !== null && user.target !== null) {
    graph.addEdge(user.target, destination)
  }

  if (graph.start !== null && graph.end !== null)
    graph.findPath(graph.start, graph.end)
  
  user.dragging = false;
  user.target = null;
}

function keyPressed() {
  if (keyCode === ESCAPE)
    graph.reset();
}

function drawPath(path) {
  stroke(pathColor)
  for (let i = 0; i < path.length; i++) {
    let a = graph.nodes[path[i]]

    if (i < path.length - 1) {
      let b = graph.nodes[path[i + 1]]
      line(a.x, a.y, b.x, b.y)
    }
    
    if (i === 0) 
      line(graph.nodes[graph.start].x, graph.nodes[graph.start].y, a.x, a.y)
  }
}

function displayPathInformation() {
  // if (graph.path  !== null) {
  //   infoStartNode.innerText = `Start node: ${graph.start ?? 'not set'}`
  //   infoEndNode.innerText = `End node: ${graph.end ?? 'not set'}`
    
  //   infoShortestPath.innerText = graph.path ? 
  //   `Shortest route: ${graph.start + ' -> ' + graph.path.join(' -> ')}` :
  //   `No path found.`
  // }
}