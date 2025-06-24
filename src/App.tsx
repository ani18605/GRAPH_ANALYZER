import React, { useState } from 'react';
import { GraphInput } from './components/GraphInput';
import { GraphResults } from './components/GraphResults';
import { GraphAlgorithms } from './utils/graphAlgorithms';
import { GraphData, GraphResults as Results } from './types/graph';
import { Network } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState<'input' | 'results'>('input');
  const [results, setResults] = useState<Results | null>(null);

  const handleGraphSubmit = (graphData: GraphData) => {
    const algorithms = new GraphAlgorithms(graphData);
    const analysisResults = algorithms.analyze();
    setResults(analysisResults);
    setCurrentStep('results');
  };

  const handleReset = () => {
    setCurrentStep('input');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'input' ? (
          <>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Network className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Graph Theory Analyzer
                </h1>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive graph analysis tool supporting weighted/unweighted, directed/undirected graphs 
                with advanced algorithms for adjacency matrices, shortest paths, MST, and more.
              </p>
            </div>
            <GraphInput onGraphSubmit={handleGraphSubmit} />
          </>
        ) : (
          results && <GraphResults results={results} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;