export interface Edge {
  from: number;
  to: number;
  weight?: number;
}

export interface GraphData {
  nodes: number;
  edges: number;
  isWeighted: boolean;
  isDirected: boolean;
  edgeList: Edge[];
}

export interface GraphResults {
  adjacencyMatrix: number[][];
  adjacencyList: number[][];
  distanceMatrix: (number | string)[][];
  hasCycle: boolean;
  hasNegativeCycle?: boolean;
  topologicalSort?: number[];
  mst?: Edge[];
  bridges?: Edge[];
  articulationPoints?: number[];
}