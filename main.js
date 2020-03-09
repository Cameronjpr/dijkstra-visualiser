function setup() {
  createCanvas(800, 600)
}

const graph = new Graph();
const userPrecision = 15;

const user = {
  dragging: false,
  target: null,
  hovering: null
}

function draw() {
  background(150)
  noStroke()
  fill(255)
  text(`Start node: ${graph.start ?? 'not set'}`, 20, 20)
  text(`End node: ${graph.end ?? 'not set'}`, 20, 40)
  if (graph.path)
    text(`Shortest route: ${graph.start + ' -> ' + graph.path.join(' -> ')}`, 20, 60)
  
  graph.nodes.forEach((p, i) => {
    if (i === graph.start) fill(255, 50, 50)
    else if (i === graph.end) fill(50, 50, 255)
    else if (p.over) fill(0)
    else fill(255)
    ellipse(p.x, p.y, 8)
    text(i, p.x + 6, p.y + 6)
  })

  stroke(255)
  graph.matrix.forEach((row, i) => {
    row.forEach((weight, j) => {
      if (weight !== Infinity && i !== j) {
        n1 = graph.nodes[i]
        n2 = graph.nodes[j]
        line(n1.x, n1.y, n2.x, n2.y)
      }
    })
  })
  
  if (user.target !== null && user.dragging) {
    line(graph.nodes[user.target].x, graph.nodes[user.target].y, mouseX, mouseY)
  }

  if (graph.path) {
    drawPath(graph.path)
  }
}

// Determines if mouse press is near (~10px) a node
const isPromixous = (p, mx, my) => dist(p.x, p.y, mx, my) < userPrecision;

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
    user.dragging = true;
    user.target = getNearest(mouseX, mouseY) ?? null;

  }
  // while (keyCode === SHIFT) {
  //   console.log(user.target)
  //   graph.moveNode(user.target, mouseX, mouseY)
  // }
}

function mouseReleased() {
  const destination = getNearest(mouseX, mouseY) ?? null;

  if (destination !== null && user.target !== null) {
    graph.addEdge(user.target, destination)
  }

  user.dragging = false;
  user.target = null;
}

function keyPressed() {
  if (keyCode === ENTER)
    if (graph.start !== null && graph.end !== null)
      console.log(graph.findPath(graph.start, graph.end))

  if (keyCode === ESCAPE)
    graph.reset();
}

function drawPath(path) {
  stroke(255, 0, 0)
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