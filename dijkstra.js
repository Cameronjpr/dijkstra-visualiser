function shortestPath(edges, numVertices, startVertex) {
  let done = new Array(numVertices)
  done[startVertex] = true
  let pathLengths = new Array(numVertices)
  let predecessors = new Array(numVertices)

  for (var i = 0; i < numVertices; i++) {
    pathLengths[i] = edges[startVertex][i]
    if (edges[startVertex][i] != Infinity) {
      predecessors[i] = startVertex
    }
  }
  
  pathLengths[startVertex] = 0
  for (var i = 0; i < numVertices - 1; i++) {
    var closest = -1
    var closestDistance = Infinity

    for (var j = 0; j < numVertices; j++) {
      if (!done[j] && pathLengths[j] < closestDistance) {
        closestDistance = pathLengths[j]
        closest = j
      }
    }
    done[closest] = true
    for (var j = 0; j < numVertices; j++) {
      if (edges[closest] === undefined)
        continue;  
      if (!done[j]) {
        var possiblyCloserDistance = pathLengths[closest] + edges[closest][j]
        if (possiblyCloserDistance < pathLengths[j]) {
          pathLengths[j] = possiblyCloserDistance
          predecessors[j] = closest
        }
      }
    }
  }
  return {
    startVertex: startVertex,
    pathLengths: pathLengths,
    predecessors: predecessors,
  }
}

function constructPath(shortestPathInfo, endVertex) {
  var path = []
  if (shortestPathInfo.predecessors[endVertex] === undefined) return false // way of determining if no path exists
  while (endVertex != shortestPathInfo.startVertex) {
    path.unshift(endVertex)
    endVertex = shortestPathInfo.predecessors[endVertex]
  }
  return path
}
