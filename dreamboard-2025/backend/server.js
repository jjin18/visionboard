const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Data storage path
const DATA_FILE = path.join(__dirname, 'data', 'board.json');

// Ensure data directory exists
const initializeDataDirectory = async () => {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir);
    // Create initial empty board data
    const defaultData = { stickers: [], cards: [], notes: [] };
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
};

// Helper functions for reading/writing data
const readBoardData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    const defaultData = { stickers: [], cards: [], notes: [] };
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
};

const writeBoardData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// Initialize data directory when server starts
initializeDataDirectory().then(() => {
  console.log('Data directory initialized');
});

// Routes
// Get all board data
app.get('/api/board', async (req, res) => {
  try {
    const data = await readBoardData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new items
app.post('/api/stickers', async (req, res) => {
  try {
    const data = await readBoardData();
    const sticker = req.body;
    data.stickers.push(sticker);
    await writeBoardData(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cards', async (req, res) => {
  try {
    const data = await readBoardData();
    const card = req.body;
    data.cards.push(card);
    await writeBoardData(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const data = await readBoardData();
    const note = req.body;
    data.notes.push(note);
    await writeBoardData(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update existing items
app.put('/api/stickers/:id', async (req, res) => {
  try {
    const data = await readBoardData();
    const { id } = req.params;
    const updates = req.body;
    
    data.stickers = data.stickers.map(sticker => 
      sticker.id === id ? { ...sticker, ...updates } : sticker
    );
    
    await writeBoardData(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/cards/:id', async (req, res) => {
  try {
    const data = await readBoardData();
    const { id } = req.params;
    const updates = req.body;
    
    data.cards = data.cards.map(card => 
      card.id === id ? { ...card, ...updates } : card
    );
    
    await writeBoardData(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const data = await readBoardData();
    const { id } = req.params;
    const updates = req.body;
    
    data.notes = data.notes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    );
    
    await writeBoardData(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete items
app.delete('/api/stickers/:id', async (req, res) => {
  try {
    const data = await readBoardData();
    const { id } = req.params;
    data.stickers = data.stickers.filter(sticker => sticker.id !== id);
    await writeBoardData(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cards/:id', async (req, res) => {
  try {
    const data = await readBoardData();
    const { id } = req.params;
    data.cards = data.cards.filter(card => card.id !== id);
    await writeBoardData(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const data = await readBoardData();
    const { id } = req.params;
    data.notes = data.notes.filter(note => note.id !== id);
    await writeBoardData(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});