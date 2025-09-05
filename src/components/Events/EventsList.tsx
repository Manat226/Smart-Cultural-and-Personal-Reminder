import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar as CalendarIcon, Grid } from 'lucide-react';
import { Event } from '../../types';
import { culturalEvents } from '../../data/culturalEvents';
import { notificationManager } from '../../utils/notifications';
import EventCard from './EventCard';
import EventModal from './EventModal';
import EventCalendar from './EventCalendar';

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReligion, setFilterReligion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('cards');

  useEffect(() => {
    const eventsWithIds = culturalEvents.map(event => ({
      ...event,
      id: crypto.randomUUID(),
      category: event.date > new Date() ? 'upcoming' : 'past' as const
    }));
    setEvents(eventsWithIds);
    
    // Schedule notifications for upcoming cultural events (1 day before)
    eventsWithIds.forEach(event => {
      if (event.category === 'upcoming') {
        const reminderDate = new Date(event.date);
        reminderDate.setDate(reminderDate.getDate() - 1);
        reminderDate.setHours(9, 0, 0, 0); // 9 AM reminder
        
        notificationManager.scheduleNotification(
          `event-${event.id}`,
          reminderDate,
          {
            title: 'Cultural Event Reminder',
            message: `Tomorrow is ${event.name}! ${event.celebrationDetails}`,
            sound: true,
            icon: '/icon-192.png'
          }
        );
      }
    });
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.culture.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.religion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReligion = filterReligion === 'all' || 
                           event.religion.toLowerCase().includes(filterReligion.toLowerCase());
    return matchesSearch && matchesReligion;
  });

  const upcomingEvents = filteredEvents.filter(event => event.category === 'upcoming');
  const pastEvents = filteredEvents.filter(event => event.category === 'past');

  const religions = [...new Set(events.map(event => event.religion))];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Cultural Events</h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'cards' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'calendar' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CalendarIcon size={18} />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events, cultures, religions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterReligion}
            onChange={(e) => setFilterReligion(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Religions</option>
            {religions.map(religion => (
              <option key={religion} value={religion}>{religion}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'calendar' ? (
        <EventCalendar events={filteredEvents} onEventClick={handleEventClick} />
      ) : (
        <div className="space-y-8">
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upcoming Events ({upcomingEvents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Past Events ({pastEvents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎭</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
};

export default EventsList;