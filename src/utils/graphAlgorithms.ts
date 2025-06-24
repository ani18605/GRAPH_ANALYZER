import { Edge, GraphData, GraphResults } from '../types/graph';

export class GraphAlgorithms {
  private nodes: number;
  private edges: Edge[];
  private isDirected: boolean;
  private isWeighted: boolean;

  constructor(graphData: GraphData) {
    this.nodes = graphData.nodes;
    this.edges = this.processMultipleEdges(graphData.edgeList, graphData.isWeighted);
    this.isDirected = graphData.isDirected;
    this.isWeighted = graphData.isWeighted;
  }

  // Process multiple edges: keep only one edge between same nodes
  private processMultipleEdges(edgeList: Edge[], isWeighted: boolean): Edge[] {
    const edgeMap = new Map<string, Edge>();

    for (const edge of edgeList) {
      // Create a key for the edge pair
      const key = this.isDirected 
        ? `${edge.from}-${edge.to}` 
        : `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`;

      if (edgeMap.has(key)) {
        const existingEdge = edgeMap.get(key)!;
        
        if (isWeighted) {
          // Keep the edge with minimum weight
          const currentWeight = edge.weight || 0;
          const existingWeight = existingEdge.weight || 0;
          
          if (currentWeight < existingWeight) {
            edgeMap.set(key, edge);
          }
        }
        // For unweighted graphs, keep the first edge (already in map)
      } else {
        edgeMap.set(key, edge);
      }
    }

    return Array.from(edgeMap.values());
  }

  buildAdjacencyMatrix(): number[][] {
    const matrix = Array(this.nodes).fill(null).map(() => Array(this.nodes).fill(0));
    
    for (const edge of this.edges) {
      const weight = this.isWeighted ? (edge.weight || 0) : 1;
      matrix[edge.from][edge.to] = weight;
      if (!this.isDirected) {
        matrix[edge.to][edge.from] = weight;
      }
    }
    
    return matrix;
  }

  buildAdjacencyList(): number[][] {
    const list = Array(this.nodes).fill(null).map(() => []);
    
    for (const edge of this.edges) {
      list[edge.from].push(edge.to);
      if (!this.isDirected) {
        list[edge.to].push(edge.from);
      }
    }
    
    return list;
  }

  floydWarshall(): (number | string)[][] {
    const INF = 'Infinity';
    const NEG_INF = '-Infinity';
    const dist: (number | string)[][] = Array(this.nodes).fill(null).map(() => Array(this.nodes).fill(INF));
    
    // Initialize distances
    for (let i = 0; i < this.nodes; i++) {
      dist[i][i] = 0;
    }
    
    for (const edge of this.edges) {
      const weight = this.isWeighted ? (edge.weight || 0) : 1;
      dist[edge.from][edge.to] = weight;
      if (!this.isDirected) {
        dist[edge.to][edge.from] = weight;
      }
    }
    
    // Floyd-Warshall algorithm
    for (let k = 0; k < this.nodes; k++) {
      for (let i = 0; i < this.nodes; i++) {
        for (let j = 0; j < this.nodes; j++) {
          if (dist[i][k] !== INF && dist[k][j] !== INF) {
            const newDist = (dist[i][k] as number) + (dist[k][j] as number);
            if (dist[i][j] === INF || newDist < (dist[i][j] as number)) {
              dist[i][j] = newDist;
            }
          }
        }
      }
    }
    
    // Enhanced negative cycle detection
    for (let k = 0; k < this.nodes; k++) {
      for (let i = 0; i < this.nodes; i++) {
        for (let j = 0; j < this.nodes; j++) {
          if (dist[i][k] !== INF && dist[k][j] !== INF) {
            const newDist = (dist[i][k] as number) + (dist[k][j] as number);
            if (dist[i][j] !== INF && newDist < (dist[i][j] as number)) {
              // Negative cycle detected - mark all affected paths
              dist[i][j] = NEG_INF;
            }
          }
        }
      }
    }
    
    // Propagate negative infinity for all paths affected by negative cycles
    for (let k = 0; k < this.nodes; k++) {
      for (let i = 0; i < this.nodes; i++) {
        for (let j = 0; j < this.nodes; j++) {
          if (dist[i][k] === NEG_INF || dist[k][j] === NEG_INF) {
            if (dist[i][j] !== INF) {
              dist[i][j] = NEG_INF;
            }
          }
        }
      }
    }
    
    // Convert unreachable distances to -1
    for (let i = 0; i < this.nodes; i++) {
      for (let j = 0; j < this.nodes; j++) {
        if (dist[i][j] === INF) {
          dist[i][j] = -1;
        }
      }
    }
    
    return dist;
  }

