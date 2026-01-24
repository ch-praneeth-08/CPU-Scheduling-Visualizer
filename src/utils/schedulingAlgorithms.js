// src/utils/schedulingAlgorithms.js

// Set to true for more detailed console logs from algorithm simulations
const verboseLogs = false;

// =================================================================
// Utility Function: Calculate Metrics
// =================================================================

/**
 * Calculates completion time (CT), turnaround time (TT), and waiting time (WT)
 * for each process from the original list, and the average TT and WT.
 * Handles cases where a process might not have completed execution.
 */
const calculateMetrics = (originalProcesses, completedProcesses) => {
     const metrics = [];
     let totalTurnaroundTime = 0;
     let totalWaitingTime = 0;

     const completionTimes = {};
     completedProcesses.forEach(p => {
          if (typeof p.completionTime === 'number' && p.completionTime >= 0) {
               completionTimes[p.id] = p.completionTime;
          } else {
              // verboseLogs && console.warn(`Metrics calculation: Process ${p.id} has invalid or missing completionTime: ${p.completionTime}`);
               completionTimes[p.id] = undefined;
          }
     });

     const originalProcessesMap = {};
     originalProcesses.forEach(p => {
         originalProcessesMap[p.id] = p;
     });

     originalProcesses.forEach(process => {
         const originalProcessDetails = originalProcessesMap[process.id];
         const completionTime = completionTimes[process.id];

         if (originalProcessDetails && typeof completionTime === 'number') {
              const turnaroundTime = completionTime - originalProcessDetails.arrivalTime;
              const waitingTime = turnaroundTime - originalProcessDetails.burstTime;

               metrics.push({
                   processId: originalProcessDetails.id,
                   arrivalTime: originalProcessDetails.arrivalTime,
                   burstTimeOriginal: originalProcessDetails.burstTime,
                   priority: originalProcessDetails.priority,
                   completionTime: completionTime,
                   turnaroundTime: turnaroundTime,
                   waitingTime: waitingTime,
               });

              totalTurnaroundTime += turnaroundTime;
              totalWaitingTime += waitingTime;
           } else {
                metrics.push({
                    processId: process.id,
                    arrivalTime: process.arrivalTime,
                    burstTimeOriginal: process.burstTime,
                    priority: process.priority,
                    completionTime: 'N/A',
                    turnaroundTime: 'N/A',
                    waitingTime: 'N/A',
                });
                // verboseLogs && console.warn(`Metrics calculation: Process ${process.id} did not complete successfully (no valid CT found).`);
           }
     });

     const completedMetricsEntries = metrics.filter(m => typeof m.completionTime === 'number');
     const numberOfCompletedProcesses = completedMetricsEntries.length;


     const avgTurnaroundTime = numberOfCompletedProcesses > 0 ? totalTurnaroundTime / numberOfCompletedProcesses : 0;
     const avgWaitingTime = numberOfCompletedProcesses > 0 ? totalWaitingTime / numberOfCompletedProcesses : 0;


     return {
         perProcess: metrics,
         average: {
             avgTurnaroundTime: avgTurnaroundTime,
             avgWaitingTime: avgWaitingTime
         }
     };
};

// =================================================================
// FCFS (First-Come, First-Served)
// =================================================================

/**
 * Runs the FCFS scheduling algorithm.
 */
const runFCFS = (processes) => {
     verboseLogs && console.log("runFCFS: Starting simulation...");

    let processesCopy = JSON.parse(JSON.stringify(processes));

     processesCopy = processesCopy.map(p => ({
          ...p,
          burstRemaining: p.burstTime,
          completed: false,
          completionTime: -1,
          startTime: -1,
          hasStarted: false
     }));

    processesCopy.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const timeSlices = [];
    const completedProcesses = [];
    let currentTime = 0;

    for (let i = 0; i < processesCopy.length; i++) {
        const currentProcess = processesCopy[i];

        if (currentTime < currentProcess.arrivalTime) {
             const idleDuration = currentProcess.arrivalTime - currentTime;
             timeSlices.push({
                 processId: 'Idle',
                 startTime: currentTime,
                 endTime: currentProcess.arrivalTime,
                 duration: idleDuration,
                 isIdle: true,
             });
             currentTime = currentProcess.arrivalTime;
             verboseLogs && console.log(`runFCFS: CPU idle from ${timeSlices[timeSlices.length-1].startTime} to ${currentTime}.`);
        }

         if (currentProcess.burstTime > 0 && currentTime >= currentProcess.arrivalTime) {
              if (!currentProcess.hasStarted) {
                  currentProcess.startTime = currentTime;
                  currentProcess.hasStarted = true;
                   verboseLogs && console.log(`runFCFS: Process ${currentProcess.id} first started at ${currentTime}.`);
              }

               const startTimeSlice = currentTime;
               currentTime += currentProcess.burstTime;
               const endTimeSlice = currentTime;

               timeSlices.push({
                   processId: currentProcess.id,
                   startTime: startTimeSlice,
                   endTime: endTimeSlice,
                   duration: currentProcess.burstTime,
                   isIdle: false,
               });
                verboseLogs && console.log(`runFCFS: Process ${currentProcess.id} ran from ${startTimeSlice} to ${endTimeSlice} (duration ${currentProcess.burstTime}).`);


               currentProcess.completionTime = currentTime;
               currentProcess.completed = true;
               completedProcesses.push(currentProcess);
                verboseLogs && console.log(`runFCFS: Process ${currentProcess.id} completed fully at time ${currentTime}. Completed count: ${completedProcesses.length}/${processesCopy.length}.`);


         } else if (currentProcess.burstTime <= 0) {
              console.warn(`runFCFS: Process ${currentProcess.id} has invalid burst time (${currentProcess.burstTime}), marking as completed immediately.`);
             if (currentProcess.arrivalTime > currentTime) {
                  currentProcess.completionTime = currentProcess.arrivalTime;
             } else {
                  currentProcess.completionTime = currentTime;
             }
               if(currentProcess.burstTime >= 0 && !currentProcess.hasStarted) {
                    currentProcess.startTime = currentProcess.completionTime;
                    currentProcess.hasStarted = true;
               }
             currentProcess.completed = true;
              completedProcesses.push(currentProcess);
               verboseLogs && console.log(`runFCFS: Process ${currentProcess.id} (burst <= 0) completed instantly at time ${currentProcess.completionTime}. Completed count: ${completedProcesses.length}/${processesCopy.length}.`);
         }
    }

     verboseLogs && console.log("runFCFS: Simulation complete.");
     verboseLogs && console.log("runFCFS: Final Completed Processes:", completedProcesses);

    const metrics = calculateMetrics(processes, completedProcesses);
     // console.log("runFCFS: Calculated metrics:", metrics);

    return {
        timeSlices: timeSlices,
        metrics: metrics,
    };
};

