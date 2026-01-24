// src/components/MetricsTable.jsx
import React from 'react';
import '../styles/MetricsTable.css';

const MetricsTable = ({ metrics }) => {
  if (!metrics || !metrics.perProcess || metrics.perProcess.length === 0) {
    return (
      <div className="metrics-container">
        <p>No metrics data available. Run a simulation first.</p>
      </div>
    );
  }

  const { perProcess, average } = metrics;
  const hasAverageMetrics = average && typeof average.avgTurnaroundTime === 'number' && typeof average.avgWaitingTime === 'number';

  return (
    <div className="metrics-container">
      <table>
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Arrival Time (AT)</th>
            <th>Burst Time (BT)</th>
            <th>Completion Time (CT)</th>
            <th>Turnaround Time (TT)</th>
            <th>Waiting Time (WT)</th>
            <th>Response Time</th>
            {perProcess[0] && perProcess[0].priority !== undefined && <th>Priority</th>}
          </tr>
        </thead>
        <tbody>
          {perProcess.map(p => (
            <tr key={`metrics-${p.processId}`}>
              <td>{p.processId}</td>
              <td>{p.arrivalTime !== undefined ? p.arrivalTime : '-'}</td>
              <td>{p.burstTimeOriginal !== undefined ? p.burstTimeOriginal : '-'}</td>
              <td>{p.completionTime !== 'N/A' ? p.completionTime : '-'}</td>
              <td>{p.turnaroundTime !== 'N/A' ? p.turnaroundTime : '-'}</td>
              <td>{p.waitingTime !== 'N/A' ? p.waitingTime : '-'}</td>
              <td>{p.responseTime !== 'N/A' ? p.responseTime : '-'}</td>
              {p.priority !== undefined && <td>{p.priority}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      {hasAverageMetrics && (
        <div className="metrics-cards">
          <div className="metric-card">
            <div className="metric-title">Average Turnaround Time</div>
            <div className="metric-value">{average.avgTurnaroundTime.toFixed(2)}</div>
            <div className="metric-description">
              Average time taken for processes to complete
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Average Waiting Time</div>
            <div className="metric-value">{average.avgWaitingTime.toFixed(2)}</div>
            <div className="metric-description">
              Average time processes spent waiting
            </div>
          </div>
        </div>
      )}
      {!hasAverageMetrics && perProcess.length > 0 && (
        <p className="metrics-info">Could not calculate average metrics (likely no processes completed).</p>
      )}
    </div>
  );
};

export default MetricsTable;