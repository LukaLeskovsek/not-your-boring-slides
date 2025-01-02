# Slides Maker

A modern, interactive presentation creator and viewer built with React, TypeScript, and Express. Create beautiful presentations with various slide types, animations, and effects.

## 🌟 Features

- 🎨 Multiple slide types:
  - Header only
  - Title with content (Markdown support)
  - Image only
  - GIF only
  - Image with header
  - GIF with header
  - Pie charts
  - Progress bars grid (with customizable sizes)
  - Full Markdown slides

- ✨ Interactive effects:
  - Flying emojis
  - Confetti celebrations
  - Smooth transitions

- 🎮 Navigation:
  - Keyboard controls (←, →, Space)
  - On-screen buttons
  - Fullscreen mode

- 📱 Responsive design:
  - 16:9 aspect ratio
  - Adaptive scaling
  - Mobile-friendly

## 🏗️ Architecture

The project follows a modern full-stack architecture:

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── pages/         # Route pages
├── server/        # Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── repositories/
├── services/      # API services
├── lib/          # Shared utilities
└── data/         # Data models
```

## 🛠️ Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - TailwindCSS
  - Radix UI Components
  - React Router
  - Zustand (State Management)
  - React Hook Form
  - React Beautiful DnD
  - Recharts

- **Backend**:
  - Express
  - TypeScript
  - Pino Logger
  - Rate Limiting
  - CORS

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/slides-maker.git
cd slides-maker
```

2. Install dependencies:
```bash
npm install
```

3. Start development servers (frontend + backend):
```bash
npm run dev
```

4. Build for production:
```bash
npm run build        # Build frontend
npm run build:server # Build backend
```

## 💻 Usage

### Basic Setup

```typescript
import { PresentationProvider } from '@/components/presentation/PresentationProvider';
import { PresentationViewer } from '@/components/presentation/PresentationViewer';
import type { PresentationData } from '@/types/presentation';

const data: PresentationData = {
  documentName: 'My Presentation',
  settings: {
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif',
    gradientBackground: {
      from: '#a5f3fc',
      to: '#fbcfe8',
    },
    footer: {
      logoUrl: '/logo.png',
      dateFormat: 'MMM yyyy',
    },
    date: '2024-03-19',
  },
  slides: [
    // Your slides here
  ],
};

function App() {
  return (
    <PresentationProvider data={data}>
      <PresentationViewer />
    </PresentationProvider>
  );
}
```

### Slide Examples

#### Header Only
```typescript
{
  type: 'header-only',
  header: '2024 Review',
  effect: {
    type: 'flying-emoji',
    options: {
      particleCount: 15,
      emoji: '🚀',
      duration: 5,
      fadeOut: 0.9
    }
  }
}
```

#### Markdown Slide
```typescript
{
  type: 'markdown',
  markdown: `# Project Overview

## Key Features

- **Real-time Collaboration**
- **Advanced Security**

> "Innovation is the outcome of a habit, not a random act."
`,
  effect: {
    type: 'flying-emoji',
    options: {
      particleCount: 10,
      emoji: '📝',
      duration: 4
    }
  }
}
```

#### Progress Grid
```typescript
{
  type: 'progress-grid',
  header: 'Q1 Performance Metrics',
  progressData: [
    { 
      label: 'Professional execution', 
      value: 75, 
      color: 'bg-amber-400',
      size: 'xl'
    },
    { 
      label: 'Customer satisfaction', 
      value: 92, 
      color: 'bg-green-500',
      size: 'lg'
    }
  ],
  columns: 2
}
```

#### Pie Chart
```typescript
{
  type: 'pie-chart',
  header: 'Revenue Distribution',
  chartData: [
    {
      label: 'Item 1',
      value: 30,
      color: 'hsl(var(--chart-1))'  // Using theme colors
    },
    {
      label: 'Item 2',
      value: 25,
      color: 'hsl(var(--chart-2))'
    },
    {
      label: 'Item 3',
      value: 20,
      color: 'hsl(var(--chart-3))'
    }
  ],
  fontSize: 'md',  // Optional: 'sm' | 'md' | 'lg' | 'xl'
  effect: {        // Optional animation effect
    type: 'flying-emoji',
    options: {
      particleCount: 10,
      emoji: '📊',
      duration: 3,
      fadeOut: 0.7
    }
  }
}
```

The pie chart component automatically:
- Calculates percentages from the provided values
- Draws proportional segments
- Positions labels with percentages around the chart
- Uses the Inter font family
- Supports different font sizes:
  - `sm`: 12px
  - `md`: 14px (default)
  - `lg`: 16px
  - `xl`: 18px

You can use either HSL theme colors (`hsl(var(--chart-1))`) or hex colors (`#3B82F6`).

## 🎨 Customization

### Progress Bar Sizes

Available sizes for progress bars:
- `sm`: Small (2px height)
- `md`: Medium (4px height, default)
- `lg`: Large (6px height)
- `xl`: Extra Large (8px height)

Font sizes are automatically adjusted based on the progress bar size:
```typescript
const sizeClasses = {
  sm: 'text-xs',   // Extra small text
  md: 'text-sm',   // Small text
  lg: 'text-base', // Base text size
  xl: 'text-lg'    // Large text
};
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

## 📝 License

This project is licensed under the MIT License - see below for details:

MIT License

Copyright (c) 2024

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