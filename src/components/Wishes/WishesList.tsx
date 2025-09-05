import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Search, Filter } from 'lucide-react';
import { WishCard as WishCardType } from '../../types';
import { localStorage } from '../../utils/localStorage';
import CardCreator from './CardCreator';
import WishCard from './WishCard';
import { getRandomWish } from '../../data/wishes';

interface WishesListProps {
  onNotification: {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showReminder: (message: string) => void;
    showInfo: (message: string) => void;
  };
}

const WishesList: React.FC<WishesListProps> = ({ onNotification }) => {
  const [wishes, setWishes] = useState<WishCardType[]>([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState<string>('all');

  useEffect(() => {
    const storedWishes = localStorage.getWishes();
    setWishes(storedWishes);
  }, []);

  useEffect(() => {
    localStorage.saveWishes(wishes);
  }, [wishes]);

  const handleSaveCard = (cardData: Omit<WishCardType, 'id' | 'createdAt'>) => {
    const newCard: WishCardType = {
      ...cardData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setWishes(prev => [...prev, newCard]);
    onNotification.showSuccess(`${cardData.eventType.charAt(0).toUpperCase() + cardData.eventType.slice(1)} card created successfully!`);
  };

  const handleDeleteCard = (id: string) => {
    const card = wishes.find(c => c.id === id);
    setWishes(prev => prev.filter(card => card.id !== id));
    if (card) {
      onNotification.showInfo(`Card "${card.title}" has been deleted`);
    }
  };

  const handleQuickWish = (eventType: string) => {
    const randomWish = getRandomWish(eventType);
    const newCard: WishCardType = {
      id: crypto.randomUUID(),
      title: `Happy ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}!`,
      message: randomWish,
      eventType,
      template: 'elegant-purple',
      createdAt: new Date()
    };
    setWishes(prev => [...prev, newCard]);
    
    onNotification.showSuccess(`Quick ${eventType} card created! 🎉`);
  };

  const quickWishes = [
    { type: 'birthday', icon: '🎂', gradient: 'from-pink-500 to-rose-500' },
    { type: 'eid', icon: '🕌', gradient: 'from-green-500 to-emerald-500' },
    { type: 'christmas', icon: '🎄', gradient: 'from-red-500 to-green-500' },
    { type: 'diwali', icon: '🪔', gradient: 'from-yellow-500 to-orange-500' },
    { type: 'newyear', icon: '🎊', gradient: 'from-purple-500 to-indigo-500' },
    { type: 'anniversary', icon: '💕', gradient: 'from-pink-500 to-red-500' },
    { type: 'graduation', icon: '🎓', gradient: 'from-blue-500 to-cyan-500' },
    { type: 'wedding', icon: '💒', gradient: 'from-rose-500 to-pink-500' }
  ];

  const filteredWishes = wishes.filter(wish => {
    const matchesSearch = wish.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wish.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType = filterEventType === 'all' || wish.eventType === filterEventType;
    return matchesSearch && matchesEventType;
  });

  const eventTypes = [...new Set(wishes.map(wish => wish.eventType))];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wishes & Cards</h1>
          <p className="text-gray-600">Create beautiful cards with 50+ wishes for every occasion</p>
        </div>
        <button
          onClick={() => setIsCreatorOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus size={18} />
          <span>Create Custom Card</span>
        </button>
      </div>

      {/* Quick Wishes */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Create <span className="text-sm font-normal text-gray-600">(Instant cards with random wishes)</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickWishes.map((wish, index) => (
            <button
              key={index}
              onClick={() => handleQuickWish(wish.type)}
              className={`bg-gradient-to-br ${wish.gradient} text-white p-4 rounded-xl hover:scale-105 transition-all duration-200 text-center shadow-md hover:shadow-lg`}
            >
              <div className="text-2xl mb-1">{wish.icon}</div>
              <h3 className="font-medium text-sm capitalize">{wish.type}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      {wishes.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterEventType}
              onChange={(e) => setFilterEventType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              {eventTypes.map(type => (
                <option key={type} value={type} className="capitalize">{type}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Saved Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your Cards ({filteredWishes.length})
        </h2>
        
        {filteredWishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWishes.map(card => (
              <WishCard
                key={card.id}
                card={card}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">💌</div>
            <h3 className="text-xl font-medium text-gray-600 mb-3">
              {wishes.length === 0 ? 'No cards created yet' : 'No cards match your search'}
            </h3>
            <p className="text-gray-500 mb-6">
              {wishes.length === 0 
                ? 'Create beautiful wish cards with our collection of 50+ wishes for every occasion!' 
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {wishes.length === 0 && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setIsCreatorOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2 shadow-lg"
                >
                  <Sparkles size={18} />
                  <span>Create Your First Card</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <CardCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSave={handleSaveCard}
      />
    </div>
  );
};

export default WishesList;