import React, { useState } from 'react';
import { Play, Pause, Volume2, Calendar, CheckSquare, Sparkles } from 'lucide-react';
import { azureApi } from '../../utils/azureApi';
import { format } from 'date-fns';

const AvatarGuide: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('welcome');

  const avatarTopics = {
    welcome: {
      title: 'Welcome Message',
      content: 'Welcome to your Smart Cultural & Personal Reminder! I\'m here to help you stay organized with your tasks and learn about cultural events around the world.',
      icon: <Sparkles className="text-yellow-500" />
    },
    todayTasks: {
      title: 'Today\'s Tasks',
      content: 'Let me tell you about your tasks for today. You have 3 pending tasks: Morning prayer at 6 AM, Team meeting at 10 AM, and Shopping for festival preparations at 3 PM.',
      icon: <CheckSquare className="text-green-500" />
    },
    upcomingEvents: {
      title: 'Upcoming Cultural Events',
      content: `Today is ${format(new Date(), 'MMMM dd, yyyy')}. The next major cultural event is Eid al-Fitr on March 30th, which marks the end of Ramadan. It's a time for celebration, family gatherings, and charitable giving.`,
      icon: <Calendar className="text-indigo-500" />
    }
  };

  const handlePlayAudio = async (topic: string) => {
    if (isPlaying) {
      setIsPlaying(false);
      // Stop current audio
      return;
    }

    setIsPlaying(true);
    const content = avatarTopics[topic as keyof typeof avatarTopics].content;
    
    try {
      const audioUrl = await azureApi.textToSpeech(content);
      setCurrentAudio(audioUrl);
      
      // Simulate audio playback
      setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Avatar Guide</h1>
        <p className="text-gray-600">Your personal assistant for tasks and cultural insights</p>
      </div>

      {/* Avatar Display */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-center mb-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl">🤖</span>
            </div>
            
            {/* Animated speaking indicator */}
            {isPlaying && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Volume2 size={16} className="text-white" />
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">Cultural Assistant</h2>
          <p className="text-indigo-100">Ready to help you with tasks and events</p>
        </div>
      </div>

      {/* Topic Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(avatarTopics).map(([key, topic]) => (
          <button
            key={key}
            onClick={() => setSelectedTopic(key)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedTopic === key
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              {topic.icon}
              <h3 className="font-semibold text-gray-900">{topic.title}</h3>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{topic.content}</p>
          </button>
        ))}
      </div>

      {/* Selected Topic Display */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {avatarTopics[selectedTopic as keyof typeof avatarTopics].icon}
            <h3 className="text-lg font-semibold text-gray-900">
              {avatarTopics[selectedTopic as keyof typeof avatarTopics].title}
            </h3>
          </div>
          
          <button
            onClick={() => handlePlayAudio(selectedTopic)}
            disabled={isPlaying}
            className={`p-3 rounded-full transition-all duration-200 ${
              isPlaying
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105'
            }`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
        
        <p className="text-gray-700 leading-relaxed">
          {avatarTopics[selectedTopic as keyof typeof avatarTopics].content}
        </p>
        
        {/* Audio Visualization */}
        {isPlaying && (
          <div className="flex items-center justify-center space-x-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-indigo-500 rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.random() * 20}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarGuide;