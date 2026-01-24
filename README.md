# CPU Scheduling Visualizer

An interactive web-based visualization tool for understanding and comparing CPU scheduling algorithms. This project provides real-time Gantt charts and performance metrics for various scheduling algorithms commonly taught in Operating Systems courses.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.3.1-purple.svg)

## Live Demo

🚀 **[View Live Demo](https://cpu-scheduling-visualizer-ch-praneeth-08.vercel.app)** *(Coming Soon)*

## Screenshots

*Screenshots will be added here showcasing the application interface, Gantt charts, and metrics tables.*

## Features

### Supported Scheduling Algorithms

- **FCFS (First-Come, First-Served)** - Non-preemptive scheduling based on arrival time
- **SJF (Shortest Job First)** - Non-preemptive scheduling based on burst time
- **SRTF (Shortest Remaining Time First)** - Preemptive version of SJF
- **Priority Scheduling (Non-Preemptive)** - Scheduling based on process priority
- **Priority Scheduling (Preemptive)** - Preemptive priority-based scheduling
- **Round Robin** - Time-quantum based preemptive scheduling

### Key Features

✅ **Interactive Process Input** - Add processes with custom arrival time, burst time, and priority  
✅ **Real-time Visualization** - Dynamic Gantt charts showing process execution timeline  
✅ **Performance Metrics** - Detailed calculations including:
  - Completion Time (CT)
  - Turnaround Time (TT)
  - Waiting Time (WT)
  - Average Turnaround Time
  - Average Waiting Time

✅ **Algorithm Explanations** - Built-in descriptions and characteristics for each algorithm  
✅ **Responsive Design** - Works seamlessly on desktop and mobile devices  
✅ **Clean UI** - Modern, intuitive interface for easy learning

## Technologies Used

- **[React](https://react.dev/)** (v19.0.0) - Frontend library for building user interfaces
- **[Vite](https://vite.dev/)** (v6.3.1) - Fast build tool and development server
- **JavaScript (ES6+)** - Core programming language
- **CSS3** - Styling and responsive design
- **ESLint** - Code quality and consistency

## Project Structure

```
cpu-scheduling-visualizer/
├── public/
│   └── vite.svg                    # Application icon
├── src/
│   ├── components/
│   │   ├── AlgorithmSelector.jsx   # Algorithm selection dropdown
│   │   ├── Button.jsx              # Reusable button component
│   │   ├── GanttChart.jsx          # Gantt chart visualization
│   │   ├── MetricsTable.jsx        # Performance metrics display
│   │   ├── ProcessInput.jsx        # Process input form
│   │   └── ResultExplanation.jsx   # Algorithm explanations
│   ├── styles/
│   │   ├── App.css                 # Main application styles
│   │   ├── Button.css              # Button component styles
│   │   ├── GanttChart.css          # Gantt chart styles
│   │   ├── MetricsTable.css        # Metrics table styles
│   │   ├── ProcessInput.css        # Process input styles
│   │   └── ResultExplanation.css   # Explanation section styles
│   ├── utils/
│   │   └── schedulingAlgorithms.js # Core algorithm implementations
│   ├── App.jsx                     # Root application component
│   └── main.jsx                    # Application entry point
├── index.html                      # HTML template
├── package.json                    # Project dependencies
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint configuration
└── README.md                       # Project documentation
```

## Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v7.0.0 or higher) or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ch-praneeth-08/cpu-scheduling-visualizer.git
   cd cpu-scheduling-visualizer
   ```

2. **Navigate to the project directory**

   ```bash
   cd cpu-scheduling-visualizer
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

   Or with yarn:

   ```bash
   yarn install
   ```

### Local Development

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Lint Code

Check code quality and fix issues:

```bash
npm run lint
```

## Usage Guide

### Adding Processes

1. **Enter Process Details**:
   - **Arrival Time**: When the process arrives in the ready queue
   - **Burst Time**: Total CPU time required by the process
   - **Priority**: Priority level (1 = highest, higher numbers = lower priority)

2. **Click "Add Process"** to add the process to the list

3. **Repeat** to add multiple processes

### Running Simulations

1. **Select an Algorithm** from the dropdown menu
   - For Round Robin, specify the time quantum

2. **Click "Visualize"** to run the simulation

3. **View Results**:
   - **Gantt Chart**: Visual timeline of process execution
   - **Metrics Table**: Detailed performance metrics for each process
   - **Algorithm Explanation**: Description and characteristics of the selected algorithm

### Understanding the Results

- **Gantt Chart**: Color-coded timeline showing which process runs at each time unit
- **Completion Time (CT)**: Time when process finishes execution
- **Turnaround Time (TT)**: CT - Arrival Time (total time in system)
- **Waiting Time (WT)**: TT - Burst Time (time spent waiting)
- **Averages**: Mean turnaround and waiting times across all processes

## Algorithm Explanations

### FCFS (First-Come, First-Served)
- **Type**: Non-preemptive
- **Selection**: Processes execute in order of arrival
- **Pros**: Simple, fair by arrival order
- **Cons**: Convoy effect (long processes delay short ones)

### SJF (Shortest Job First)
- **Type**: Non-preemptive
- **Selection**: Process with shortest burst time executes first
- **Pros**: Minimizes average waiting time
- **Cons**: Starvation possible for long processes

### SRTF (Shortest Remaining Time First)
- **Type**: Preemptive
- **Selection**: Process with shortest remaining time executes
- **Pros**: Better average waiting time than non-preemptive SJF
- **Cons**: Higher context switching overhead, potential starvation

### Priority Scheduling (Non-Preemptive)
- **Type**: Non-preemptive
- **Selection**: Process with highest priority (lowest number) executes
- **Pros**: Important tasks get priority
- **Cons**: Starvation for low-priority processes

### Priority Scheduling (Preemptive)
- **Type**: Preemptive
- **Selection**: Highest priority process can preempt currently running process
- **Pros**: Responsive to high-priority tasks
- **Cons**: Most susceptible to starvation

### Round Robin
- **Type**: Preemptive
- **Selection**: Each process gets a time quantum in FCFS order
- **Pros**: Fair CPU time distribution, good response time
- **Cons**: Performance depends on quantum size; can have higher turnaround time

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional):

   ```bash
   npm install -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

   Or connect your GitHub repository to Vercel for automatic deployments.

### Deploy to Netlify

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to Netlify via:
   - Netlify CLI
   - Drag-and-drop in Netlify dashboard
   - GitHub integration

### Deploy to GitHub Pages

1. **Install gh-pages**:

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deployment scripts** to `package.json`:

   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update `vite.config.js`** with base path:

   ```javascript
   export default defineConfig({
     base: '/cpu-scheduling-visualizer/',
     // ... other config
   })
   ```

4. **Deploy**:

   ```bash
   npm run deploy
   ```

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**

   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Praneeth Reddy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Acknowledgments

- Built as an educational tool for Operating Systems courses
- Inspired by the need for interactive learning in computer science education
- Special thanks to the React and Vite communities

## Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs via [GitHub Issues](https://github.com/ch-praneeth-08/cpu-scheduling-visualizer/issues)
- 💡 Suggesting new features or improvements
- 📖 Sharing with others who might find it useful

---

**Made with ❤️ for learning Operating Systems**