// =================================================================
// SJF (Shortest Job First) Non-Preemptive
// =================================================================
/**
 * Runs the Non-Preemptive SJF scheduling algorithm.
 */
const runSJF = (processes) => {
    verboseLogs && console.log("runSJF: Starting Non-Preemptive simulation...");

    let processesCopy = JSON.parse(JSON.stringify(processes));
    processesCopy = processesCopy.map(p => ({
        ...p,
        burstRemaining: p.burstTime,
        completed: false,
        completionTime: -1,
        startTime: -1,
        hasStarted: false
    }));

    const sortedArrivals = [...processesCopy].sort((a, b) => a.arrivalTime - b.arrivalTime);

    const timeSlices = [];
    const completedProcesses = [];
    let currentTime = 0;
    const readyQueue = [];
    let arrivalIndex = 0;

    while (completedProcesses.length < processesCopy.length) {
        while (arrivalIndex < sortedArrivals.length && sortedArrivals[arrivalIndex].arrivalTime <= currentTime) {
            const arrivingProcess = sortedArrivals[arrivalIndex];
            const processInCopy = processesCopy.find(p => p.id === arrivingProcess.id);
            if (processInCopy && !processInCopy.completed) {
                 readyQueue.push(processInCopy);
                 verboseLogs && console.log(`runSJF: Process ${arrivingProcess.id} arrived at time ${arrivingProcess.arrivalTime}. Adding to ready queue.`);
            } //else { verboseLogs && console.log(`runSJF: Process ${arrivingProcess.id} arrived but not added...`); }
            arrivalIndex++;
        }

         let processToRunNow = null;

         if (readyQueue.length > 0) {
             readyQueue.sort((a, b) => {
                if (a.burstRemaining !== b.burstRemaining) {
                    return a.burstRemaining - b.burstRemaining;
                }
                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }
                 if (a.arrivalTime !== b.arrivalTime) {
                     return a.arrivalTime - b.arrivalTime;
                 }
                 return a.id.localeCompare(b.id);
            });

            processToRunNow = readyQueue.shift();
            // verboseLogs && console.log(`runSJF: Selected process ${processToRunNow.id} (BT ${processToRunNow.burstTime}) from ready queue. Queue length now: ${readyQueue.length}.`);

        } else {
             if (arrivalIndex < sortedArrivals.length) {
                 const nextArrivalTime = sortedArrivals[arrivalIndex].arrivalTime;
                  if (currentTime < nextArrivalTime) {
                    const idleDuration = nextArrivalTime - currentTime;
                    timeSlices.push({
                       processId: 'Idle',
                       startTime: currentTime,
                       endTime: nextArrivalTime,
                       duration: idleDuration,
                       isIdle: true,
                    });
                     currentTime = nextArrivalTime;
                    //  verboseLogs && console.log(`runSJF: CPU idle from ${timeSlices[timeSlices.length-1].startTime} to ${currentTime}.`);
                     continue;
                  }
             }
             // Safeguard break if queue is empty and no more arrivals, but processes not completed
             if(arrivalIndex >= sortedArrivals.length && readyQueue.length === 0) break;
        }

        if (processToRunNow && processToRunNow.burstTime > 0) {
            const processInCopy = processesCopy.find(p => p.id === processToRunNow.id);
             if (processInCopy) {
                 if (!processInCopy.hasStarted) {
                      processInCopy.startTime = currentTime;
                      processInCopy.hasStarted = true;
                    //   verboseLogs && console.log(`runSJF: Process ${processInCopy.id} first started at ${currentTime}.`);
                 }

                const startTimeSlice = currentTime;
                const runDuration = processInCopy.burstTime;
                currentTime += runDuration;
                const endTimeSlice = currentTime;

                timeSlices.push({
                   processId: processInCopy.id,
                   startTime: startTimeSlice,
                   endTime: endTimeSlice,
                   duration: runDuration,
                   isIdle: false,
               });
                // verboseLogs && console.log(`runSJF: Process ${processInCopy.id} ran from ${startTimeSlice} to ${endTimeSlice} (duration ${runDuration}).`);


                processInCopy.burstRemaining = 0;
                processInCopy.completed = true;
                processInCopy.completionTime = currentTime;
                completedProcesses.push(processInCopy);
                // verboseLogs && console.log(`runSJF: Process ${processInCopy.id} completed fully at time ${currentTime}. Completed count: ${completedProcesses.length}/${processesCopy.length}.`);
           } //else { console.error(`runSJF: Process selected to run but not found in copy...`); }
       } else if (processToRunNow && processToRunNow.burstTime <= 0) {
            console.warn(`runSJF: Process ${processToRunNow.id} selected with invalid burst time (${processToRunNow.burstTime}), marking completed.`);
            const processInCopy = processesCopy.find(p => p.id === processToRunNow.id);
            if (processInCopy && !processInCopy.completed) {
                 if (!processInCopy.hasStarted) { processInCopy.startTime = currentTime; processInCopy.hasStarted = true;}
                 processInCopy.completionTime = currentTime;
                 processInCopy.completed = true;
                 completedProcesses.push(processInCopy);
                //  verboseLogs && console.log(`runSJF: Process ${processInCopy.id} (burst <= 0) completed instantly at ${currentTime}. Completed count: ${completedProcesses.length}/${processesCopy.length}.`);
             }
       }
    }

    // console.log("runSJF: Simulation complete. Final Completed Processes:", completedProcesses);
    const metrics = calculateMetrics(processes, completedProcesses);
    // console.log("runSJF: Calculated metrics:", metrics);

    return {
        timeSlices: timeSlices,
        metrics: metrics,
    };
};