  hasCycle(): boolean {
    if (this.isDirected) {
      return this.hasCycleDirected();
    } else {
      return this.hasCycleUndirected();
    }
  }

  private hasCycleDirected(): boolean {
    const visited = new Array(this.nodes).fill(false);
    const recStack = new Array(this.nodes).fill(false);
    const adjList = this.buildAdjacencyList();

    const dfs = (node: number): boolean => {
      visited[node] = true;
      recStack[node] = true;

      for (const neighbor of adjList[node]) {
        if (!visited[neighbor] && dfs(neighbor)) {
          return true;
        } else if (recStack[neighbor]) {
          return true;
        }
      }

      recStack[node] = false;
      return false;
    };

    for (let i = 0; i < this.nodes; i++) {
      if (!visited[i] && dfs(i)) {
        return true;
      }
    }

    return false;
  }

  private hasCycleUndirected(): boolean {
    const visited = new Array(this.nodes).fill(false);
    const adjList = this.buildAdjacencyList();

    const dfs = (node: number, parent: number): boolean => {
      visited[node] = true;

      for (const neighbor of adjList[node]) {
        if (!visited[neighbor]) {
          if (dfs(neighbor, node)) {
            return true;
          }
        } else if (neighbor !== parent) {
          return true;
        }
      }

      return false;
    };

    for (let i = 0; i < this.nodes; i++) {
      if (!visited[i] && dfs(i, -1)) {
        return true;
      }
    }

    return false;
  }

  // Enhanced negative cycle detection using Bellman-Ford
  hasNegativeCycle(): boolean {
    if (!this.isWeighted || !this.isDirected) return false;

    // Use Bellman-Ford algorithm to detect negative cycles
    const dist = new Array(this.nodes).fill(Infinity);
    dist[0] = 0; // Start from node 0

    // Relax edges V-1 times
    for (let i = 0; i < this.nodes - 1; i++) {
      for (const edge of this.edges) {
        const weight = edge.weight || 0;
        if (dist[edge.from] !== Infinity && dist[edge.from] + weight < dist[edge.to]) {
          dist[edge.to] = dist[edge.from] + weight;
        }
      }
    }

    // Check for negative cycles
    for (const edge of this.edges) {
      const weight = edge.weight || 0;
      if (dist[edge.from] !== Infinity && dist[edge.from] + weight < dist[edge.to]) {
        return true;
      }
    }

    return false;
  }

  topologicalSort(): number[] | null {
    if (!this.isDirected) return null;
    if (this.hasCycle()) return null;

    const inDegree = new Array(this.nodes).fill(0);
    const adjList = this.buildAdjacencyList();
    const result: number[] = [];
    const queue: number[] = [];

    // Calculate in-degrees
    for (let i = 0; i < this.nodes; i++) {
      for (const neighbor of adjList[i]) {
        inDegree[neighbor]++;
      }
    }

    // Add nodes with 0 in-degree to queue
    for (let i = 0; i < this.nodes; i++) {
      if (inDegree[i] === 0) {
        queue.push(i);
      }
    }

    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node);

      for (const neighbor of adjList[node]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }

