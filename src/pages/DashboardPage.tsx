import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Clock, MapPin, ChevronRight, Briefcase, Users, Bell, Award, Bookmark, TrendingUp, BarChart } from 'lucide-react';

import { Job, Member } from '../types';
import { mockJobs, mockMembers } from '../data/mockData';

// Default logged in user is the first member
const currentUser = mockMembers[0];

const DashboardPage: React.FC = () => {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data from centralized source
    setFeaturedJobs(mockJobs.slice(0, 2));
    setRecentJobs(mockJobs);
    setIsLoading(false);
  }, []);

  // Format date to display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome header section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 mb-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.fullName.split(' ')[0]}!</h1>
        <p className="text-primary-50 mb-6 max-w-2xl">Stay updated with the latest job opportunities, track your applications, and continue your professional growth journey.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/explore" className="bg-white text-primary-600 hover:bg-primary-50 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center">
            <Briefcase size={18} className="mr-2" />
            Explore Jobs
          </Link>
          <Link to="/profile" className="bg-secondary-700 bg-opacity-30 hover:bg-opacity-40 text-white px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center border border-secondary-400 border-opacity-30">
            <Users size={18} className="mr-2" />
            Complete Profile
          </Link>
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-secondary-500 mb-1">Applications</p>
              <h3 className="text-2xl font-bold text-secondary-800">{currentUser.applications.length}</h3>
            </div>
            <div className="bg-primary-100 p-2.5 rounded-lg">
              <Briefcase size={22} className="text-primary-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className="text-xs font-medium px-2 py-1 bg-success-100 text-success-600 rounded-full">+2 new</span>
            <Link to="/applications" className="text-sm text-primary-600 hover:text-primary-700 font-medium ml-auto flex items-center">
              View all <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-secondary-500 mb-1">Saved Jobs</p>
              <h3 className="text-2xl font-bold text-secondary-800">12</h3>
            </div>
            <div className="bg-secondary-100 p-2.5 rounded-lg">
              <Bookmark size={22} className="text-secondary-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 rounded-full">3 matches</span>
            <Link to="/saved" className="text-sm text-primary-600 hover:text-primary-700 font-medium ml-auto flex items-center">
              View all <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-secondary-500 mb-1">Notifications</p>
              <h3 className="text-2xl font-bold text-secondary-800">7</h3>
            </div>
            <div className="bg-warning-500/20 p-2.5 rounded-lg">
              <Bell size={22} className="text-warning-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className="text-xs font-medium px-2 py-1 bg-error-100 text-error-600 rounded-full">4 unread</span>
            <Link to="/notifications" className="text-sm text-primary-600 hover:text-primary-700 font-medium ml-auto flex items-center">
              View all <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-secondary-500 mb-1">Upcoming Events</p>
              <h3 className="text-2xl font-bold text-secondary-800">3</h3>
            </div>
            <div className="bg-accent-100 p-2.5 rounded-lg">
              <Award size={22} className="text-accent-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className="text-xs font-medium px-2 py-1 bg-warning-500/20 text-warning-600 rounded-full">1 this week</span>
            <Link to="/seminars" className="text-sm text-primary-600 hover:text-primary-700 font-medium ml-auto flex items-center">
              View all <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Featured jobs section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-secondary-800 flex items-center">
                <TrendingUp size={18} className="mr-2 text-primary-600" />
                Recommended Jobs for You
              </h2>
              <Link to="/explore" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                View all <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="divide-y divide-gray-100">
              {featuredJobs.map((job) => (
                <Link 
                  to={`/jobs/${job.id}`} 
                  key={job.id}
                  className="block p-6 hover:bg-secondary-50 transition-colors duration-150"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="text-secondary-600" size={24} />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-secondary-900">{job.title}</h3>
                        <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                          {job.locationType}
                        </span>
                      </div>
                      
                      <p className="text-secondary-600 mb-2">{job.companyName}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary-500 mb-3">
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          <span>{job.country}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{formatDate(job.deadline)}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {job.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-secondary-100 text-secondary-700 text-xs px-2.5 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {job.tags.length > 3 && (
                          <span className="text-xs text-secondary-500">+{job.tags.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile completion section */}
          <div className="bg-gradient-to-br from-secondary-50 via-primary-50 to-white rounded-xl shadow-sm border border-primary-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Users size={28} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-bold text-secondary-900 text-lg">Complete your profile</h3>
                <p className="text-secondary-600 text-sm">A complete profile gets 4x more job opportunities</p>
              </div>
            </div>
            
            <div className="w-full bg-secondary-200 rounded-full h-2.5 mb-3">
              <div className="bg-primary-600 h-2.5 rounded-full w-[65%]"></div>
            </div>
            
            <div className="flex justify-between items-center text-sm mb-5">
              <span className="text-secondary-600">65% completed</span>
              <span className="text-primary-700 font-medium">3 steps remaining</span>
            </div>
            
            <Link 
              to="/profile" 
              className="text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2.5 font-medium transition-colors inline-block"
            >
              Continue Setup
            </Link>
          </div>
          
          {/* Recent seminars/events section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-secondary-800 flex items-center">
                <Award size={18} className="mr-2 text-warning-500" />
                Upcoming Seminars
              </h2>
              <Link to="/seminars" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                View all <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-5 mb-6 pb-6 border-b border-gray-100">
                <div className="bg-warning-500/20 rounded-lg text-center py-2 px-3 flex-shrink-0 w-16">
                  <span className="block text-warning-600 text-lg font-bold">15</span>
                  <span className="block text-warning-600 text-sm">Jun</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Solar Energy Installation Basics</h4>
                  <p className="text-sm text-secondary-600 mb-2">Learn the fundamentals of solar panel installation</p>
                  <div className="flex items-center text-xs text-secondary-500">
                    <MapPin size={14} className="mr-1" />
                    <span>Kano, Nigeria</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="bg-accent-100 rounded-lg text-center py-2 px-3 flex-shrink-0 w-16">
                  <span className="block text-accent-800 text-lg font-bold">10</span>
                  <span className="block text-accent-700 text-sm">Jul</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Effective Farming Techniques</h4>
                  <p className="text-sm text-secondary-600 mb-2">Maximize crop yield in northern Nigerian climate</p>
                  <div className="flex items-center text-xs text-secondary-500">
                    <MapPin size={14} className="mr-1" />
                    <span>Kaduna, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Profile summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                {currentUser.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.fullName} 
                    className="w-full h-full object-cover rounded-full" 
                  />
                ) : (
                  <span className="text-primary-600 text-xl font-bold">{getInitials(currentUser.fullName)}</span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-secondary-900">{currentUser.fullName}</h3>
                <p className="text-secondary-600 text-sm">{currentUser.skills[0]} Specialist</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600 font-medium">Profile views</span>
                  <span className="text-secondary-900 font-semibold">34</span>
                </div>
                <div className="w-full bg-secondary-100 rounded-full h-1.5">
                  <div className="bg-primary-600 h-1.5 rounded-full w-[70%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600 font-medium">Search appearances</span>
                  <span className="text-secondary-900 font-semibold">12</span>
                </div>
                <div className="w-full bg-secondary-100 rounded-full h-1.5">
                  <div className="bg-accent-500 h-1.5 rounded-full w-[40%]"></div>
                </div>
              </div>
            </div>
            
            <Link to="/profile" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center w-full border border-primary-600 rounded-lg px-4 py-2 transition-colors">
              View Profile
            </Link>
          </div>
          
          {/* Recent jobs section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-secondary-800 flex items-center">
                <BarChart size={18} className="mr-2 text-primary-600" />
                Recent Jobs
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentJobs.slice(0, 4).map((job) => (
                <Link 
                  to={`/jobs/${job.id}`} 
                  key={job.id}
                  className="block px-6 py-4 hover:bg-secondary-50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-md flex items-center justify-center flex-shrink-0">
                      <Building className="text-secondary-600" size={20} />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-secondary-900 text-sm">{job.title}</h3>
                      <p className="text-secondary-500 text-xs">{job.companyName}</p>
                    </div>
                  </div>
                </Link>
              ))}
              
              <div className="px-6 py-4">
                <Link to="/explore" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center">
                  Show more jobs <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Skills section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-secondary-800">Your Top Skills</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/profile" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  Manage skills <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 