// =================================================================
// Priority Scheduling Algorithm (Non-Preemptive)
// =================================================================
/**
 * Runs the Non-Preemptive Priority scheduling algorithm.
 * Requires processes to have a 'priority' property (integer >= 1).
 * Tie-breaking: FCFS (earliest arrival), then Process ID.
 */
const runPriority = (processes) => {
     verboseLogs && console.log("runPriority: Starting Non-Preemptive simulation...");

     const missingOrInvalidPriority = processes.some(p =>
         p.priority === undefined || p.priority === null || !Number.isInteger(p.priority) || p.priority < 1
     );
     if (missingOrInvalidPriority) {
        console.error("runPriority: Validation failed. Processes require valid integer priority >= 1.");
         return { timeSlices: [], metrics: calculateMetrics(processes, []) };
     }

     let processesCopy = JSON.parse(JSON.stringify(processes));

     processesCopy = processesCopy.map(p => ({
         ...p,
         burstRemaining: p.burstTime,
         completed: false,
         completionTime: -1,
         startTime: -1,
         hasStarted: false
    }));

     const sortedArrivals = [...processesCopy].sort((a, b) => a.arrivalTime - b.arrivalTime);

     const timeSlices = [];
     const completedProcesses = [];
     let currentTime = 0;
     const readyQueue = [];
     let arrivalIndex = 0;

     while (completedProcesses.length < processesCopy.length) {
        while (arrivalIndex < sortedArrivals.length && sortedArrivals[arrivalIndex].arrivalTime <= currentTime) {
               const arrivingProcess = sortedArrivals[arrivalIndex];
               const processInCopy = processesCopy.find(p => p.id === arrivingProcess.id);
               if(processInCopy && !processInCopy.completed) {
                    readyQueue.push(processInCopy);
                   verboseLogs && console.log(`runPriority: Process ${arrivingProcess.id} arrived at time ${arrivingProcess.arrivalTime} (Pri ${arrivingProcess.priority}). Adding to ready queue. Queue length: ${readyQueue.length}.`);
               } //else { verboseLogs && console.log(`runPriority: Process ${arrivingProcess.id} arrived but not added...`);}
               arrivalIndex++;
         }

         let processToRunNow = null;
         if (readyQueue.length > 0) {
             readyQueue.sort((a, b) => {
                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }
                if (a.arrivalTime !== b.arrivalTime) {
                    return a.arrivalTime - b.arrivalTime;
                }
                return a.id.localeCompare(b.id);
            });
             processToRunNow = readyQueue.shift();
            //  verboseLogs && console.log(`runPriority: Selected process ${processToRunNow.id} (Pri ${processToRunNow.priority}) from ready queue. Queue length now: ${readyQueue.length}.`);

         } else {
             if (arrivalIndex < sortedArrivals.length) {
                  const nextArrivalTime = sortedArrivals[arrivalIndex].arrivalTime;
                 if (currentTime < nextArrivalTime) {
                     const idleDuration = nextArrivalTime - currentTime;
                     timeSlices.push({
                         processId: 'Idle',
                         startTime: currentTime,
                         endTime: nextArrivalTime,
                         duration: idleDuration,
                         isIdle: true,
                     });
                      currentTime = nextArrivalTime;
                    //  verboseLogs && console.log(`runPriority: CPU idle from ${timeSlices[timeSlices.length-1].startTime} to ${currentTime}.`);
                      continue;
                 }
              }
             // Safeguard break
             if(arrivalIndex >= sortedArrivals.length && readyQueue.length === 0) break;
         }

         if (processToRunNow && processToRunNow.burstTime > 0) {
             const processInCopy = processesCopy.find(p => p.id === processToRunNow.id);
             if(processInCopy){
                 if (!processInCopy.hasStarted) {
                      processInCopy.startTime = currentTime;
                      processInCopy.hasStarted = true;
                    //   verboseLogs && console.log(`runPriority: Process ${processInCopy.id} first started at ${currentTime}.`);
                 }

                 const startTimeSlice = currentTime;
                 const runDuration = processInCopy.burstTime;
                 currentTime += runDuration;
                 const endTimeSlice = currentTime;

                 timeSlices.push({
                   processId: processInCopy.id,
                   startTime: startTimeSlice,
                   endTime: endTimeSlice,
                   duration: runDuration,
                   isIdle: false,
               });
                //  verboseLogs && console.log(`runPriority: Process ${processInCopy.id} ran from ${startTimeSlice} to ${endTimeSlice} (duration ${runDuration}).`);


                processInCopy.burstRemaining = 0;
                processInCopy.completed = true;
                processInCopy.completionTime = currentTime;
                completedProcesses.push(processInCopy);
                // verboseLogs && console.log(`runPriority: Process ${processInCopy.id} completed fully at time ${currentTime}. Completed count: ${completedProcesses.length}/${processesCopy.length}.`);

            } //else { console.error(`runPriority: Process selected but not found in copy...`);}
         } else if (processToRunNow && processToRunNow.burstTime <= 0) {
              console.warn(`runPriority: Process ${processToRunNow.id} selected with invalid burst time (${processToRunNow.burstTime}), marking completed.`);
             const processInCopy = processesCopy.find(p => p.id === processToRunNow.id);
             if (processInCopy && !processInCopy.completed) {
                  if (!processInCopy.hasStarted) { processInCopy.startTime = currentTime; processInCopy.hasStarted = true;}
                  processInCopy.completionTime = currentTime;
                  processInCopy.completed = true;
                  completedProcesses.push(processInCopy);
                //  verboseLogs && console.log(`runPriority: Process ${processInCopy.id} (burst <= 0) completed instantly at ${currentTime}. Completed count: ${completedProcesses.length}/${processesCopy.length}.`);
             }
         }
     }

     // console.log("runPriority: Simulation complete. Final Completed Processes:", completedProcesses);
     const metrics = calculateMetrics(processes, completedProcesses);
     // console.log("runPriority: Calculated metrics:", metrics);

    return {
        timeSlices: timeSlices,
        metrics: metrics,
    };
};


