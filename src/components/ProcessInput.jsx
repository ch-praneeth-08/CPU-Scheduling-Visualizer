import React, { useState } from 'react';
import '../styles/ProcessInput.css';

const ProcessInput = ({ processes, onAddProcess }) => {
  const [newProcess, setNewProcess] = useState({
    arrivalTime: '',
    burstTime: '',
    priority: '',
  });

  const [errors, setErrors] = useState({
    arrivalTime: '',
    burstTime: '',
    priority: ''
  });

  const validateInput = () => {
    const newErrors = {};
    const arrival = parseInt(newProcess.arrivalTime);
    const burst = parseInt(newProcess.burstTime);
    const priority = newProcess.priority ? parseInt(newProcess.priority) : undefined;

    // Arrival time validation
    if (isNaN(arrival) || arrival < 0) {
      newErrors.arrivalTime = "Arrival time must be a non-negative number";
    }

    // Burst time validation
    if (isNaN(burst) || burst <= 0) {
      newErrors.burstTime = "Burst time must be greater than 0";
    }

    // Priority validation (optional)
    if (newProcess.priority && (isNaN(priority) || priority < 1)) {
      newErrors.priority = "Priority must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProcess(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const addProcess = () => {
    if (!validateInput()) {
      return;
    }

    const processToAdd = {
      arrivalTime: parseInt(newProcess.arrivalTime),
      burstTime: parseInt(newProcess.burstTime),
      priority: newProcess.priority ? parseInt(newProcess.priority) : undefined
    };

    onAddProcess(processToAdd);
    
    // Clear the form and errors
    setNewProcess({
      arrivalTime: '',
      burstTime: '',
      priority: '',
    });
    setErrors({
      arrivalTime: '',
      burstTime: '',
      priority: ''
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addProcess();
    }
  };

  return (
    <div className="process-input-container">
      <div className="input-section">
        <div className="input-group">
          <div className="input-field">
            <label htmlFor="arrivalTime">Arrival Time</label>
            <input
              id="arrivalTime"
              type="number"
              name="arrivalTime"
              value={newProcess.arrivalTime}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              min="0"
              placeholder="0"
              className={errors.arrivalTime ? 'error' : ''}
            />
            {errors.arrivalTime && (
              <span className="error-message">
                {errors.arrivalTime}
              </span>
            )}
          </div>

          <div className="input-field">
            <label htmlFor="burstTime">Burst Time</label>
            <input
              id="burstTime"
              type="number"
              name="burstTime"
              value={newProcess.burstTime}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              min="1"
              placeholder="1"
              className={errors.burstTime ? 'error' : ''}
            />
            {errors.burstTime && (
              <span className="error-message">
                {errors.burstTime}
              </span>
            )}
          </div>

          <div className="input-field">
            <label htmlFor="priority">Priority (Optional)</label>
            <input
              id="priority"
              type="number"
              name="priority"
              value={newProcess.priority}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              min="1"
              placeholder="Priority"
              className={errors.priority ? 'error' : ''}
            />
            {errors.priority && (
              <span className="error-message">
                {errors.priority}
              </span>
            )}
          </div>

          <button 
            className="add-button" 
            onClick={addProcess}
          >
            Add Process
          </button>
        </div>
      </div>
      
      {/* Process Table */}
      <div className="process-table-container">
        <h3 className="table-title">Process List ({processes.length} processes)</h3>
        {Array.isArray(processes) && processes.length > 0 ? (
          <div className="table-wrapper">
            <table className="process-table">
              <thead>
                <tr>
                  <th>Process ID</th>
                  <th>Arrival Time</th>
                  <th>Burst Time</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {processes.map(process => (
                  <tr key={process.id}>
                    <td>P{process.id}</td>
                    <td>{process.arrivalTime}</td>
                    <td>{process.burstTime}</td>
                    <td>{process.priority === undefined ? '-' : process.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <svg 
              className="empty-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No processes added yet</p>
            <span className="empty-hint">Add your first process using the form above</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessInput;
