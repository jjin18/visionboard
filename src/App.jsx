import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Plus, Image, X, Type, Sparkles } from 'lucide-react';

const DreamBoard = () => {
  const [stickers, setStickers] = useState([]);
  const [cards, setCards] = useState([]);
  const [notes, setNotes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    deadline: '',
    image: null
  });

  // Load data from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dreamBoard2025');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.stickers) setStickers(data.stickers);
        if (data.cards) setCards(data.cards);
        if (data.notes) setNotes(data.notes);
      }
    } catch (e) {
      console.error('Load failed:', e);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem('dreamBoard2025', JSON.stringify({
          stickers: stickers.map(s => ({
            ...s,
            image: s.image?.slice(0, 1000000) // Truncate large images
          })),
          cards,
          notes
        }));
      } catch (err) {
        console.error('Save failed:', err);
      }
    };
    saveData();
  }, [stickers, cards, notes]);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSticker = {
          id: Date.now().toString(),
          image: reader.result,
          position: { 
            x: Math.random() * (window.innerWidth - 200), 
            y: Math.random() * (window.innerHeight - 200) 
          },
          rotation: `${Math.random() * 20 - 10}deg`
        };
        setStickers(prev => [...prev, newSticker]);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: {'image/*': []},
    noClick: true
  });

  return (
    <div {...getRootProps()} className="min-h-screen bg-[#f4ece2] p-8" style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.1) 2px, transparent 2px)',
      backgroundSize: '20px 20px'
    }}>
      <input {...getInputProps()} />
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-5xl font-handwritten bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            
          >
            Vision Board 2025 ✨
          </motion.h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setNotes([...notes, {
                  id: Date.now().toString(),
                  text: 'Write your dreams here...',
                  position: { 
                    x: Math.random() * (window.innerWidth - 300),
                    y: Math.random() * (window.innerHeight - 400)
                  },
                  rotation: `${Math.random() * 10 - 5}deg`
                }]);
              }}
              className="bg-gradient-to-r from-yellow-100 to-amber-200 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Type className="w-5 h-5 mr-2" />
              Add Note
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Vision
            </motion.button>
          </div>
        </div>

        <div className="relative h-[90vh] bg-gradient-to-br from-white/30 to-white/10 rounded-2xl shadow-2xl p-12 overflow-hidden border-4 border-pink-300 backdrop-blur">
          {stickers.map(sticker => (
            <motion.div 
              key={sticker.id} 
              className="absolute cursor-move group"
              initial={sticker.position}
              drag
              dragMomentum={false}
              whileHover={{ scale: 1.05 }}
              onDragEnd={(e, info) => {
                const newStickers = stickers.map(s => 
                  s.id === sticker.id 
                    ? {...s, position: { 
                        x: s.position.x + info.offset.x, 
                        y: s.position.y + info.offset.y 
                      }} 
                    : s
                );
                setStickers(newStickers);
              }}
            >
              <motion.div
                className="relative"
                style={{ rotate: sticker.rotation }}
              >
                <img
                  src={sticker.image}
                  alt="sticker"
                  className="w-32 h-32 object-contain"
                />
                <button 
                  onClick={() => setStickers(stickers.filter(s => s.id !== sticker.id))}
                  className="absolute -top-2 -right-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </motion.div>
            </motion.div>
          ))}

          {notes.map(note => (
            <motion.div
              key={note.id}
              className="absolute cursor-move group"
              initial={note.position}
              drag
              dragMomentum={false}
              whileHover={{ scale: 1.02 }}
              style={{ rotate: note.rotation }}
              onDragEnd={(e, info) => {
                const newNotes = notes.map(n => 
                  n.id === note.id 
                    ? {...n, position: { 
                        x: n.position.x + info.offset.x, 
                        y: n.position.y + info.offset.y 
                      }} 
                    : n
                );
                setNotes(newNotes);
              }}
            >
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50/90 p-6 rounded-xl shadow-xl relative" style={{
                backgroundImage: 'repeating-linear-gradient(white, white 30px, #f9d9c1 31px)',
                lineHeight: '31px'
              }}>
                <textarea
                  className="w-full bg-transparent resize-none outline-none font-handwritten text-gray-700"
                  style={{
                    height: '150px',
                    padding: '4px'
                  }}
                  value={note.text}
                  onChange={(e) => {
                    setNotes(notes.map(n => 
                      n.id === note.id ? {...n, text: e.target.value} : n
                    ));
                  }}
                />
                <button 
                  onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                  className="absolute -top-2 -right-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}

          {cards.map(card => (
            <motion.div
              key={card.id}
              className="absolute cursor-move group"
              initial={card.position}
              drag
              dragMomentum={false}
              whileHover={{ scale: 1.05 }}
              onDragEnd={(e, info) => {
                const newCards = cards.map(c => 
                  c.id === card.id 
                    ? {...c, position: { 
                        x: c.position.x + info.offset.x, 
                        y: c.position.y + info.offset.y 
                      }} 
                    : c
                );
                setCards(newCards);
              }}
              onDoubleClick={() => setEditingCard(card)}
            >
              <div className="bg-white p-4 rounded-xl shadow-2xl w-72 transform transition-all border-2 border-pink-400">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-48 object-cover rounded-lg shadow-inner mb-3"
                />
                <div className="text-center p-2">
                  <h3 className="text-xl font-bold mb-1 text-pink-900">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                  <span className="text-xs text-pink-600 mt-2 block font-semibold">{card.deadline}</span>
                </div>
                <button 
                  onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                  className="absolute -top-2 -right-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}

          {editingCard && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div 
                className="bg-white rounded-2xl p-8 w-[480px] max-w-full shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center text-pink-900">Edit Vision ✨</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Vision Title"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    value={editingCard.title}
                    onChange={e => setEditingCard({...editingCard, title: e.target.value})}
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none h-24"
                    value={editingCard.description}
                    onChange={e => setEditingCard({...editingCard, description: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Target Date"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    value={editingCard.deadline}
                    onChange={e => setEditingCard({...editingCard, deadline: e.target.value})}
                  />
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setEditingCard(null)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 rounded-xl"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCards(cards.map(c => c.id === editingCard.id ? editingCard : c));
                        setEditingCard(null);
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl shadow-lg"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {modal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div 
                className="bg-white rounded-2xl p-8 w-[480px] max-w-full shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center text-pink-900">New Vision ✨</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Vision Title"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    value={newCard.title}
                    onChange={e => setNewCard({...newCard, title: e.target.value})}
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none h-24"
                    value={newCard.description}
                    onChange={e => setNewCard({...newCard, description: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Target Date"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    value={newCard.deadline}
                    onChange={e => setNewCard({...newCard, deadline: e.target.value})}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-pink-400 transition-colors">
                    <label className="flex flex-col items-center cursor-pointer">
                      <Image className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Drop your vision here</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewCard({...newCard, image: reader.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setModal(false)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 rounded-xl"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (newCard.title) {
                          setCards([...cards, {
                            ...newCard,
                            id: Date.now().toString(),
                            position: { 
                              x: Math.random() * (window.innerWidth - 300),
                              y: Math.random() * (window.innerHeight - 400)
                            },
                            rotation: `${Math.random() * 10 - 5}deg`
                          }]);
                          setNewCard({ title: '', description: '', deadline: '', image: null });
                          setModal(false);
                        }
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl shadow-lg"
                    >
                      Add Vision
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DreamBoard;