// =================================================================
// Round Robin Scheduling Algorithm (Preemptive)
// =================================================================
/**
 * Runs the Round Robin scheduling algorithm.
 * Requires a positive integer time quantum.
 * Tie-breaking in ready queue selection is FIFO.
 */
const runRoundRobin = (processes, quantum) => {
    verboseLogs && console.log(`Starting Round Robin with quantum = ${quantum}`);

    if (quantum <= 0 || !Number.isInteger(quantum)) {
        console.error("Quantum must be a positive integer.");
        return { timeSlices: [], metrics: calculateMetrics(processes, []) };
    }

    // Deep copy and initialize process states
    let processesCopy = processes.map(p => ({
        ...p,
        burstRemaining: p.burstTime,
        completed: false,
        startTime: -1,
        completionTime: -1,
    }));

    const timeSlices = [];
    const readyQueue = [];
    let currentTime = 0;
    let arrivalIndex = 0;

    const sortedArrivals = [...processesCopy].sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (
        processesCopy.some(p => !p.completed) ||
        readyQueue.length > 0 ||
        arrivalIndex < sortedArrivals.length
    ) {
        // First, check for new arrivals
        while (arrivalIndex < sortedArrivals.length &&
               sortedArrivals[arrivalIndex].arrivalTime <= currentTime) {
            const proc = sortedArrivals[arrivalIndex];
            readyQueue.push(proc);
            arrivalIndex++;
        }

        // If no process is ready, advance time to next arrival
        if (readyQueue.length === 0) {
            let nextArrival = sortedArrivals[arrivalIndex]?.arrivalTime ?? currentTime + 1;
            timeSlices.push({
                processId: "Idle",
                startTime: currentTime,
                endTime: nextArrival,
                duration: nextArrival - currentTime,
                isIdle: true
            });
            currentTime = nextArrival;
            continue;
        }

        // Get next process to run
        const process = readyQueue.shift();
        if (process.burstRemaining <= 0 || process.completed) continue;

        const runTime = Math.min(quantum, process.burstRemaining);
        if (process.startTime === -1) {
            process.startTime = currentTime;
        }

        // Execute the process
        const start = currentTime;
        const end = currentTime + runTime;
        timeSlices.push({
            processId: process.id,
            startTime: start,
            endTime: end,
            duration: runTime,
            isIdle: false,
        });

        currentTime = end;
        process.burstRemaining -= runTime;

        // Check for new arrivals again before re-queuing
        while (arrivalIndex < sortedArrivals.length &&
               sortedArrivals[arrivalIndex].arrivalTime <= currentTime) {
            const proc = sortedArrivals[arrivalIndex];
            readyQueue.push(proc);
            arrivalIndex++;
        }

        // Now handle the just-executed process
        if (process.burstRemaining === 0) {
            process.completed = true;
            process.completionTime = currentTime;
        } else {
            // Re-queue only after checking for new arrivals
            readyQueue.push(process);
        }
    }

    const completedProcesses = processesCopy.filter(p => p.completed);
    const metrics = calculateMetrics(processes, completedProcesses);

    return {
        timeSlices,
        metrics,
    };
};


// =================================================================
// SRTF (Shortest Remaining Time First) Preemptive SJF
// =================================================================
/**
 * Runs the SRTF (Preemptive SJF) scheduling algorithm.
 * Tie-breaking: FCFS (earliest arrival), then Process ID.
 */
