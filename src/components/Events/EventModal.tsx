import React from 'react';
import { X, Calendar, MapPin, Book, Users, Clock } from 'lucide-react';
import { Event } from '../../types';
import { format } from 'date-fns';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{event.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
                <div className="flex items-center space-x-2 text-gray-600 mt-1">
                  <Calendar size={16} />
                  <span>{format(event.date, 'EEEE, MMMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Origin</h4>
                  <p className="text-gray-600">{event.origin}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Book size={18} className="text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Religion</h4>
                  <p className="text-gray-600">{event.religion}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Users size={18} className="text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Culture</h4>
                  <p className="text-gray-600">{event.culture}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-orange-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Type</h4>
                  <p className="text-gray-600 capitalize">{event.type}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">History</h4>
              <p className="text-gray-700 leading-relaxed">{event.history}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How It's Celebrated</h4>
              <p className="text-gray-700 leading-relaxed">{event.celebrationDetails}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;