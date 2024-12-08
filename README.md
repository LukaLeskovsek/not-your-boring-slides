# Presentation Viewer

A modern, interactive presentation viewer built with React and TypeScript. Create beautiful presentations with various slide types, animations, and effects.

## Features

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

## Usage

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

\`\`\`javascript
function example() {
  return 'Hello, World!';
}
\`\`\`
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
      size: 'xl' // Available sizes: 'sm', 'md', 'lg', 'xl'
    },
    { 
      label: 'Customer satisfaction', 
      value: 92, 
      color: 'bg-green-500',
      size: 'lg'
    }
  ],
  columns: 2 // Control the grid layout (1-4 columns)
}
```

#### Pie Chart
```typescript
{
  type: 'pie-chart',
  header: 'Market Share Distribution',
  chartData: [
    { label: 'Product A', value: 50, color: '#3B82F6' },
    { label: 'Product B', value: 30, color: '#10B981' }
  ]
}
```

## Progress Bar Sizes

The progress bars can be customized with four different sizes:

- `sm`: Small (2px height)
- `md`: Medium (4px height, default)
- `lg`: Large (6px height)
- `xl`: Extra Large (8px height)

Each size also adjusts the font size of the labels appropriately:

```typescript
const sizeClasses = {
  sm: 'text-xs',   // Extra small text
  md: 'text-sm',   // Small text
  lg: 'text-base', // Base text size
  xl: 'text-lg'    // Large text
};
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

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