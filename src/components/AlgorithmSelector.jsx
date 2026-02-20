// src/components/AlgorithmSelector.jsx
import React, { useState } from 'react';

const algorithms = [
  { id: 'fcfs', name: 'FCFS (First-Come, First-Served)' },
  { id: 'sjf-non', name: 'SJF (Shortest Job First) - Non-Preemptive' },
  { id: 'sjf-pre', name: 'SRTF (Shortest Remaining Time First) - Preemptive SJF' },
  { id: 'priority-non', name: 'Priority Scheduling - Non-Preemptive' },
  { id: 'priority-pre', name: 'Priority Scheduling - Preemptive' },
  { id: 'rr', name: 'Round Robin' },
];

const AlgorithmSelector = ({ processes, onVisualize, onAlgorithmChange }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('fcfs');
  const [quantum, setQuantum] = useState(1);

  const handleAlgorithmChange = (e) => {
    const newAlgorithm = e.target.value;
    setSelectedAlgorithm(newAlgorithm);
    // Emit algorithm change to parent
    onAlgorithmChange(newAlgorithm);
  };

  const handleQuantumChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantum(isNaN(value) ? 1 : value);
  };

  const handleVisualizeClick = () => {
    if (!processes || processes.length === 0) {
      alert("Please add processes first!");
      return;
    }

    if (selectedAlgorithm === 'rr' && (quantum <= 0 || !Number.isInteger(quantum))) {
      alert("Round Robin requires a valid integer Time Quantum greater than 0.");
      setQuantum(1);
      return;
    }

    try {
      onVisualize(processes, selectedAlgorithm, quantum);
    } catch (error) {
      console.error("Error in visualization:", error);
      alert("An error occurred during visualization. Check console for details.");
    }
  };

  return (
    <div className="algorithm-selection-container">
      {/* REMOVED: <h2>Algorithm Selection</h2> - Parent App.jsx provides this heading */}
      <div className="algorithm-select-wrapper">
        <label htmlFor="algorithm-select">Choose Algorithm:</label>
        <select id="algorithm-select" value={selectedAlgorithm} onChange={handleAlgorithmChange}>
          {algorithms.map(algo => (
            <option key={algo.id} value={algo.id}>{algo.name}</option>
          ))}
        </select>
      </div>

      {selectedAlgorithm === 'rr' && (
        <div className="quantum-input-wrapper">
          <label htmlFor="quantum-input">Time Quantum:</label>
          <input
            type="number"
            id="quantum-input"
            value={quantum}
            onChange={handleQuantumChange}
            min="1"
            step="1"
             placeholder="Enter quantum"
          />
        </div>
      )}

      <div className="visualize-button-wrapper">
        <button 
          onClick={handleVisualizeClick}
          className={`visualize-btn ${!processes?.length ? 'disabled' : ''}`}
          disabled={!processes?.length}
        >
          Visualize {processes?.length ? `(${processes.length} processes)` : ''}
        </button>
      </div>

    </div>
  );
};

export default AlgorithmSelector;