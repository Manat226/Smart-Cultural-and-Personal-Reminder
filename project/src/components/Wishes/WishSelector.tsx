import React, { useState } from 'react';
import { Shuffle, Heart, Copy } from 'lucide-react';
import { getWishesForEvent, getRandomWish, wishTemplates } from '../../data/wishes';

interface WishSelectorProps {
  eventType: string;
  onSelectWish: (wish: string, template: string) => void;
}

const WishSelector: React.FC<WishSelectorProps> = ({ eventType, onSelectWish }) => {
  const [selectedWish, setSelectedWish] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(wishTemplates[0].id);
  const [currentWishIndex, setCurrentWishIndex] = useState(0);
  
  const wishes = getWishesForEvent(eventType);
  const currentWish = selectedWish || wishes[currentWishIndex] || '';

  const handleRandomWish = () => {
    const randomIndex = Math.floor(Math.random() * wishes.length);
    setCurrentWishIndex(randomIndex);
    setSelectedWish(wishes[randomIndex]);
  };

  const handleNextWish = () => {
    const nextIndex = (currentWishIndex + 1) % wishes.length;
    setCurrentWishIndex(nextIndex);
    setSelectedWish(wishes[nextIndex]);
  };

  const handlePrevWish = () => {
    const prevIndex = currentWishIndex === 0 ? wishes.length - 1 : currentWishIndex - 1;
    setCurrentWishIndex(prevIndex);
    setSelectedWish(wishes[prevIndex]);
  };

  const handleCopyWish = async () => {
    try {
      await navigator.clipboard.writeText(currentWish);
      alert('Wish copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleUseWish = () => {
    onSelectWish(currentWish, selectedTemplate);
  };

  const eventIcons = {
    birthday: '🎂',
    anniversary: '💕',
    eid: '🕌',
    christmas: '🎄',
    diwali: '🪔',
    newyear: '🎊',
    graduation: '🎓',
    wedding: '💒'
  };

  const selectedTemplateData = wishTemplates.find(t => t.id === selectedTemplate) || wishTemplates[0];

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">
          {eventIcons[eventType as keyof typeof eventIcons] || '🎉'}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {eventType} Wishes ({wishes.length} available)
        </h3>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose Template
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {wishTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedTemplate === template.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-full h-8 bg-gradient-to-r ${template.gradient} rounded mb-2`}></div>
              <div className="text-xs font-medium text-gray-700">{template.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Wish Preview */}
      <div className={`relative rounded-xl p-6 text-center min-h-[200px] bg-gradient-to-br ${selectedTemplateData.gradient} ${selectedTemplateData.textColor} overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 text-4xl">
            {eventIcons[eventType as keyof typeof eventIcons] || '🎉'}
          </div>
          <div className="absolute bottom-4 right-4 text-3xl">
            {eventIcons[eventType as keyof typeof eventIcons] || '🎉'}
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-3xl mb-4">
            {eventIcons[eventType as keyof typeof eventIcons] || '🎉'}
          </div>
          <p className="text-lg leading-relaxed mb-4 drop-shadow-sm">
            {currentWish || 'Select a wish to preview'}
          </p>
          <div className={`text-sm ${selectedTemplateData.accentColor} font-medium`}>
            Wish {currentWishIndex + 1} of {wishes.length}
          </div>
        </div>
      </div>

      {/* Wish Navigation */}
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={handlePrevWish}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          ← Previous
        </button>
        
        <button
          onClick={handleRandomWish}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center space-x-2 text-sm font-medium"
        >
          <Shuffle size={14} />
          <span>Random</span>
        </button>
        
        <button
          onClick={handleNextWish}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Next →
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={handleCopyWish}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 text-sm"
        >
          <Copy size={14} />
          <span>Copy</span>
        </button>
        
        <button
          onClick={handleUseWish}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
        >
          <Heart size={14} />
          <span>Use This Wish</span>
        </button>
      </div>
    </div>
  );
};

export default WishSelector;