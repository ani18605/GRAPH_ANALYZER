import React, { useState } from 'react';
import { Settings, Grape as Graph } from 'lucide-react';
import { GraphData } from '../types/graph';

interface GraphInputProps {
  onGraphSubmit: (graphData: GraphData) => void;
}

export const GraphInput: React.FC<GraphInputProps> = ({ onGraphSubmit }) => {
  const [nodes, setNodes] = useState<number>(4);
  const [edges, setEdges] = useState<number>(4);
  const [isWeighted, setIsWeighted] = useState<boolean>(false);
  const [isDirected, setIsDirected] = useState<boolean>(false);
  const [showEdgeInput, setShowEdgeInput] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEdgeInput(true);
  };

  const handleBackToSettings = () => {
    setShowEdgeInput(false);
  };

  if (showEdgeInput) {
    return (
      <EdgeInput
        nodes={nodes}
        edges={edges}
        isWeighted={isWeighted}
        isDirected={isDirected}
        onBack={handleBackToSettings}
        onSubmit={onGraphSubmit}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Settings className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Graph Configuration</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Nodes
          </label>
          <input
            type="number"
            min="2"
            max="200000"
            value={nodes}
            onChange={(e) => setNodes(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Edges
          </label>
          <input
            type="number"
            min="0"
            max={isDirected ? nodes * (nodes - 1) : (nodes * (nodes - 1)) / 2}
            value={edges}
            onChange={(e) => setEdges(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="weighted"
              checked={isWeighted}
              onChange={(e) => setIsWeighted(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="weighted" className="ml-3 text-sm font-medium text-gray-700">
              Weighted Graph
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="directed"
              checked={isDirected}
              onChange={(e) => setIsDirected(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="directed" className="ml-3 text-sm font-medium text-gray-700">
              Directed Graph
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Graph className="w-5 h-5" />
          Configure Edges
        </button>
      </form>
    </div>
  );
};

interface EdgeInputProps {
  nodes: number;
  edges: number;
  isWeighted: boolean;
  isDirected: boolean;
  onBack: () => void;
  onSubmit: (graphData: GraphData) => void;
}

const EdgeInput: React.FC<EdgeInputProps> = ({
  nodes,
  edges,
  isWeighted,
  isDirected,
  onBack,
  onSubmit,
}) => {
  const [edgeList, setEdgeList] = useState(() =>
    Array.from({ length: edges }, () => ({
      from: 0,
      to: 1,
      weight: isWeighted ? 1 : undefined,
    }))
  );

  const updateEdge = (index: number, field: string, value: number) => {
    const newEdgeList = [...edgeList];
    newEdgeList[index] = { ...newEdgeList[index], [field]: value };
    setEdgeList(newEdgeList);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nodes,
      edges,
      isWeighted,
      isDirected,
      edgeList,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Graph className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Edge Configuration</h2>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Graph Type:</strong> {isDirected ? 'Directed' : 'Undirected'} • 
          {isWeighted ? ' Weighted' : ' Unweighted'} • 
          {nodes} nodes • {edges} edges
        </p>
        {isWeighted && (
          <p className="text-xs text-gray-500 mt-1">
            Note: Multiple edges between same nodes will keep the one with minimum weight
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-h-96 overflow-y-auto space-y-3">
          {edgeList.map((edge, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600 w-8">#{index + 1}</span>
              
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                <select
                  value={edge.from}
                  onChange={(e) => updateEdge(index, 'from', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: nodes }, (_, i) => (
                    <option key={i} value={i}>
                      Node {i}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                <select
                  value={edge.to}
                  onChange={(e) => updateEdge(index, 'to', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: nodes }, (_, i) => (
                    <option key={i} value={i}>
                      Node {i}
                    </option>
                  ))}
                </select>
              </div>

              {isWeighted && (
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="number"
                    value={edge.weight}
                    onChange={(e) => updateEdge(index, 'weight', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="1"
                    placeholder="Enter weight"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
        >
          Analyze Graph
        </button>
      </form>
    </div>
  );
};
