// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const boardApi = {
  getBoard: async () => {
    const response = await api.get('/board');
    return response.data;
  },

  addSticker: async (sticker) => {
    const response = await api.post('/stickers', sticker);
    return response.data;
  },

  updateSticker: async (id, updates) => {
    const response = await api.put(`/stickers/${id}`, updates);
    return response.data;
  },

  deleteSticker: async (id) => {
    const response = await api.delete(`/stickers/${id}`);
    return response.data;
  },

  addCard: async (card) => {
    const response = await api.post('/cards', card);
    return response.data;
  },

  updateCard: async (id, updates) => {
    const response = await api.put(`/cards/${id}`, updates);
    return response.data;
  },

  deleteCard: async (id) => {
    const response = await api.delete(`/cards/${id}`);
    return response.data;
  },

  addNote: async (note) => {
    const response = await api.post('/notes', note);
    return response.data;
  },

  updateNote: async (id, updates) => {
    const response = await api.put(`/notes/${id}`, updates);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  }
};