    return result.length === this.nodes ? result : null;
  }

  kruskalMST(): Edge[] | null {
    if (!this.isWeighted) return null;

    const parent = Array.from({ length: this.nodes }, (_, i) => i);
    const rank = new Array(this.nodes).fill(0);

    const find = (x: number): number => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };

    const union = (x: number, y: number): boolean => {
      const px = find(x);
      const py = find(y);

      if (px === py) return false;

      if (rank[px] < rank[py]) {
        parent[px] = py;
      } else if (rank[px] > rank[py]) {
        parent[py] = px;
      } else {
        parent[py] = px;
        rank[px]++;
      }

      return true;
    };

    // Sort edges by weight (including negative weights)
    const sortedEdges = [...this.edges].sort((a, b) => (a.weight || 0) - (b.weight || 0));
    const mst: Edge[] = [];

    for (const edge of sortedEdges) {
      if (union(edge.from, edge.to)) {
        mst.push(edge);
        if (mst.length === this.nodes - 1) break;
      }
    }

    return mst.length === this.nodes - 1 ? mst : null;
  }

  findBridges(): Edge[] {
    const visited = new Array(this.nodes).fill(false);
    const disc = new Array(this.nodes).fill(0);
    const low = new Array(this.nodes).fill(0);
    const parent = new Array(this.nodes).fill(-1);
    const bridges: Edge[] = [];
    let time = 0;
    const adjList = this.buildAdjacencyList();

    const bridgeUtil = (u: number): void => {
      visited[u] = true;
      disc[u] = low[u] = ++time;

      for (const v of adjList[u]) {
        if (!visited[v]) {
          parent[v] = u;
          bridgeUtil(v);

          low[u] = Math.min(low[u], low[v]);

          if (low[v] > disc[u]) {
            bridges.push({ from: u, to: v });
          }
        } else if (v !== parent[u]) {
          low[u] = Math.min(low[u], disc[v]);
        }
      }
    };

    for (let i = 0; i < this.nodes; i++) {
      if (!visited[i]) {
        bridgeUtil(i);
      }
    }

    return bridges;
  }

  findArticulationPoints(): number[] {
    const visited = new Array(this.nodes).fill(false);
    const disc = new Array(this.nodes).fill(0);
    const low = new Array(this.nodes).fill(0);
    const parent = new Array(this.nodes).fill(-1);
    const ap = new Array(this.nodes).fill(false);
    let time = 0;
    const adjList = this.buildAdjacencyList();

    const apUtil = (u: number): void => {
      let children = 0;
      visited[u] = true;
      disc[u] = low[u] = ++time;

      for (const v of adjList[u]) {
        if (!visited[v]) {
          children++;
          parent[v] = u;
          apUtil(v);

          low[u] = Math.min(low[u], low[v]);

          if (parent[u] === -1 && children > 1) {
            ap[u] = true;
          }

          if (parent[u] !== -1 && low[v] >= disc[u]) {
            ap[u] = true;
          }
        } else if (v !== parent[u]) {
          low[u] = Math.min(low[u], disc[v]);
        }
      }
    };

    for (let i = 0; i < this.nodes; i++) {
      if (!visited[i]) {
        apUtil(i);
      }
    }

    return ap.map((isAP, index) => isAP ? index : -1).filter(x => x !== -1);
  }

  analyze(): GraphResults {
    const adjacencyMatrix = this.buildAdjacencyMatrix();
    const adjacencyList = this.buildAdjacencyList();
    const distanceMatrix = this.floydWarshall();
    const hasCycle = this.hasCycle();
    const hasNegativeCycle = this.hasNegativeCycle();
    const topologicalSort = !hasCycle && this.isDirected ? this.topologicalSort() : undefined;
    const mst = this.isWeighted ? this.kruskalMST() : undefined;
    const bridges = !this.isDirected ? this.findBridges() : undefined;
    const articulationPoints = !this.isDirected ? this.findArticulationPoints() : undefined;

    return {
      adjacencyMatrix,
      adjacencyList,
      distanceMatrix,
      hasCycle,
      hasNegativeCycle,
      topologicalSort,
      mst,
      bridges,
      articulationPoints,
    };
  }
}