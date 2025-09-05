import React, { useRef } from 'react';
import { Download, Share, MessageCircle, Twitter, Facebook, Trash2 } from 'lucide-react';
import { WishCard as WishCardType } from '../../types';
import { wishTemplates } from '../../data/wishes';
import { downloadCardAsImage, shareCard, shareToWhatsApp, shareToTwitter, shareToFacebook } from '../../utils/cardUtils';
import { format } from 'date-fns';

interface WishCardProps {
  card: WishCardType;
  onDelete: (id: string) => void;
}

const WishCard: React.FC<WishCardProps> = ({ card, onDelete }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const template = wishTemplates.find(t => t.id === card.template) || wishTemplates[0];

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

  const handleDownload = () => {
    if (cardRef.current) {
      downloadCardAsImage(cardRef.current, `${card.title.replace(/\s+/g, '-').toLowerCase()}-card`);
    }
  };

  const handleShare = () => {
    shareCard(card.title, card.message);
  };

  const handleWhatsAppShare = () => {
    shareToWhatsApp(card.title, card.message);
  };

  const handleTwitterShare = () => {
    shareToTwitter(card.title, card.message);
  };

  const handleFacebookShare = () => {
    shareToFacebook(card.title, card.message);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Card Preview */}
      <div
        ref={cardRef}
        className={`relative h-48 bg-gradient-to-br ${template.gradient} flex items-center justify-center text-center p-6 overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 text-6xl opacity-30">
            {eventIcons[card.eventType as keyof typeof eventIcons] || '🎉'}
          </div>
          <div className="absolute bottom-4 right-4 text-4xl opacity-20">
            {eventIcons[card.eventType as keyof typeof eventIcons] || '🎉'}
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">
            {eventIcons[card.eventType as keyof typeof eventIcons] || '🎉'}
          </div>
        </div>

        {/* Custom Image Overlay */}
        {card.customImage && (
          <>
            <img
              src={card.customImage}
              alt="Card background"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            {/* Person's image in circular frame */}
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg z-10">
              <img
                src={card.customImage}
                alt="Person"
                className="w-full h-full object-cover"
              />
            </div>
          </>
        )}
        
        {/* Card Content */}
        <div className={`relative z-10 ${template.textColor}`}>
          <h3 className="text-xl font-bold mb-2 drop-shadow-sm">{card.title}</h3>
          <div className="text-3xl mb-2 drop-shadow-sm">
            {eventIcons[card.eventType as keyof typeof eventIcons] || '🎉'}
          </div>
          <p className={`text-sm ${template.accentColor} line-clamp-3 drop-shadow-sm`}>
            {card.message}
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-white bg-opacity-20 rounded-full"></div>
      </div>
      
      {/* Card Info */}
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-2">
            <span className="capitalize font-medium">{card.eventType}</span>
            <span>•</span>
            <span>{format(card.createdAt, 'MMM dd, yyyy')}</span>
          </div>
          <span className="capitalize text-indigo-600 font-medium">{template.name}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Primary Actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="flex-1 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-1 text-sm font-medium"
            >
              <Download size={14} />
              <span>Download</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-1 text-sm font-medium"
            >
              <Share size={14} />
              <span>Share</span>
            </button>
          </div>
          
          {/* Social Media Actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 text-xs"
            >
              <MessageCircle size={12} />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleTwitterShare}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1 text-xs"
            >
              <Twitter size={12} />
              <span>Twitter</span>
            </button>
            <button
              onClick={handleFacebookShare}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-xs"
            >
              <Facebook size={12} />
              <span>Facebook</span>
            </button>
            <button 
              onClick={() => onDelete(card.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishCard;