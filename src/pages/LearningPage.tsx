import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Award, Star, Users } from 'lucide-react';
import { mockCourses, Course } from '../data/mockData';

const LearningPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    level: '',
  });
  
  // Use the mock courses from mockData.ts
  const courses = mockCourses;

  // Apply filters to courses
  const filteredCourses = courses.filter((course) => {
    // Apply search term filter
    if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !course.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (filters.category && course.category !== filters.category) {
      return false;
    }
    
    // Apply level filter
    if (filters.level && course.level !== filters.level) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Learning Hub</h1>
          <p className="text-gray-600 mt-1">Develop your skills with courses and resources</p>
        </div>
        <div className="mt-4 md:mt-0">
          <a href="#" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition">
            My Learning
          </a>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for courses, skills, or topics"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Career">Career</option>
              <option value="Data Science">Data Science</option>
            </select>
            
            <select
              value={filters.level}
              onChange={(e) => setFilters({...filters, level: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Recommended for you</h2>
        
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search filters</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: '', level: '' });
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="h-40 bg-gray-200">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full">
                      {course.category}
                    </span>
                    <span className="flex items-center text-amber-500">
                      <Star size={16} className="fill-current" />
                      <span className="ml-1 text-sm">{course.rating}</span>
                    </span>
                  </div>
                  
                  <h3 className="font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Clock size={16} className="mr-1" />
                    <span>{course.duration}</span>
                    <span className="mx-2">•</span>
                    <Award size={16} className="mr-1" />
                    <span>{course.level}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-500 text-sm">
                      {course.enrollments.toLocaleString()} students
                    </div>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-lg text-sm transition">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-primary-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-8">
            <BookOpen size={48} className="text-primary-600 mx-auto md:mx-0" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h3 className="text-xl font-bold mb-2">Unlock Premium Learning</h3>
            <p className="text-gray-600 mb-4">Get unlimited access to all courses, workshops, and career resources.</p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition">
              Try Premium Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage; 