const runSRTF = (processes) => {
    verboseLogs && console.log("runSRTF: Starting Preemptive SJF simulation...");

    let processesCopy = JSON.parse(JSON.stringify(processes));
    processesCopy = processesCopy.map(p => ({
        ...p,
        burstRemaining: p.burstTime,
        completed: false,
        completionTime: -1,
        startTime: -1,
        hasStarted: false
    }));

    const sortedArrivals = [...processesCopy].sort((a, b) => a.arrivalTime - b.arrivalTime);

    const timeSlices = [];
    let currentTime = 0;
    let readyQueue = []; // Can reassign after filter
    let arrivalIndex = 0;
    let currentRunningProcess = null;

     // Continue as long as there are processes not yet completed OR
     // processes waiting in the ready queue OR processes yet to arrive
    while (processesCopy.some(p => !p.completed) || readyQueue.length > 0 || arrivalIndex < sortedArrivals.length) {

        // Add newly arrived processes at or before current time to ready queue
        while (arrivalIndex < sortedArrivals.length && sortedArrivals[arrivalIndex].arrivalTime <= currentTime) {
             const arrivingProcess = sortedArrivals[arrivalIndex];
            const processInCopy = processesCopy.find(p => p.id === arrivingProcess.id);
             // Only add if not completed, not already in queue, and not the current running process
             if (processInCopy && !processInCopy.completed && !readyQueue.includes(processInCopy) && currentRunningProcess?.id !== processInCopy.id) {
                 readyQueue.push(processInCopy);
                //  verboseLogs && console.log(`runSRTF: Process ${processInCopy.id} arrived at time ${arrivingProcess.arrivalTime}. Adding to ready queue. Queue length: ${readyQueue.length}.`);
             } //else { verboseLogs && console.log(`runSRTF: Process ${arrivingProcess.id} arrived at ${currentTime}, but was not added to queue...`); }
            arrivalIndex++;
        }


         // --- Select the best candidate from the ready queue ---
        let bestCandidateInQueue = null;
        if (readyQueue.length > 0) {
             // Sort the ready queue by Shortest *Remaining* Time. Tie-breaking: Arrival Time, then ID.
              readyQueue.sort((a, b) => {
                 if (a.burstRemaining !== b.burstRemaining) {
                     return a.burstRemaining - b.burstRemaining;
                 }
                 if (a.arrivalTime !== b.arrivalTime) {
                     return a.arrivalTime - b.arrivalTime;
                 }
                  return a.id.localeCompare(b.id);
              });
            bestCandidateInQueue = readyQueue[0];
            // verboseLogs && console.log(`runSRTF: Best candidate from ready queue: ${bestCandidateInQueue.id} (rem ${bestCandidateInQueue.burstRemaining}). Queue length: ${readyQueue.length}`);
        } //else { verboseLogs && console.log("runSRTF: Ready queue is empty."); }

        // --- Preemption Decision / CPU State Update ---
        // Decide which process *should* be running NOW.
        let processToRunThisSegment = null;

        if (currentRunningProcess && currentRunningProcess.burstRemaining > 0) {
            // A process is running. Is there a better candidate (shorter remaining time)?
            if (bestCandidateInQueue && bestCandidateInQueue.burstRemaining < currentRunningProcess.burstRemaining) {
                 // Preempt! The candidate is shorter.
                 // Add the current running process back to ready queue before replacing it
                 if (!readyQueue.includes(currentRunningProcess)) {
                     readyQueue.push(currentRunningProcess);
                 }
                 processToRunThisSegment = bestCandidateInQueue;
            } else {
                 // No better candidate, or queue is empty. Current process continues.
                 processToRunThisSegment = currentRunningProcess;
                //  verboseLogs && console.log(`runSRTF: ${currentRunningProcess.id} remains running.`);
            }
        } else if (bestCandidateInQueue) {
             // No process running (idle or finished) and there's a candidate. Candidate starts.
             processToRunThisSegment = bestCandidateInQueue;
            //  verboseLogs && console.log(`runSRTF: CPU free. ${bestCandidateInQueue.id} starts.`);
        } // else processToRunThisSegment remains null (CPU idle)


         // Update currentRunningProcess for THIS iteration's segment
         // NOTE: This determines WHO IS ON THE CPU *during* the upcoming slice.
        currentRunningProcess = processToRunThisSegment;

        // Remove the actually running process from the readyQueue if it was just selected from it.
         // Check if currentRunningProcess exists, the queue is not empty, AND the first item in queue is the running process.
        if (currentRunningProcess && readyQueue.length > 0 && readyQueue[0]?.id === currentRunningProcess.id) {
              readyQueue.shift(); // Remove it as it's now 'on CPU'
            //   verboseLogs && console.log(`runSRTF: Dequeued ${currentRunningProcess.id} for execution. Queue length: ${readyQueue.length}`);
        }

        // Add this in both algorithms after processing a slice:
        if (currentRunningProcess && currentRunningProcess.burstRemaining <= 0) {
            currentRunningProcess.completed = true;
            currentRunningProcess.completionTime = currentTime;
            // Important: Remove from ready queue immediately
            readyQueue = readyQueue.filter(p => p.id !== currentRunningProcess?.id);
            currentRunningProcess = null;
            continue;
        }

        // --- Determine the End Time of the Next Slice (Next Event Time) ---
        // This is the EARLIEST time of a significant event: next arrival or current process finishes.
        let nextEventTime = Infinity;

        // 1. If CPU is idle: next event is the earliest upcoming arrival time.
        if (!currentRunningProcess) {
             if (arrivalIndex < sortedArrivals.length) {
                 nextEventTime = sortedArrivals[arrivalIndex].arrivalTime;
                //  verboseLogs && console.log(`runSRTF: CPU idle, next event is arrival at ${nextEventTime}.`);
             } else {
                // No more arrivals, queue empty, nothing running => Loop terminates.
                // verboseLogs && console.log("runSRTF: CPU idle, no future arrivals.");
                break; // All processes completed or unreachable
             }
        } else { // A process IS running (currentRunningProcess is not null and has > 0 burst remaining)

            // 1. Predicted completion time of the *currently running* process.
            const predictedCompletionTime = currentTime + currentRunningProcess.burstRemaining;
             nextEventTime = predictedCompletionTime;
            //  verboseLogs && console.log(`runSRTF: Running ${currentRunningProcess.id}, predicted completion at ${predictedCompletionTime}.`);


            // 2. Check if a future arrival occurs *before* predicted completion and would cause preemption.
            // We only care about processes arriving *strictly after* current time.
             for (let i = arrivalIndex; i < sortedArrivals.length; i++) {
                const futureProcess = sortedArrivals[i];
                 if (futureProcess.arrivalTime > currentTime && futureProcess.arrivalTime < predictedCompletionTime) {
                       // Check if this future process's *total burst* is shorter than the *current running process's remaining burst*.
                       if (futureProcess.burstTime < currentRunningProcess.burstRemaining - (futureProcess.arrivalTime - currentTime)) {
                           // Preemption will occur at futureProcess.arrivalTime. This is an earlier event time.
                          nextEventTime = futureProcess.arrivalTime;
                        //   verboseLogs && console.log(`runSRTF: Future process ${futureProcess.id} arriving at ${futureProcess.arrivalTime} (BT ${futureProcess.burstTime}). It is shorter than current rem ${currentRunningProcess.burstRemaining}. Setting next event to arrival.`);
                          // Since sortedArrivals is sorted by time, the first one we find that meets the condition
                          // will be the earliest preemption point due to a future arrival. Break loop.
                           break;
                       }
                   } else if (futureProcess.arrivalTime >= predictedCompletionTime) {
                      // Optimization: future arrivals are at or after predicted completion time.
                       break; // Stop checking further arrivals.
                   }
             }
            //  verboseLogs && console.log(`runSRTF: Next event time determined for ${currentRunningProcess?.id || 'Idle'}: ${nextEventTime}.`);
        }


        // If, after checks, nextEventTime is not greater than currentTime,
        // something is potentially wrong (stuck in time, logic error). Handle edge cases.
         const durationOfCurrentSegment = nextEventTime - currentTime;

        // Safeguard against getting stuck at the current time without processing:
        // If time doesn't advance BUT there are still uncompleted processes... break after reasonable attempts.
        // If duration is exactly 0, we let the loop run again to re-evaluate at the same time.
        // If duration is negative, something is critically wrong.
         if (durationOfCurrentSegment < 0) {
            console.error(`runSRTF: Detected negative time duration (${durationOfCurrentSegment}). Critical error. Breaking simulation.`);
             break; // Exit loop on severe error
         }
         // If duration is 0 and processes still incomplete, let the loop re-run at current time (managed implicitly).
          if (durationOfCurrentSegment === 0) continue;


         // --- Add Execution Slice and Advance Time ---

         // Only add a time slice if the duration is positive.
         if (durationOfCurrentSegment > 0) {
              const sliceStartTime = currentTime; // Segment begins
              currentTime = nextEventTime;      // Advance simulation time to the determined next event time
              const sliceEndTime = currentTime;     // Segment ends


            if (currentRunningProcess) { // If a process was on CPU during this segment
                  // Decrease remaining burst time by the duration it actually ran.
                const processInCopy = processesCopy.find(p => p.id === currentRunningProcess.id); // Get latest reference
                if(processInCopy) {
                   processInCopy.burstRemaining -= durationOfCurrentSegment;

                   // Add this slice to the visualization data.
                    timeSlices.push({
                        processId: processInCopy.id,
                        startTime: sliceStartTime,
                        endTime: sliceEndTime,
                        duration: durationOfCurrentSegment,
                        isIdle: false,
                    });
                   // console.log(`runSRTF: Added slice: ${processInCopy.id} from ${sliceStartTime} to ${sliceEndTime}. Rem ${processInCopy.burstRemaining}`);

                   // Record first start time if this is the very first slice for this process.
                    if (!processInCopy.hasStarted) {
                        processInCopy.startTime = sliceStartTime;
                        processInCopy.hasStarted = true;
                       //  console.log(`runSRTF: Process ${processInCopy.id} first started at ${currentRunningProcess.startTime}.`);
                    }

                   // Check if the process completed execution in this slice
                    if (processInCopy.burstRemaining <= 0) {
                        processInCopy.completed = true;
                       processInCopy.completionTime = currentTime; // Completion time is when the slice ended
                        // console.log(`runSRTF: Process ${processInCopy.id} completed fully at ${currentTime}. Completed count: ${processesCopy.filter(p=>p.completed).length}/${processesCopy.length}.`);
                        // Completed processes are removed from consideration/queue automatically.
                    } //else { console.log(`runSRTF: Process ${processInCopy.id} did not complete.`);}
                } else { console.error(`runSRTF: Current running process ${currentRunningProcess?.id} not found in processesCopy for burst update.`); currentRunningProcess = null;}

                // Add this in both algorithms after processing a slice:
                if (processInCopy.burstRemaining <= 0) {
                    processInCopy.completed = true;
                    processInCopy.completionTime = currentTime;
                    // Remove from ready queue and clear current running process
                    readyQueue = readyQueue.filter(p => p.id !== currentRunningProcess?.id);
                    currentRunningProcess = null;
                    
                    // Ensure no preemption happens at completion time
                    if (processInCopy.completionTime === currentTime) {
                        continue;
                    }
                }

            } else { // If CPU was idle during this segment
                 // Add an idle time slice for visualization.
                 timeSlices.push({
                     processId: 'Idle',
                     startTime: sliceStartTime,
                     endTime: sliceEndTime,
                     duration: durationOfCurrentSegment,
                     isIdle: true,
                 });
                //  console.log(`runSRTF: CPU idle slice from ${sliceStartTime} to ${sliceEndTime}.`);
            }
        }


        // After processing the slice and advancing time (or not),
        // ensure any processes that have completed are removed from the readyQueue before the next selection round.
         readyQueue = readyQueue.filter(p => !p.completed && p.id !== currentRunningProcess?.id);
        //  verboseLogs && console.log(`runSRTF: Cleaned readyQueue of completed processes. New length: ${readyQueue.length}`);


        // --- Safety Break: Prevent Infinite Loops ---
         // If time is stuck, no processes are completing, and nothing new is arriving/ready...
         if ( durationOfCurrentSegment <= 0 && // If duration wasn't positive (didn't advance or was 0)
              processesCopy.some(p => !p.completed) && // AND some processes are still NOT completed
             readyQueue.length === 0 && // AND ready queue is empty
             !currentRunningProcess && // AND nothing is running on CPU right now
             arrivalIndex >= sortedArrivals.length // AND no more arrivals are pending
            ) {
              // If all these conditions are met, the simulation is likely stuck in a time lock
              // without any process capable of breaking it (no arrivals, nothing in queue, nothing running to completion).
              console.error("runSRTF: Simulation stuck in an infinite loop state (Time not advancing, processes incomplete, queues empty, no arrivals). Breaking.");
             break;
         }


     } // End of while loop


     // console.log("runSRTF: Simulation complete.");
     // console.log("runSRTF: Generated time slices:", timeSlices);


     // Get the final list of completed processes from the copied array for metrics calculation.
     const finalCompletedProcesses = processesCopy.filter(p => p.completed);
    //  verboseLogs && console.log("runSRTF: Final Completed Processes for Metrics:", finalCompletedProcesses);


     // Calculate and return the metrics.
     const metrics = calculateMetrics(processes, finalCompletedProcesses);

    //  console.log("runSRTF: Calculated metrics:", metrics);


    return {
        timeSlices: timeSlices,
        metrics: metrics,
    };
 };


