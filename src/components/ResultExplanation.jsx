import React from 'react';
import '../styles/ResultExplanation.css';

const ResultExplanation = ({ metrics, algorithmId }) => {
  if (!metrics || !metrics.perProcess) {
    return null;
  }

  const { perProcess, average } = metrics;
  const processCount = perProcess.length;
  const completedCount = perProcess.filter(p => p.completionTime !== 'N/A').length;

  const getAlgorithmSpecificAnalysis = () => {
    switch (algorithmId) {
      case 'fcfs':
        return "First Come First Serve (FCFS) executes processes in order of arrival. It's simple but can lead to longer waiting times if longer processes arrive first.";
      case 'sjf-non':
        return "Shortest Job First (Non-preemptive) prioritizes shorter processes, which can improve average waiting time but may cause starvation of longer processes.";
      case 'sjf-pre':
        return "Shortest Remaining Time First (Preemptive SJF) can lead to better response times but has higher context switching overhead.";
      case 'priority-non':
        return "Priority Scheduling (Non-preemptive) executes based on priority, which can be effective but may cause starvation of lower priority processes.";
      case 'priority-pre':
        return "Preemptive Priority Scheduling allows higher priority processes to interrupt lower priority ones, improving response time for critical processes.";
      case 'rr':
        return "Round Robin provides fair CPU distribution and good response time, but setting the optimal time quantum is crucial for performance.";
      default:
        return "Analysis of the scheduling algorithm's performance based on the results.";
    }
  };

  return (
    <div className="result-explanation">
      <h3>Results Analysis</h3>
      <div className="explanation-cards">
        <div className="explanation-card summary">
          <h4>Summary</h4>
          <ul>
            <li>Total Processes: {processCount}</li>
            <li>Completed Processes: {completedCount}</li>
            <li>Average Waiting Time: {average.avgWaitingTime.toFixed(2)} units</li>
            <li>Average Turnaround Time: {average.avgTurnaroundTime.toFixed(2)} units</li>
          </ul>
        </div>
        
        <div className="explanation-card analysis">
          <h4>Algorithm Analysis</h4>
          <p>{getAlgorithmSpecificAnalysis()}</p>
          <p>
            {average.avgWaitingTime < 5 
              ? "✅ Good performance: Low average waiting time indicates efficient process scheduling."
              : "⚠️ Consider optimization: Higher average waiting time detected."}
          </p>
        </div>

        <div className="explanation-card recommendations">
          <h4>Recommendations</h4>
          <p>
            {average.avgWaitingTime > 10 && "Consider using a different scheduling algorithm to reduce waiting times."}
            {algorithmId === 'rr' && "Adjust the time quantum based on process characteristics."}
            {algorithmId.includes('priority') && "Monitor for potential process starvation."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultExplanation;