class Graph {
  constructor() {
    this.nodes = []
    this.matrix = []
    this.edges = 0
    this.start = null
    this.end = null
    this.path = null
  }

  addNode(x, y) {
    this.nodes.push({ x: x, y: y, s: false, e: false })

    // represent that this new node cannot be reached by another node (yet)
    this.matrix.map(row => row.push(Infinity))

    // add a new row to the matrix for the new node's connection to other nodes
    this.matrix.push([])

    // represet that this new node cannot reach any another node (yet)
    this.matrix.forEach(row =>
      this.matrix[this.nodes.length - 1].push(Infinity)
    )

    // the distance from a node to itself is zero
    this.matrix[this.nodes.length - 1][this.nodes.length - 1] = 0

    console.table(this.matrix)
  }

  moveNode(i, x, y) {
    this.nodes[i].x = x
    this.nodes[i].y = y

    console.log('moving: ' + this.nodes[i].x, this.nodes[i].y)

    for (let j = 0; j < this.nodes.length; j++) {
      if (this.matrix[i][j] !== Infinity && i !== j) {
        const weight = dist(
          this.nodes[i].x,
          this.nodes[i].y,
          this.nodes[j].x,
          this.nodes[j].y
        )
        this.matrix[i][j] = weight
        this.matrix[j][i] = weight
      }
    }
  }

  removeNode(i) {
    this.nodes.slice(i, 1)
  }

  addEdge(n1, n2) {
    const node1 = this.nodes[n1]
    const node2 = this.nodes[n2]

    // Only add new edge if edge does not already exist
    if (this.matrix[n1][n2] === Infinity && this.matrix[n1][n2] === Infinity) {
      const weight = parseFloat(
        dist(node1.x, node1.y, node2.x, node2.y).toFixed(2)
      )

      this.matrix[n1][n2] = weight
      this.matrix[n2][n1] = weight
      this.edges++
      console.table(this.matrix)
    }
  }

  findPath(n1, n2) {
    console.log(
      constructPath(shortestPath(this.matrix, this.nodes.length, n1), n2)
    )
    this.path = constructPath(
      shortestPath(this.matrix, this.nodes.length, n1),
      n2
    )
  }

  getNodes() {
    return this.nodes
  }

  reset() {
    this.nodes = []
    this.matrix = []
    this.edges = 0
    this.start = null
    this.end = null
    this.path = null
  }

  resetStartAndEnd() {
    this.start = null
    this.end = null
    this.path = null
  }
}

