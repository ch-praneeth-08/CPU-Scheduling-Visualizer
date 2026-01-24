// src/App.jsx
import React, { useState, useEffect } from 'react';

// Import styles
import './styles/App.css';

// GanttChart imports its own CSS

// Import Components
import ProcessInput from './components/ProcessInput';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import MetricsTable from './components/MetricsTable';
import Button from './components/Button';

// Import Algorithms
import {
    runFCFS,
    runSJF, // Non-Preemptive SJF
    runPriority, // Non-Preemptive Priority
    runRoundRobin,
    runSRTF,     // Preemptive SJF (SRTF)
    runPriorityPreemptive // Preemptive Priority (still potentially buggy)
} from './utils/schedulingAlgorithms';


// Main App Component
const App = () => {
  // --- State Management ---
  const [processes, setProcesses] = useState([]);
  const [visualizationResult, setVisualizationResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  // ADDED STATE: Keep track of the currently selected algorithm ID for explanation display
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState('fcfs'); // Default to FCFS

  const handleAlgorithmChange = (algorithmId) => {
    setSelectedAlgorithmId(algorithmId);
    if (processes.length > 0) {
      // Run simulation with new algorithm
      const result = simulateAlgorithm(processes, algorithmId);
      if (result) {
        setVisualizationResult(result.timeSlices);
        setMetrics(result.metrics);
      }
    }
  };

  const simulateAlgorithm = (processesToSchedule, algorithmId, quantum = 1) => {
    if (!processesToSchedule || processesToSchedule.length === 0) {
      return null;
    }

    let result = null;
    switch (algorithmId) {
      case 'fcfs':
        result = runFCFS(processesToSchedule);
        break;
      case 'sjf-non':
        result = runSJF(processesToSchedule);
        break;
      case 'sjf-pre':
        result = runSRTF(processesToSchedule);
        break;
      case 'priority-non':
        result = runPriority(processesToSchedule);
        break;
      case 'priority-pre':
        result = runPriorityPreemptive(processesToSchedule);
        break;
      case 'rr':
        result = runRoundRobin(processesToSchedule, quantum);
        break;
      default:
        console.error("Unknown algorithm selected:", algorithmId);
        return null;
    }

    return result;
  };

  // --- Algorithm Explanations Data ---
  // Object where keys are algorithm IDs and values are their descriptions in JSX
  const algorithmExplanations = {
      'fcfs': {
          name: 'FCFS (First-Come, First-Served)',
          description: (
              <p>Processes are executed strictly in the order they arrive. If multiple processes arrive at the same time, their order in the input list is typically used as a tie-breaker. It is **non-preemptive**, meaning once a process starts running, it continues until it completes its burst time.</p>
          ),
          characteristics: "Non-Preemptive, Fair (by arrival), Simple. Can lead to long waiting times for short jobs if a long job arrives first (Convoy Effect).",
          formula: (
              <>
                  <p>Completion Time (CT) = Time process finishes execution</p>
                  <p>Turnaround Time (TT) = CT - Arrival Time (AT)</p>
                  <p>Waiting Time (WT) = TT - Burst Time (BT)</p>
                  <p>Response Time = First time CPU is allocated - AT (For non-preemptive like FCFS, this is the same as WT if arrival is 0 and CPU is free initially, or delay before first run after arrival)</p> {/* More precise Response Time */}
              </>
           ),
          moreDetails: null // Add specific details or visual aids if needed
      },
      'sjf-non': {
           name: 'SJF (Shortest Job First) - Non-Preemptive',
           description: (
               <p>The CPU is allocated to the process with the smallest burst time among all processes *in the ready queue* (that have arrived). It is **non-preemptive**: once a process starts, it runs to completion. Ties in burst time are usually broken using FCFS.</p>
           ),
           characteristics: "Non-Preemptive. Optimal for minimizing average Waiting Time. Can cause starvation for long jobs if a steady stream of short jobs arrives.",
           formula: null // Formula is the same, but explanation focuses on selection criteria
      },
       'sjf-pre': {
           name: 'SRTF (Shortest Remaining Time First) - Preemptive SJF',
           description: (
              <p>The CPU is allocated to the process with the smallest *remaining* burst time. It is **preemptive**: the currently running process can be interrupted if a new process arrives with a burst time shorter than the currently running process's remaining burst time. This requires constant monitoring of arrivals.</p>
           ),
           characteristics: "Preemptive. More effective at minimizing average Waiting Time than non-preemptive SJF. Can lead to high overhead due to frequent context switches and potential starvation for long jobs.",
           formula: null // Formula is the same
      },
       'priority-non': {
           name: 'Priority Scheduling - Non-Preemptive',
           description: (
              <p>The CPU is allocated to the process with the highest priority among those in the ready queue. We use the convention where a <strong>lower number represents a higher priority</strong> (e.g., 1 is the highest priority). It is **non-preemptive**. Ties in priority are usually broken using FCFS.</p>
           ),
            characteristics: "Non-Preemptive. Allows prioritizing important tasks. Can cause starvation for low-priority processes if high-priority processes keep arriving.",
            formula: null
       },
       'priority-pre': {
            name: 'Priority Scheduling - Preemptive',
            description: (
                <p>The CPU is allocated to the process with the highest priority among those in the ready queue. It is **preemptive**: a currently running process can be interrupted if a new process arrives with a priority *higher* than the currently running process's priority. Uses a <strong>lower number = higher priority</strong> convention. Ties are typically broken by FCFS.</p>
            ),
             characteristics: "Preemptive. Responsive to high-priority tasks. Most susceptible to starvation for low-priority processes.",
             formula: null // Formula is the same
       },
       'rr': {
           name: 'Round Robin',
           description: (
               <p>Each process gets a small unit of CPU time, called a <strong>time quantum</strong>. When a process exhausts its quantum, it is preempted and moved to the end of the ready queue. Processes are picked from the ready queue in FCFS order. It is **preemptive**. The quantum size significantly impacts performance: small quantum leads to frequent context switches (high overhead); large quantum makes it behave more like FCFS.</p>
           ),
            characteristics: "Preemptive. Provides fairness (each process gets a turn). Better response time for time-shared systems. Can have higher average Turnaround Time than SJF.",
            formula: null
       },
  };


  // --- Process List Functions (same as before) ---
  const handleAddProcess = (newProcess) => {
    setProcesses(prevProcesses => {
      const nextId = prevProcesses.length + 1;
      return [...prevProcesses, { ...newProcess, id: nextId }];
    });
  };

  const clearProcesses = () => {
    setProcesses([]); // Clear the processes array
    setVisualizationResult(null); // Clear visualization
    setMetrics(null); // Clear metrics
  };


  // --- Visualize Handler (Modified to update selectedAlgorithmId state) ---
  const handleVisualize = (processesToSchedule, algorithmId, quantum) => {
    const result = simulateAlgorithm(processesToSchedule, algorithmId, quantum);
    if (result) {
      setVisualizationResult(result.timeSlices);
      setMetrics(result.metrics);
    }
  };


  // --- JSX Render Function ---
  return (
    <div className="container">

      <h1>CPU Scheduling Visualizer</h1>

      <section className="process-input-section">
         <h2>Process Input</h2>
         <ProcessInput processes={processes} onAddProcess={handleAddProcess} />
         {processes.length > 0 && (
              <Button 
                variant="danger" 
                onClick={clearProcesses}
              >
                Clear All Processes
              </Button>
         )}
      </section>

      <hr />

      <section className="algorithm-selection-section">
          <h2>Algorithm Selection</h2>
         <AlgorithmSelector 
           processes={processes} 
           onVisualize={handleVisualize} 
           onAlgorithmChange={handleAlgorithmChange} 
         />
      </section>

      <hr />

       {/* ADDED: Algorithm Explanation Section */}
      <section className="algorithm-explanation-section">
           <h2>Algorithm Explanation</h2>
           {/* Conditionally render the explanation based on the stored selectedAlgorithmId */}
           {/* Retrieve the explanation object from the lookup object using the ID */}
           {selectedAlgorithmId && algorithmExplanations[selectedAlgorithmId] && (
               <div>
                   {/* Display the selected algorithm's name (optional, as it's also in selector) */}
                   {/* <h3>{algorithmExplanations[selectedAlgorithmId].name}</h3> */}
                   {/* Display the description content */}
                   {algorithmExplanations[selectedAlgorithmId].description}
                   {/* Optional: Display characteristics or formula if they exist */}
                    {algorithmExplanations[selectedAlgorithmId].characteristics && (
                         <p><strong>Characteristics:</strong> {algorithmExplanations[selectedAlgorithmId].characteristics}</p>
                    )}
                    {algorithmExplanations[selectedAlgorithmId].formula && (
                         <div className="formula-block"> {/* Optional div for styling formulas */}
                              <h4>Metrics Formulas:</h4>
                             {algorithmExplanations[selectedAlgorithmId].formula}
                         </div>
                    )}

               </div>
           )}
            {/* Fallback message if no algorithm explanation is found (shouldn't happen if IDs match) */}
           {selectedAlgorithmId && !algorithmExplanations[selectedAlgorithmId] && (
                <p>No explanation found for selected algorithm.</p>
           )}
            {/* Message before any algorithm is run */}
             {!selectedAlgorithmId && (
                <p>Select an algorithm and click "Visualize" to see its explanation here.</p>
             )}
      </section>

       <hr />


      <section className="simulation-results-section">
          {(visualizationResult || metrics) && <h2>Simulation Results</h2>}

          {visualizationResult && (
               <div className="gantt-chart-container-wrapper">
                   <h3>Gantt Chart</h3>
                   <GanttChart timeSlices={visualizationResult} />
               </div>
           )}

           {metrics && (
                <div className="metrics-table-container-wrapper">
                   <h3>Metrics</h3>
                   <MetricsTable metrics={metrics} />
               </div>
           )}
       </section>

    </div>
  );
}

export default App;