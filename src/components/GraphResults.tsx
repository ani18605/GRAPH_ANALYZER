import React from 'react';
import { BarChart3, Network, Route, GitBranch, Zap, Target, AlertTriangle } from 'lucide-react';
import { GraphResults as Results, Edge } from '../types/graph';

interface GraphResultsProps {
  results: Results;
  onReset: () => void;
}

export const GraphResults: React.FC<GraphResultsProps> = ({ results, onReset }) => {
  const renderMatrix = (matrix: (number | string)[][], title: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-50 text-center text-sm font-medium">
                -
              </th>
              {matrix[0].map((_, j) => (
                <th key={j} className="border border-gray-300 p-2 bg-gray-50 text-center text-sm font-medium">
                  {j}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-2 bg-gray-50 text-center text-sm font-medium">
                  {i}
                </td>
                {row.map((cell, j) => (
                  <td key={j} className="border border-gray-300 p-2 text-center text-sm">
                    <span className={`px-2 py-1 rounded ${getCellStyle(cell)}`}>
                      {typeof cell === 'string' ? cell : cell}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {title === 'Distance Matrix' && (
        <div className="mt-4 text-xs text-gray-600 space-y-1">
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-100 rounded"></span>
              Positive distance
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gray-100 rounded"></span>
              Same node (0)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-100 rounded"></span>
              Unreachable (-1)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-purple-100 rounded"></span>
              Negative cycle (-∞)
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const getCellStyle = (value: number | string) => {
    if (value === 0) return 'bg-gray-100 text-gray-600';
    if (value === -1) return 'bg-red-100 text-red-600';
    if (value === '-Infinity') return 'bg-purple-100 text-purple-600 font-bold';
    if (typeof value === 'number' && value < 0) return 'bg-orange-100 text-orange-700 font-medium';
    if (typeof value === 'number' && value > 0) return 'bg-green-100 text-green-600';
    return 'bg-blue-100 text-blue-600';
  };

  const renderList = (list: number[][], title: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2">
        {list.map((neighbors, node) => (
          <div key={node} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-700 w-12">
              Node {node}:
            </span>
            <div className="flex flex-wrap gap-1">
              {neighbors.length === 0 ? (
                <span className="text-gray-500 italic">No connections</span>
              ) : (
                neighbors.map((neighbor, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium"
                  >
                    {neighbor}
                  </span>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEdgeList = (edges: Edge[], title: string, icon: React.ReactNode, color: string) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 ${color === 'orange' ? 'bg-orange-100' : 'bg-purple-100'} rounded-lg`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      {edges.length === 0 ? (
        <p className="text-gray-500 italic text-center py-4">None found</p>
      ) : (
        <div className="space-y-2">
          {edges.map((edge, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className={`px-3 py-1 ${color === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'} rounded font-medium`}>
                {edge.from} → {edge.to}
                {edge.weight !== undefined && (
                  <span className={edge.weight < 0 ? 'text-red-600 font-bold' : ''}>
                    {' '}({edge.weight})
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderNumberList = (numbers: number[], title: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      {numbers.length === 0 ? (
        <p className="text-gray-500 italic text-center py-4">None found</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {numbers.map((num, idx) => (
            <span
              key={idx}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium"
            >
              Node {num}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Graph Analysis Results</h1>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          New Graph
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderMatrix(results.adjacencyMatrix, 'Adjacency Matrix', <BarChart3 className="w-6 h-6 text-blue-600" />)}
        {renderList(results.adjacencyList, 'Adjacency List', <Network className="w-6 h-6 text-green-600" />)}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {renderMatrix(results.distanceMatrix, 'Distance Matrix', <Route className="w-6 h-6 text-blue-600" />)}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <GitBranch className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Cycle Analysis</h3>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className={`px-4 py-2 rounded-lg font-medium ${results.hasCycle ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {results.hasCycle ? 'Cycle Detected' : 'No Cycle'}
          </span>
          
          {results.hasNegativeCycle && (
            <span className="px-4 py-2 rounded-lg font-medium bg-purple-100 text-purple-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Negative Cycle Detected
            </span>
          )}
          
          {results.topologicalSort && (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Topological Sort:</span>
              <div className="flex gap-1">
                {results.topologicalSort.map((node, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                    {node}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {results.mst && (
        <div className="grid grid-cols-1 gap-8">
          {renderEdgeList(results.mst, 'Minimum Spanning Tree', <Zap className="w-6 h-6 text-orange-600" />, 'orange')}
        </div>
      )}

      {results.bridges && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderEdgeList(results.bridges, 'Bridges', <GitBranch className="w-6 h-6 text-purple-600" />, 'purple')}
          {results.articulationPoints && renderNumberList(results.articulationPoints, 'Articulation Points', <Target className="w-6 h-6 text-red-600" />)}
        </div>
      )}
    </div>
  );
};