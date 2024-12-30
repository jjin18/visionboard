import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Plus, X, Type } from 'lucide-react';

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
    accept: { 'image/*': [] },
    noClick: true
  });

  return (
    <div {...getRootProps()} className="min-h-screen bg-[#0d0d0d] p-8" style={{
      backgroundImage: 'radial-gradient(circle at top left, #1a1a1a, #0d0d0d 60%)',
    }}>
      <input {...getInputProps()} />
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
            style={{
              textShadow: '0 0 20px cyan, 0 0 30px purple',
            }}
          >
            DREAMS 2025 ✨
          </h1>
          <div className="flex gap-4">
            <button
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Type className="w-5 h-5 mr-2" />
              Add Note
            </button>
            <button
              onClick={() => {
                setModal(true);
                setEditingCard(null);
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{
                boxShadow: '0 0 20px rgba(255, 20, 147, 0.8), 0 0 30px rgba(128, 0, 128, 0.8)',
                textShadow: '0 0 15px rgba(255, 20, 147, 0.8)'
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Vision
            </button>
          </div>
        </div>

        <div className="relative h-[90vh] bg-[#1a1a1a] rounded-2xl shadow-2xl p-12 overflow-hidden border-4" style={{
          borderColor: '#333',
          boxShadow: '0 0 20px rgba(128, 0, 128, 0.8), 0 0 40px rgba(0, 191, 255, 0.8)'
        }}>
          {stickers.map(sticker => (
            <motion.div
              key={sticker.id}
              className="absolute cursor-move group"
              initial={sticker.position}
              drag
              dragMomentum={false}
              onDragEnd={(e, info) => {
                const newStickers = stickers.map(s =>
                  s.id === sticker.id
                    ? { ...s, position: {
                      x: s.position.x + info.offset.x,
                      y: s.position.y + info.offset.y
                    } }
                    : s
                );
                setStickers(newStickers);
              }}
            >
              <div
                className="relative"
                style={{ rotate: sticker.rotation, opacity: 0.9 }}
              >
                <img
                  src={sticker.image}
                  alt="sticker"
                  className="w-32 h-32 object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(0, 191, 255, 0.8))'
                  }}
                />
                <button
                  onClick={() => setStickers(stickers.filter(s => s.id !== sticker.id))}
                  className="absolute -top-2 -right-2 bg-black/70 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}

          {notes.map(note => (
            <motion.div
              key={note.id}
              className="absolute cursor-move group"
              initial={note.position}
              drag
              dragMomentum={false}
              style={{ rotate: note.rotation, opacity: 0.9 }}
              onDragEnd={(e, info) => {
                const newNotes = notes.map(n =>
                  n.id === note.id
                    ? { ...n, position: {
                      x: n.position.x + info.offset.x,
                      y: n.position.y + info.offset.y
                    } }
                    : n
                );
                setNotes(newNotes);
              }}
            >
              <div className="bg-[#333333] text-white p-6 rounded-xl shadow-xl relative" style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 30px, #444444 31px)',
                lineHeight: '31px',
                fontFamily: 'Monospace',
                opacity: 0.8,
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(192, 192, 192, 0.8)',
                boxShadow: '0 0 10px rgba(192, 192, 192, 0.8)'
              }}>
                <textarea
                  className="w-full bg-transparent resize-none outline-none text-white"
                  value={note.text}
                  onChange={(e) => {
                    setNotes(notes.map(n =>
                      n.id === note.id ? { ...n, text: e.target.value } : n
                    ));
                  }}
                  style={{
                    height: '150px',
                    padding: '4px'
                  }}
                />
                <button
                  onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                  className="absolute -top-2 -right-2 bg-black/70 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity p-1"
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
              onDragEnd={(e, info) => {
                const newCards = cards.map(c =>
                  c.id === card.id
                    ? { ...c, position: {
                      x: c.position.x + info.offset.x,
                      y: c.position.y + info.offset.y
                    }, rotation: c.rotation }
                    : c
                );
                setCards(newCards);
              }}
              onDoubleClick={() => {
                setEditingCard(card);
                setModal(true);
              }}
            >
              <div className="bg-[#222222] text-white p-4 rounded-xl shadow-2xl w-72 transform transition-all border-2" style={{
                borderColor: 'rgba(192, 192, 192, 0.8)',
                opacity: 0.9,
                backdropFilter: 'blur(4px)',
                boxShadow: '0 0 15px rgba(192, 192, 192, 0.8)',
                transform: `rotate(${card.rotation || 0}deg)`
              }}>
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-48 object-cover rounded-lg shadow-inner mb-3"
                />
                <div className="text-center p-2">
                  <h3 className="text-xl font-bold mb-1 text-cyan-400">{card.title}</h3>
                  <p className="text-sm text-gray-300">{card.description}</p>
                  <span className="text-xs text-purple-400 mt-2 block font-semibold">{card.deadline}</span>
                </div>
                <button
                  onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                  className="absolute -top-2 -right-2 bg-black/70 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}

          {modal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div
                className="bg-[#222222] text-white rounded-2xl p-8 w-[480px] max-w-full shadow-2xl border border-gray-700"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
                  {editingCard ? 'Edit Vision ✨' : 'Add Vision ✨'}
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Vision Title"
                    className="w-full p-3 bg-[#333333] text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none"
                    value={editingCard ? editingCard.title : newCard.title}
                    onChange={(e) => {
                      if (editingCard) {
                        setEditingCard({ ...editingCard, title: e.target.value });
                      } else {
                        setNewCard({ ...newCard, title: e.target.value });
                      }
                    }}
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full p-3 bg-[#333333] text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none h-24"
                    value={editingCard ? editingCard.description : newCard.description}
                    onChange={(e) => {
                      if (editingCard) {
                        setEditingCard({ ...editingCard, description: e.target.value });
                      } else {
                        setNewCard({ ...newCard, description: e.target.value });
                      }
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Target Date"
                    className="w-full p-3 bg-[#333333] text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none"
                    value={editingCard ? editingCard.deadline : newCard.deadline}
                    onChange={(e) => {
                      if (editingCard) {
                        setEditingCard({ ...editingCard, deadline: e.target.value });
                      } else {
                        setNewCard({ ...newCard, deadline: e.target.value });
                      }
                    }}
                  />
                  <div className="border-2 border-solid border-cyan-500 rounded-xl p-8 hover:border-cyan-400 transition-colors">
                    <label className="flex flex-col items-center cursor-pointer">
                      <Plus className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-gray-400">Drop your vision here</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (editingCard) {
                                setEditingCard({ ...editingCard, image: reader.result });
                              } else {
                                setNewCard({ ...newCard, image: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setModal(false);
                        setEditingCard(null);
                      }}
                      className="px-6 py-2 text-gray-400 hover:text-gray-200 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (editingCard) {
                          setCards(cards.map(c => c.id === editingCard.id ? editingCard : c));
                          setEditingCard(null);
                        } else if (newCard.title) {
                          setCards([
                            ...cards,
                            {
                              ...newCard,
                              id: Date.now().toString(),
                              position: {
                                x: Math.random() * (window.innerWidth - 300),
                                y: Math.random() * (window.innerHeight - 400)
                              },
                              rotation: `${Math.random() * 10 - 5}deg`
                            }
                          ]);
                          setNewCard({ title: '', description: '', deadline: '', image: null });
                        }
                        setModal(false);
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-xl shadow-lg"
                      style={{
                        boxShadow: '0 0 20px rgba(0, 191, 255, 0.8), 0 0 30px rgba(128, 0, 128, 0.8)',
                      }}
                    >
                      {editingCard ? 'Save Changes' : 'Add Vision'}
                    </button>
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
