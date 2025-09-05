import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';

interface EventCalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div
              key={day.toISOString()}
              className={`min-h-[80px] p-2 border border-gray-100 rounded-lg ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left p-1 bg-indigo-100 text-indigo-800 rounded text-xs hover:bg-indigo-200 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{event.icon}</span>
                      <span className="truncate">{event.name}</span>
                    </div>
                  </button>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventCalendar;