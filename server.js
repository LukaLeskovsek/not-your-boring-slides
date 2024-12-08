import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultPresentation = {
  "documentName": "My Presentation",
  "settings": {
    "fontSize": "16px",
    "fontFamily": "Inter, sans-serif",
    "gradientBackground": {
      "from": "#a5f3fc",
      "to": "#fbcfe8"
    },
    "footer": {
      "logoUrl": "/logo.svg",
      "dateFormat": "MMM yyyy"
    },
    "date": "2024-03-19"
  },
  "slides": [
    {
      "type": "header-only",
      "header": "Welcome to Your Presentation",
      "effect": {
        "type": "flying-emoji",
        "options": {
          "particleCount": 15,
          "emoji": "✨",
          "duration": 3,
          "fadeOut": 0.7
        }
      }
    },
    {
      "type": "markdown",
      "markdown": "# Project Overview\n\n## Key Features\n\n- **Real-time Collaboration** \n  - Multi-user editing\n  - Live preview\n  - Chat integration\n\n- **Advanced Security**\n  - End-to-end encryption\n  - Role-based access control\n  - Audit logging\n\n## Timeline\n\n1. **Phase 1**: Planning & Design\n2. **Phase 2**: Development\n3. **Phase 3**: Testing\n4. **Phase 4**: Deployment\n\n> \"Innovation is the outcome of a habit, not a random act.\"\n\n```javascript\n// Example code\nfunction calculateProgress(tasks) {\n  return tasks.filter(t => t.completed).length / tasks.length * 100;\n}\n```",
      "effect": {
        "type": "flying-emoji",
        "options": {
          "particleCount": 10,
          "emoji": "📝",
          "duration": 4,
          "fadeOut": 0.7
        }
      }
    }
  ]
};

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Ensure public directory exists
async function ensurePublicDir() {
  try {
    await fs.access(path.join(__dirname, 'public'));
  } catch {
    await fs.mkdir(path.join(__dirname, 'public'));
  }
}

// Ensure presentation.json exists
async function ensurePresentationFile() {
  const filePath = path.join(__dirname, 'public', 'presentation.json');
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultPresentation, null, 2), 'utf8');
  }
}

// Initialize server
async function init() {
  await ensurePublicDir();
  await ensurePresentationFile();
}

init().catch(console.error);

// Get presentation data
app.get('/api/presentation', async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, 'public', 'presentation.json'),
      'utf8'
    );
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error loading presentation:', error);
    res.status(500).json({ error: 'Failed to load presentation' });
  }
});

// Save presentation data
app.post('/api/presentation', async (req, res) => {
  try {
    const presentationData = req.body;
    await fs.writeFile(
      path.join(__dirname, 'public', 'presentation.json'),
      JSON.stringify(presentationData, null, 2),
      'utf8'
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving presentation:', error);
    res.status(500).json({ error: 'Failed to save presentation' });
  }
});

// Serve the Vite app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 