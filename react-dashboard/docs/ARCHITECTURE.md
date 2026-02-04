# Architecture Documentation

## Overview
This application is a React-based trading dashboard utilizing Tailwind CSS for styling and Recharts for data visualization. It is built using Vite for fast development and optimized production builds.

## Directory Structure

\`\`\`
src/
├── components/         # Reusable UI components
│   ├── BacktestForm/   # Subcomponents for the backtest content
│   └── ...             # Other shared components
├── constants/          # Static configuration and data
├── pages/              # Route-based page components
├── hooks/              # Custom React hooks (future use)
├── utils/              # Helper functions (future use)
├── assets/             # Images and static assets
├── App.jsx             # Main application component with routing
└── main.jsx            # Entry point
\`\`\`

## Key Components
- **Layout**: Wraps the application with the Sidebar and Header.
- **Dashboard**: The main landing page displaying stats and charts.
- **Sidebar**: Handles navigation, powered by `constants/navigation.js`.
- **CreateBacktestModal**: A complex form modal decomposed into `BacktestForm` subcomponents.

## Data Flow
- **State Management**: Currently uses local component state (`useState`).
- **Props**: Data is passed down from parent to child components.
- **Routing**: `react-router-dom` handles client-side routing.

## Technology Stack
- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, generic CSS variables
- **Icons**: Lucide React
- **Charts**: Recharts
