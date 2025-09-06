import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { WishCard } from '../../types';
import { wishTemplates } from '../../data/wishes';
import WishSelector from './WishSelector';
import ImageUpload from './ImageUpload';

interface CardCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<WishCard, 'id' | 'createdAt'>) => void;
}

const CardCreator: React.FC<CardCreatorProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    eventType: 'birthday',
    template: 'elegant-purple',
    customImage: ''
  });
  const [showWishSelector, setShowWishSelector] = useState(false);

  const eventTypes = [
    'Birthday', 'Anniversary', 'Eid', 'Christmas', 'Diwali', 'Newyear', 'Graduation', 'Wedding'
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      title: '',
      message: '',
      eventType: 'birthday',
      template: 'elegant-purple',
      customImage: ''
    });
    onClose();
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, customImage: imageUrl }));
  };

  const handleSelectWish = (wish: string, template: string) => {
    setFormData(prev => ({ ...prev, message: wish, template }));
    setShowWishSelector(false);
  };

  const getWishesForEvent = (eventType: string) => {
    return wishTemplates.find(t => t.id === formData.template)?.wishes || [];
  };

  if (!isOpen) return null;

  const selectedTemplate = wishTemplates.find(t => t.id === formData.template) || wishTemplates[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create Wish Card</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {showWishSelector ? (
            <WishSelector
              eventType={formData.eventType}
              onSelectWish={handleSelectWish}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Happy Birthday!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <div className="flex space-x-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setShowWishSelector(true)}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center space-x-1 text-sm"
                  >
                    <Sparkles size={14} />
                    <span>Browse 50+ Wishes</span>
                  </button>
                </div>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Write your heartfelt message here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {wishTemplates.map(template => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, template: template.id }))}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        formData.template === template.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-6 bg-gradient-to-r ${template.gradient} rounded mb-2`}></div>
                      <div className="text-sm font-medium">{template.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  currentImage={formData.customImage}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Create Card</span>
              </button>
            </form>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              
              <div className={`relative rounded-xl p-6 text-center min-h-[300px] bg-gradient-to-br ${selectedTemplate.gradient} ${selectedTemplate.textColor} overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 text-6xl opacity-30">
                    {eventIcons[formData.eventType as keyof typeof eventIcons] || '🎉'}
                  </div>
                  <div className="absolute bottom-4 right-4 text-4xl opacity-20">
                    {eventIcons[formData.eventType as keyof typeof eventIcons] || '🎉'}
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">
                    {eventIcons[formData.eventType as keyof typeof eventIcons] || '🎉'}
                  </div>
                </div>

                {formData.customImage && (
                  <img
                    src={formData.customImage}
                    alt="Custom background"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-30"
                  />
                )}
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4 drop-shadow-sm">
                    {formData.title || 'Card Title'}
                  </h2>
                  
                  {/* Person's image in a circular frame */}
                  {formData.customImage && (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={formData.customImage}
                        alt="Person"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="text-3xl mb-4 drop-shadow-sm">
                    {eventIcons[formData.eventType as keyof typeof eventIcons] || '🎉'}
                  </div>
                  <p className={`text-lg leading-relaxed ${selectedTemplate.accentColor} drop-shadow-sm`}>
                    {formData.message || 'Your message will appear here...'}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-white bg-opacity-20 rounded-full"></div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowWishSelector(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2 font-medium"
                >
                  <Sparkles size={16} />
                  <span>Browse {getWishesForEvent(formData.eventType).length} {formData.eventType} Wishes</span>
                </button>
              </div>
            </div>
            </div>
          )}

          {showWishSelector ? (
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowWishSelector(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ← Back to Form
              </button>
            </div>
          ) : (
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>Create Card</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCreator;