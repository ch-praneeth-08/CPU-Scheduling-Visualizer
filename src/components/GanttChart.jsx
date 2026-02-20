import React from 'react';
import '../styles/GanttChart.css';

// Update the processColors array with more professional colors
const processColors = [
  'rgba(66, 133, 244, 0.85)',   // Google Blue
  'rgba(52, 168, 83, 0.85)',    // Subtle Green
  'rgba(251, 188, 4, 0.85)',    // Warm Yellow
  'rgba(234, 67, 53, 0.85)',    // Soft Red
  'rgba(103, 58, 183, 0.85)',   // Subtle Purple
  'rgba(0, 150, 136, 0.85)',    // Teal
  'rgba(63, 81, 181, 0.85)',    // Indigo
  'rgba(233, 30, 99, 0.85)',    // Pink
  'rgba(96, 125, 139, 0.85)',   // Blue Grey
  'rgba(255, 112, 67, 0.85)'    // Coral
];

// Update the getProcessColor function to handle hover state
const getProcessColor = (processId, isHovered = false) => {
  if (!processId) return 'rgba(148, 163, 184, 0.85)';
  if (processId === 'Idle') return 'rgba(241, 245, 249, 0.85)';

  try {
    let colorIndex;
    if (typeof processId === 'number' || !isNaN(processId)) {
      colorIndex = (parseInt(processId) - 1) % processColors.length;
    } else {
      const matches = processId.match(/\d+/);
      if (matches) {
        colorIndex = (parseInt(matches[0]) - 1) % processColors.length;
      } else {
        return 'rgba(148, 163, 184, 0.85)';
      }
    }
    
    const color = processColors[colorIndex];
    return isHovered ? color.replace('0.85', '1') : color;
  } catch (error) {
    return 'rgba(148, 163, 184, 0.85)';
  }
};

const GanttChart = ({ timeSlices }) => {
  if (!timeSlices || timeSlices.length === 0) {
    return <div className="gantt-container empty">No data to display</div>;
  }

  // --- Calculations for Layout ---

  // 1. Determine the total simulation time.
  //    This is the endTime of the very last time slice.
  //    It's crucial that the timeSlices are sorted by startTime for this.
  //    While our algorithm is expected to sort, let's sort defensively here too.
   const sortedTimeSlices = [...timeSlices].sort((a, b) => {
       if (a.startTime === b.startTime) {
           // If start times are same, sort by end time (longer slices first)
           // This isn't strictly necessary for calculation here but good for logic robustness
           return b.endTime - a.endTime;
       }
       return a.startTime - b.startTime;
    });

  // Find the latest end time among all slices.
  // If there are slices, find the maximum endTime. If not, total time is 0.
  const totalTime = sortedTimeSlices.reduce((maxTime, slice) => Math.max(maxTime, slice.endTime), 0);

  // 2. Define the scale factor: pixels per time unit.
  //    Adjust this value to make the chart wider or narrower.
  //    A larger value spreads out the chart horizontally.
  const scaleFactor = 30; // e.g., 30 pixels represent 1 time unit

  // 3. Calculate the total chart width in pixels.
  const chartWidth = totalTime * scaleFactor;

  // 4. Generate time markers for the timeline axis.
  //    We want markers at key points (like start/end of slices) and regular intervals.
  const markersSet = new Set(); // Use a Set to automatically handle duplicates

  // Add time 0 and totalTime always
  markersSet.add(0);
  if (totalTime > 0) {
       markersSet.add(totalTime);
  }


  // Add start and end times of *every* slice as potential markers
  timeSlices.forEach(slice => {
      markersSet.add(slice.startTime);
      markersSet.add(slice.endTime);
  });

  // Add markers at regular intervals (e.g., every 5 or 10 time units) for context
  const interval = 5; // Or 10, depends on typical simulation time range
   for(let i = interval; i < totalTime; i += interval) {
        markersSet.add(i);
   }


  // Convert Set back to an array and sort numerically
  const timeMarkers = Array.from(markersSet).sort((a, b) => a - b);


  // --- Render the Chart ---
  return (
    <div className="gantt-container">
      <div className="gantt-timeline">
        {timeSlices.map((slice, index) => {
          const color = getProcessColor(slice.processId);
          console.log(`Process ${slice.processId} color: ${color}`);
          
          return (
            <div 
              key={index}
              className={`time-slot ${slice.isIdle ? 'idle' : ''}`}
              style={{
                width: `${slice.duration * 60}px`,
                backgroundColor: color,
                color: slice.isIdle ? '#64748b' : 'white',
                borderRight: '2px solid white'
              }}
            >
              <span className="process-label">{slice.processId}</span>
              <span className="duration-label">({slice.duration})</span>
            </div>
          );
        })}
      </div>

      <div className="time-labels">
        {timeSlices.map((slice, index) => (
          <div 
            key={index}
            className="time-label"
            style={{ width: `${slice.duration * 60}px` }}
          >{slice.startTime}</div>
        ))}
        <div className="time-label">
          {timeSlices[timeSlices.length - 1]?.endTime}
        </div>
      </div>

      <div className="legend">
        {Array.from(new Set(timeSlices.map(s => s.processId))).map(processId => (
          <div key={processId} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: getProcessColor(processId) }}
            />
            <span className="legend-label">{processId}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;