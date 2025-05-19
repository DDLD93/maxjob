import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, XCircle } from 'lucide-react';

import { Job } from '../types';
import { mockJobs } from '../data/mockData';

const ExplorePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    experience: ''
  });
  
  useEffect(() => {
    // Use mock data from centralized source
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
    setIsLoading(false);
  }, []);

  // Apply search and filters
  useEffect(() => {
    let result = jobs;
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply job type filter
    if (filters.jobType) {
      result = result.filter(job => job.employmentType.toLowerCase() === filters.jobType.toLowerCase());
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(job => 
        `${job.city}, ${job.country}`.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    setFilteredJobs(result);
  }, [jobs, searchTerm, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is applied via the useEffect
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      jobType: '',
      location: '',
      experience: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Jobs</h1>
        <p className="text-gray-600">Find your perfect job opportunity</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <Filter size={18} className="mr-2" />
                Filters
              </h2>
              {(filters.jobType || filters.location || filters.experience) && (
                <button 
                  onClick={resetFilters}
                  className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                >
                  Reset <XCircle size={16} className="ml-1" />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <option value="">All Locations</option>
                  <option value="nigeria">Nigeria</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search jobs, skills, companies..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-lg transition"
              >
                Search
              </button>
            </form>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
              {(searchTerm || filters.jobType || filters.location || filters.experience) && ' based on your search'}
            </p>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                  <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search filters or try again later.</p>
                  <button 
                    onClick={resetFilters}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map(job => (
                    <Link 
                      to={`/jobs/${job.id}`} 
                      key={job.id} 
                      className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-gray-600 mt-1">{job.companyName}</p>
                        </div>
                        <span className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full">
                          {job.employmentType}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm mt-3">
                        <MapPin size={16} className="mr-1" />
                        <span>{job.city}, {job.country}</span>
                      </div>
                      
                      <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex flex-wrap gap-2">
                          {job.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {job.tags.length > 3 && (
                            <span className="text-gray-500 text-xs">+{job.tags.length - 3} more</span>
                          )}
                        </div>
                        <span className="text-gray-500 text-xs">
                          Posted on {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage; 