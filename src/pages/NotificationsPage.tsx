import React, { useState } from 'react';
import { BellOff, Briefcase, Calendar, MessageSquare, User, Trash2, Check } from 'lucide-react';
import { mockNotifications } from '../data/mockData';
import { Notification } from '../types';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const [activeFilter, setActiveFilter] = useState('all');

  // Filter notifications based on active filter
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase size={20} className="text-blue-500" />;
      case 'application': return <Check size={20} className="text-green-500" />;
      case 'message': return <MessageSquare size={20} className="text-purple-500" />;
      case 'event': return <Calendar size={20} className="text-amber-500" />;
      case 'profile': return <User size={20} className="text-pink-500" />;
      default: return <Briefcase size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-gray-600 mt-1">You have {unreadCount} unread notifications</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition text-sm"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex overflow-x-auto border-b border-gray-200">
          <button 
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${activeFilter === 'all' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${activeFilter === 'unread' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveFilter('unread')}
          >
            Unread
          </button>
          <button 
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${activeFilter === 'job' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveFilter('job')}
          >
            Jobs
          </button>
          <button 
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${activeFilter === 'application' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveFilter('application')}
          >
            Applications
          </button>
          <button 
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${activeFilter === 'message' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveFilter('message')}
          >
            Messages
          </button>
          <button 
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${activeFilter === 'event' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveFilter('event')}
          >
            Events
          </button>
        </div>

        <div>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <BellOff size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No notifications</p>
              <p className="text-gray-400 text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div>
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 p-2">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    
                    <div className="flex space-x-1 ml-2">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-100"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                        title="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-primary-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Notification Settings</h2>
        <p className="text-gray-600 mb-4">Customize your notification preferences to receive updates that matter most to you.</p>
        <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition">
          Manage Settings
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage; 