// =================================================================
// Priority Scheduling Algorithm (Preemptive) - FIX AND REFINEMENT
// =================================================================
/**
 * Runs the Preemptive Priority scheduling algorithm.
 * Requires processes to have a 'priority' property (integer >= 1).
 * Tie-breaking for processes with the same highest priority: FCFS (earliest arrival), then Process ID.
 */
const runPriorityPreemptive = (processes) => {
     verboseLogs && console.log("runPriorityPreemptive: Starting Preemptive simulation...");

    // Validation for priority presence and type
     const missingOrInvalidPriority = processes.some(p =>
         p.priority === undefined || p.priority === null || !Number.isInteger(p.priority) || p.priority < 1
     );
     if (missingOrInvalidPriority) {
         console.error("runPriorityPreemptive: Validation failed. Processes require valid integer priority >= 1.");
         return { timeSlices: [], metrics: calculateMetrics(processes, []) };
     }

    // Create deep copy with simulation properties
     let processesCopy = JSON.parse(JSON.stringify(processes));
     processesCopy = processesCopy.map(p => ({
         ...p,
         burstRemaining: p.burstTime,
         completed: false,
         completionTime: -1,
         startTime: -1,
         hasStarted: false // Track first start time
     }));

     // Sort processes by arrival time initially for managing arrivals
     const sortedArrivals = [...processesCopy].sort((a, b) => a.arrivalTime - b.arrivalTime);

    const timeSlices = [];

    let currentTime = 0;
    let readyQueue = [];
    let arrivalIndex = 0;

    let currentRunningProcess = null;


     // Simulate using event-driven loop
     while (processesCopy.some(p => !p.completed) || readyQueue.length > 0 || arrivalIndex < sortedArrivals.length) {

        // 1. Add newly arrived processes at or before current time to ready queue
        while (arrivalIndex < sortedArrivals.length && sortedArrivals[arrivalIndex].arrivalTime <= currentTime) {
            const arrivingProcess = sortedArrivals[arrivalIndex];
            const processInCopy = processesCopy.find(p => p.id === arrivingProcess.id);
            // Add if exists, not completed, not already in queue, and not currently running
             if (processInCopy && !processInCopy.completed && !readyQueue.includes(processInCopy) && currentRunningProcess?.id !== processInCopy.id) {
                 readyQueue.push(processInCopy);
                //  verboseLogs && console.log(`runPriorityPreemptive: Process ${processInCopy.id} arrived at time ${arrivingProcess.arrivalTime} (Pri ${processInCopy.priority}). Adding to ready queue. Queue length: ${readyQueue.length}.`);
             } //else { verboseLogs && console.log(`runPriorityPreemptive: Process ${arrivingProcess.id} arrived at ${currentTime} but was not added to queue.`); }
            arrivalIndex++;
        }


         // --- Select the best candidate process from the ready queue based on Priority ---
         let bestCandidateInQueue = null;
         if (readyQueue.length > 0) {
             // Sort the ready queue by Priority (Lowest number = Highest priority). Tie-breaking: Earliest Arrival Time, then Process ID.
             readyQueue.sort((a, b) => {
                 if (a.priority !== b.priority) {
                     return a.priority - b.priority;
                 }
                 if (a.arrivalTime !== b.arrivalTime) {
                     return a.arrivalTime - b.arrivalTime;
                 }
                 return a.id.localeCompare(b.id);
             });
           bestCandidateInQueue = readyQueue[0];
           //  verboseLogs && console.log(`runPriorityPreemptive: Best candidate from ready queue: ${bestCandidateInQueue.id} (Pri ${bestCandidateInQueue.priority}). Queue length: ${readyQueue.length}`);
        } //else { verboseLogs && console.log("runPriorityPreemptive: Ready queue is empty.");}


        // --- Preemption Decision & CPU State Update ---
        let processToRunThisSegment = null;

        if (currentRunningProcess && currentRunningProcess.burstRemaining > 0) {
            // Check for preemption only if new process has strictly higher priority
            if (bestCandidateInQueue && bestCandidateInQueue.priority < currentRunningProcess.priority) {
                // Add the current running process back to ready queue before preemption
                if (!readyQueue.includes(currentRunningProcess)) {
                    readyQueue.push(currentRunningProcess);
                }
                processToRunThisSegment = bestCandidateInQueue;
            } else {
                // Keep running current process if no higher priority process exists
                processToRunThisSegment = currentRunningProcess;
            }
        } else if (bestCandidateInQueue) {
             // No process running (was idle or finished) and there's a candidate. It starts.
             processToRunThisSegment = bestCandidateInQueue;
            //  verboseLogs && console.log(`runPriorityPreemptive: CPU was free. ${bestCandidateInQueue.id} will start running (Pri ${bestCandidateInQueue.priority}).`);
        } // else processToRunThisSegment remains null (CPU idle)


         // Update currentRunningProcess for THIS iteration's segment
       currentRunningProcess = processToRunThisSegment;


        // Remove the actually running process from the readyQueue if it was just selected from it.
         // If `currentRunningProcess` exists and is the first item in the sorted readyQueue.
       if (currentRunningProcess && readyQueue.length > 0 && readyQueue[0]?.id === currentRunningProcess.id) {
            readyQueue.shift();
           // console.log(`runPriorityPreemptive: Dequeued ${currentRunningProcess.id} for execution. Queue length: ${readyQueue.length}`);
       }

        // Add after preemption decision:
        if (currentRunningProcess && bestCandidateInQueue && 
            bestCandidateInQueue.priority < currentRunningProcess.priority) {
            // Add the preempted process back to ready queue
            if (!readyQueue.includes(currentRunningProcess)) {
                readyQueue.push(currentRunningProcess);
            }
        }

        // --- Determine the End Time of the Next Slice (Next Event Time) ---
        let nextEventTime = Infinity;

        // 1. If CPU is idle: next event is the earliest upcoming arrival time.
        if (!currentRunningProcess) {
             if (arrivalIndex < sortedArrivals.length) {
                 nextEventTime = sortedArrivals[arrivalIndex].arrivalTime;
                 // console.log(`runPriorityPreemptive: CPU idle, next event is arrival at ${nextEventTime}.`);
             } else {
                // No more arrivals, queue empty, nothing running => Loop terminates.
                // console.log("runPriorityPreemptive: CPU idle, no future arrivals.");
                break; // All processes completed or unreachable
             }
        } else { // A process IS running

            // 1. Predicted completion time of the *currently running* process.
            const predictedCompletionTime = currentTime + currentRunningProcess.burstRemaining;
             nextEventTime = predictedCompletionTime;
             // console.log(`runPriorityPreemptive: Running ${currentRunningProcess.id}, predicted completion at ${predictedCompletionTime}.`);

            // 2. Check if a future arrival occurs *before* predicted completion and has *higher* priority.
            for (let i = arrivalIndex; i < sortedArrivals.length; i++) {
                const futureProcess = sortedArrivals[i];
                 if (futureProcess.arrivalTime > currentTime && 
                     futureProcess.arrivalTime < predictedCompletionTime && 
                     futureProcess.priority < currentRunningProcess.priority) {
                       nextEventTime = futureProcess.arrivalTime;
                       break;
                  }
             }
            //  console.log(`runPriorityPreemptive: Next event time determined: ${nextEventTime}.`);
        }


        // If, after checks, nextEventTime is not greater than currentTime, handle as stuck/edge case.
         const durationOfCurrentSegment = nextEventTime - currentTime;

        // Safeguard against infinite loops at same time point
         if (durationOfCurrentSegment < 0) {
            console.error(`runPriorityPreemptive: Detected negative time duration (${durationOfCurrentSegment}). Critical error. Breaking simulation.`);
             break;
         }
         if (durationOfCurrentSegment === 0) continue; // Re-evaluate at same time


         // --- Add Execution Slice and Advance Time ---

         // Only add if duration is positive.
         if (durationOfCurrentSegment > 0) {
              const sliceStartTime = currentTime;
              currentTime = nextEventTime; // Advance time
              const sliceEndTime = currentTime;


            if (currentRunningProcess) { // If process ran this slice
                const processInCopy = processesCopy.find(p => p.id === currentRunningProcess.id);
                if(processInCopy) { // Safety check
                   processInCopy.burstRemaining -= durationOfCurrentSegment;

                    timeSlices.push({
                        processId: processInCopy.id,
                        startTime: sliceStartTime,
                        endTime: sliceEndTime,
                        duration: durationOfCurrentSegment,
                        isIdle: false,
                    });
                   // console.log(`runPriorityPreemptive: Added slice: ${processInCopy.id} from ${sliceStartTime} to ${sliceEndTime}. Rem ${processInCopy.burstRemaining}`);

                    if (!processInCopy.hasStarted) {
                        processInCopy.startTime = sliceStartTime;
                        processInCopy.hasStarted = true;
                       // console.log(`runPriorityPreemptive: Process ${processInCopy.id} first started at ${processInCopy.startTime}.`);
                    }

                   if (processInCopy.burstRemaining <= 0) {
                       processInCopy.completed = true;
                       processInCopy.completionTime = currentTime; // Completion time is now
                       // console.log(`runPriorityPreemptive: Process ${processInCopy.id} completed fully at ${currentTime}. Completed count: ${processesCopy.filter(p=>p.completed).length}/${processesCopy.length}.`);
                       // Important: Remove from ready queue immediately
                       readyQueue = readyQueue.filter(p => p.id !== currentRunningProcess?.id);
                       currentRunningProcess = null;
                   } // else { console.log(`runPriorityPreemptive: Process ${processInCopy.id} did not complete.`);}
                } else { console.error(`runPriorityPreemptive: Current running process ${currentRunningProcess?.id} not found in processesCopy for burst update.`); currentRunningProcess = null;}

                // Add this in both algorithms after processing a slice:
                if (processInCopy.burstRemaining <= 0) {
                    processInCopy.completed = true;
                    processInCopy.completionTime = currentTime;
                    // Remove from ready queue and clear current running process
                    readyQueue = readyQueue.filter(p => p.id !== currentRunningProcess?.id);
                    currentRunningProcess = null;
                    
                    // Ensure no preemption happens at completion time
                    if (processInCopy.completionTime === currentTime) {
                        continue;
                    }
                }

            } else { // CPU was idle
                 timeSlices.push({
                     processId: 'Idle',
                     startTime: sliceStartTime,
                     endTime: sliceEndTime,
                     duration: durationOfCurrentSegment,
                     isIdle: true,
                 });
                //  console.log(`runPriorityPreemptive: CPU idle slice from ${sliceStartTime} to ${sliceEndTime}.`);
            }
        }

        // After processing the slice and advancing time,
        // remove any completed processes from the readyQueue before the next selection round.
        readyQueue = readyQueue.filter(p => !p.completed && p.id !== currentRunningProcess?.id);

        // --- Safety Break: Prevent Infinite Loops ---
        if (durationOfCurrentSegment <= 0 && processesCopy.some(p => !p.completed) && readyQueue.length === 0 && !currentRunningProcess && arrivalIndex >= sortedArrivals.length) {
            console.error("runPriorityPreemptive: Simulation stuck in an infinite loop state. Breaking.");
            break;
        }

     } // End of while loop

    // console.log("runPriorityPreemptive: Simulation complete.");
    // console.log("runPriorityPreemptive: Generated time slices:", timeSlices);

     // Get the final list of completed processes for metrics.
     const finalCompletedProcesses = processesCopy.filter(p => p.completed);
    // console.log("runPriorityPreemptive: Final Completed Processes for Metrics:", finalCompletedProcesses);

     const metrics = calculateMetrics(processes, finalCompletedProcesses);

    //  console.log("runPriorityPreemptive: Calculated metrics:", metrics);

   return {
       timeSlices: timeSlices,
       metrics: metrics,
   };
};


// =================================================================
// Add Exports
// =================================================================

export { runFCFS, runSJF, runPriority, runRoundRobin, runSRTF, runPriorityPreemptive };

// export { calculateMetrics };