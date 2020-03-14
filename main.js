let infoStartNode, infoEndNode, infoShortestPath;
const CW = 800;
const CH = 600;

function setup() {
  createCanvas(CW, CH)
  textSize(16)

  infoStartNode = select('#info-start-node')
  infoEndNode = select('#info-end-node')
  infoShortestPath = select('#info-shortest-path')
}

const graph = new Graph();
const nodeSize = 15;
const edgeWeight = 4;

const user = new User();

let green = '#6EEB83';
let red = '#FF5964';
let pathColor = '#DACC3E'
let textOutline = '#254441'

function draw() {
  background('#254441')
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

  if (user.dragging) {
    if (user.dragMode === 'moveMode' && user.target !== null)
      graph.moveNode(user.target, mouseX, mouseY)
    else if (user.dragMode === 'edgeMode' && user.target !== null)
      line(graph.nodes[user.target].x, graph.nodes[user.target].y, mouseX, mouseY)
  }
    
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
    stroke(textOutline)
    text(i, p.x + nodeSize - 3, p.y + 1)
  })
  strokeWeight(edgeWeight)
}

// Determines if mouse press is near a node
const isPromixous = (p, mx, my) => dist(p.x, p.y, mx, my) < nodeSize * 2;

// Determins if mouse press is inside canvas
const insideCanvas = (mx, my) => mx >= 0 && mx < CW && my >= 0 && my < CH;

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
  console.log('Mouse pressed')
  if (insideCanvas(mouseX, mouseY)) {
    const target = getNearest(mouseX, mouseY) ?? null
    if (target === null) {
      user.target = null;
      graph.addNode(mouseX, mouseY, false, false)
    }
  }
}

function doubleClicked() {
  console.log('Mouse double clicked')
  if (insideCanvas(mouseX, mouseY)) {
    const target = getNearest(mouseX, mouseY) ?? null

    if (target !== null) {
      user.target = target;
      if (graph.start === null) graph.start = target
      else if (graph.end === null) graph.end = target
    }
    user.target = null;
  }
}

function mouseDragged() {
  if (!user.dragging) {
    user.dragging = true
    user.target = getNearest(mouseX, mouseY) ?? null
  } 

  handleChaining()
}

function mouseReleased() {
  console.log("Mouse released")
  const destination = getNearest(mouseX, mouseY) ?? null;

  if (destination !== null && user.target !== null)
    graph.addEdge(user.target, destination)
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
  infoStartNode.elt.innerText = `${graph.start ?? 'not set'}`
  infoEndNode.elt.innerText = `${graph.end ?? 'not set'}`
  
  if (graph.path  !== null) {
    infoShortestPath.elt.innerText = graph.path ? 
    `${graph.start + '->' + graph.path.join('->')}` :
    `No path found.`
  }
}

// THIS IS A WAR CRIME
function handleChaining() {
  console.log('handling chain', user)
  if (user.dragging && user.target !== null && user.dragMode === 'edgeMode') {
    let destinationStart = getNearest(mouseX, mouseY) ?? null
    if (destinationStart !== null) {
      const sx = mouseX, sy = mouseY;
      window.setTimeout(() => {
        let destinationEnd = getNearest(mouseX, mouseY) ?? null
        user.hovering = (sx - mouseX < 5 && sx - mouseX > -5 && sy - mouseY < 5 && sy - mouseY > -5)
        if (user.hovering && user.target !== null && destinationEnd !== null && destinationStart === destinationEnd) {
          graph.addEdge(user.target, destinationEnd)
          user.target = destinationEnd
        }
      }, 500)
    }
  }
  user.hovering = false;
}