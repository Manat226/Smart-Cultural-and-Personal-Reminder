import React from 'react';
import { Calendar, MapPin, Book, Users } from 'lucide-react';
import { Event } from '../../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const isUpcoming = event.date > new Date();
  
  return (
    <div 
      onClick={() => onClick(event)}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{event.icon}</div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{event.name}</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar size={14} />
              <span>{format(event.date, 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isUpcoming 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {isUpcoming ? 'Upcoming' : 'Past'}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-gray-600">{event.origin}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Book size={14} className="text-gray-400" />
          <span className="text-gray-600">{event.religion}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users size={14} className="text-gray-400" />
          <span className="text-gray-600">{event.culture}</span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mt-3 line-clamp-2">
        {event.celebrationDetails}
      </p>
    </div>
  );
};

export default EventCard;