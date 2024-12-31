import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Plus, X, Type } from 'lucide-react';

const randomTilt = () => `${Math.random() * 6 - 3}deg`;

const noteLineBackground = `
  repeating-linear-gradient(
    transparent,
    transparent 27px,
    rgba(255, 255, 255, 0.1) 28px
  )
`;

const animations = `
  @keyframes flicker {
    0%, 89.999%, 90.999%, 91.999%, 92.999%, 93.999%, 95%, 100% {
      opacity: 0.99;
      filter: brightness(1);
    }
    90%, 91%, 92%, 93%, 94% {
      opacity: 0.6;
      filter: brightness(0.8);
    }
  }

  @keyframes pulseGlow {
    0%, 100% {
      filter: brightness(1);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);
    }
    50% {
      filter: brightness(1.1);
      box-shadow: 0 0 25px rgba(0, 255, 255, 0.25);
    }
  }

  @keyframes floatAnimation {
    0%, 100% {
      transform: translateY(0px) rotate(var(--rotation));
    }
    50% {
      transform: translateY(-5px) rotate(var(--rotation));
    }
  }
`;

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

  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem('dreamBoard2025', JSON.stringify({
          stickers: stickers.map(s => ({
            ...s,
            image: s.image?.slice(0, 1000000)
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
          rotation: randomTilt()
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
    <div {...getRootProps()} className="min-h-screen bg-[#0D1117] p-8">
      <style>{animations}</style>
      <input {...getInputProps()} />
      
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-6xl font-black tracking-tight">
            <span className="relative text-white" style={{
              animation: 'flicker 8s linear infinite',
              textShadow: `
                0 0 2px #fff,
                0 0 4px #fff,
                0 0 8px cyan,
                0 0 12px cyan
              `
            }}>VISIONBOARD 2025</span>
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
                  rotation: randomTilt()
                }]);
              }}
              className="group relative px-6 py-3 rounded-xl overflow-hidden bg-[#1A2233] hover:bg-[#1E2943] transition-all duration-300"
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
                animation: 'pulseGlow 4s ease-in-out infinite'
              }}
            >
              <span className="absolute inset-0 opacity-50 bg-gradient-to-r from-cyan-500/20 to-blue-500/20" />
              <span className="relative text-white flex items-center font-medium">
                <Type className="w-5 h-5 mr-2" />
                Add Note
              </span>
            </button>
            
            <button
              onClick={() => {
                setModal(true);
                setEditingCard(null);
              }}
              className="group relative px-6 py-3 rounded-xl overflow-hidden bg-[#1A2233] hover:bg-[#1E2943] transition-all duration-300"
              style={{
                boxShadow: '0 0 10px rgba(255, 0, 255, 0.2)',
                animation: 'pulseGlow 4s ease-in-out infinite'
              }}
            >
              <span className="absolute inset-0 opacity-50 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
              <span className="relative text-white flex items-center font-medium">
                <Plus className="w-5 h-5 mr-2" />
                Add Vision
              </span>
            </button>
          </div>
        </div>

        <div className="relative h-[90vh] rounded-2xl p-12 overflow-hidden bg-[#0A0F18]" style={{
          boxShadow: `
            0 0 7px #fff,
            0 0 10px #fff,
            0 0 21px cyan,
            inset 0 0 30px rgba(0, 255, 255, 0.15)
          `,
          border: '1px solid rgba(0, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)'
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
              <motion.div
                className="relative"
                initial={{ rotate: randomTilt() }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.4))',
                  animation: 'floatAnimation 3s ease-in-out infinite',
                  '--rotation': randomTilt()
                }}
              >
                <img
                  src={sticker.image}
                  alt="sticker"
                  className="w-32 h-32 object-contain"
                />
                <button
                  onClick={() => setStickers(stickers.filter(s => s.id !== sticker.id))}
                  className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </motion.div>
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
                    } }
                    : c
                );
                setCards(newCards);
              }}
              onDoubleClick={() => {
                setEditingCard(card);
                setModal(true);
              }}
            >
              <motion.div
                className="bg-[#1A2233]/90 text-white p-4 rounded-xl w-72 backdrop-blur-lg"
                initial={{ rotate: randomTilt() }}
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.15)',
                  border: '1px solid rgba(0, 255, 255, 0.2)',
                  animation: 'pulseGlow 4s ease-in-out infinite'
                }}
              >
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                    style={{
                      boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)'
                    }}
                  />
                )}
                <div className="text-center p-2">
                  <h3 className="text-xl font-bold mb-1" style={{
                    color: '#fff',
                    textShadow: '0 0 5px cyan, 0 0 8px cyan'
                  }}>{card.title}</h3>
                  <p className="text-sm text-gray-300">{card.description}</p>
                  <span className="text-xs mt-2 block font-medium" style={{
                    color: '#fff',
                    textShadow: '0 0 5px magenta'
                  }}>{card.deadline}</span>
                </div>
                <button
                  onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                  className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <motion.div
                className="bg-[#1A2233]/90 p-6 rounded-xl backdrop-blur-md"
                initial={{ rotate: randomTilt() }}
                style={{
                  boxShadow: '0 0 20px rgba(255, 0, 255, 0.15)',
                  border: '1px solid rgba(255, 0, 255, 0.2)',
                  animation: 'pulseGlow 4s ease-in-out infinite'
                }}
              >
                <div 
                  className="relative" 
                  style={{ 
                    backgroundImage: noteLineBackground,
                    backgroundSize: '100% 28px',
                    backgroundRepeat: 'repeat-y',
                    backgroundPosition: '0 4px'
                  }}
                >
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
                      lineHeight: '28px',
                      textShadow: '0 0 3px rgba(255, 0, 255, 0.3)'
                    }}
                  />
                </div>
                <button
                  onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                  className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </motion.div>
            </motion.div>
          ))}

          {modal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
              <motion.div
                className="bg-[#1A2233]/90 text-white rounded-2xl p-8 w-[480px] max-w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.15)',
                  border: '1px solid rgba(0, 255, 255, 0.2)'
                }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center" style={{
                  textShadow: '0 0 3px cyan, 0 0 5px cyan'
                }}>
                  {editingCard ? 'Edit Vision' : 'Add Vision'}
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Vision Title"
                    className="w-full p-3 bg-[#0A0F18]/80 text-white rounded-xl"
                    style={{
                      boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
                      border: '1px solid rgba(0, 255, 255, 0.2)'
                    }}
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
                    className="w-full p-3 bg-[#0A0F18]/80 text-white rounded-xl h-24"
                    style={{
                      boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
                      border: '1px solid rgba(0, 255, 255, 0.2)'
                    }}
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
                    className="w-full p-3 bg-[#0A0F18]/80 text-white rounded-xl"
                    style={{
                      boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
                      border: '1px solid rgba(0, 255, 255, 0.2)'
                    }}
                    value={editingCard ? editingCard.deadline : newCard.deadline}
                    onChange={(e) => {
                      if (editingCard) {
                        setEditingCard({ ...editingCard, deadline: e.target.value });
                      } else {
                        setNewCard({ ...newCard, deadline: e.target.value });
                      }
                    }}
                  />
                  <div 
                    className="border rounded-xl p-8 transition-all hover:border-cyan-500/30" 
                    style={{
                      boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
                      border: '1px solid rgba(0, 255, 255, 0.2)',
                      background: 'rgba(10, 15, 24, 0.8)'
                    }}
                  >
                    <label className="flex flex-col items-center cursor-pointer">
                      <Plus 
                        className="w-12 h-12 mb-2" 
                        style={{
                          color: 'cyan',
                          filter: 'drop-shadow(0 0 3px cyan)'
                        }} 
                      />
                      <span 
                        className="text-cyan-500"
                        style={{
                          textShadow: '0 0 3px cyan'
                        }}
                      >
                        Drop your vision here
                      </span>
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
                      className="px-6 py-2 text-gray-400 hover:text-white rounded-xl transition-colors"
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
                              rotation: randomTilt()
                            }
                          ]);
                          setNewCard({ title: '', description: '', deadline: '', image: null });
                        }
                        setModal(false);
                      }}
                      className="relative group px-6 py-2 rounded-xl overflow-hidden bg-[#1A2233] hover:bg-[#1E2943] transition-all duration-300"
                      style={{
                        boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
                        animation: 'pulseGlow 4s ease-in-out infinite'
                      }}
                    >
                      <span className="absolute inset-0 opacity-50 bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
                      <span className="relative text-white font-medium">
                        {editingCard ? 'Save Changes' : 'Add Vision'}
                      </span>
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