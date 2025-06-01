import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, ExternalLink, Filter, Search } from 'lucide-react';

import { Seminar } from '../types';
import { mockSeminars } from '../data/mockData';

const SeminarsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [filteredSeminars, setFilteredSeminars] = useState<Seminar[]>([]);
  const [activeSeminar, setActiveSeminar] = useState<Seminar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    upcoming: true,
    virtual: false
  });
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  useEffect(() => {
    // Use mockSeminars from mockData.ts
    setTimeout(() => {
      setSeminars(mockSeminars);
      setFilteredSeminars(mockSeminars);
      if (id) {
        const seminar = mockSeminars.find(s => s.id === id);
        if (seminar) {
          setActiveSeminar(seminar);
        }
      } else {
        setActiveSeminar(null);
        setSelectedLocationId(null);
      }
      setIsLoading(false);
    }, 500); // Simulate loading
  }, [id]);

  useEffect(() => {
    // Apply filters
    let results = seminars;
    
    if (searchTerm) {
      results = results.filter(seminar => 
        seminar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seminar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (seminar.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ?? false)
      );
    }
    
    if (filters.type) {
      results = results.filter(seminar => seminar.type === filters.type);
    }
    
    if (filters.upcoming) {
      const today = new Date();
      results = results.filter(seminar =>
        seminar.locations.some(loc => new Date(loc.date) >= today)
      );
    }
    
    if (filters.virtual) {
      results = results.filter(seminar => seminar.isVirtual);
    }
    
    setFilteredSeminars(results);
  }, [searchTerm, filters, seminars]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.checked
    });
  };

  const getSeminarTypeColor = (type: string) => {
    switch (type) {
      case 'webinar':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-purple-100 text-purple-800';
      case 'conference':
        return 'bg-green-100 text-green-800';
      case 'meetup':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Display single seminar view if an ID is provided and seminar is found
  if (activeSeminar) {
    // Find the selected location (no default)
    const selectedLocation = activeSeminar.locations.find(loc => loc.id === selectedLocationId);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/seminars" className="text-gray-600 hover:text-primary-600 transition flex items-center">
            <Calendar className="mr-2" size={18} />
            Back to all seminars
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-64 bg-gray-200">
            <img
              src={activeSeminar.image}
              alt={activeSeminar.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {(activeSeminar.tags ?? []).map((tag, index) => (
                <span key={index} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                  {tag}
                </span>
              ))}
              <span className={`text-xs px-3 py-1 rounded-full ${getSeminarTypeColor(activeSeminar.type ?? '')}`}>
                {(activeSeminar.type ?? '').charAt(0).toUpperCase() + (activeSeminar.type ?? '').slice(1)}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{activeSeminar.title}</h1>
            <p className="text-gray-600 mb-6">{activeSeminar.description}</p>
            
            {/* Location selection UI as cards */}
            <div className="mb-6">
              <label className="block font-medium mb-2">Choose a location:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activeSeminar.locations.map((loc) => {
                  const isSelected = selectedLocationId === loc.id;
                  return (
                    <div
                      key={loc.id}
                      className={`cursor-pointer border rounded-lg p-4 shadow-sm transition-all duration-150 ${isSelected ? 'border-primary-600 ring-2 ring-primary-300 bg-primary-50' : 'border-gray-200 bg-white hover:border-primary-400'}`}
                      onClick={() => setSelectedLocationId(loc.id)}
                    >
                      <div className="font-semibold text-primary-700 mb-1">{loc.city}</div>
                      <div className="text-gray-700 text-sm mb-1">{loc.address}</div>
                      <div className="text-gray-500 text-xs mb-1">
                        {loc.date instanceof Date ? loc.date.toLocaleDateString() : new Date(loc.date).toLocaleDateString()} | {loc.duration} min
                      </div>
                      <div className="text-gray-500 text-xs mb-1">₦{loc.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">{loc.registeredCount ?? 0} / {loc.capacity ?? 'N/A'} registered</div>
                      <div className={`mt-2 inline-block px-2 py-1 text-xs rounded ${loc.status === 'upcoming' && loc.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{loc.status.charAt(0).toUpperCase() + loc.status.slice(1)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Only show details and Book/Pay if a location is selected */}
            {selectedLocation && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="text-gray-400 mr-3 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium">Date and Time</h3>
                        <p className="text-gray-600">{
                          selectedLocation.date instanceof Date
                            ? selectedLocation.date.toLocaleDateString()
                            : new Date(selectedLocation.date).toLocaleDateString()
                        }, {activeSeminar.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="text-gray-400 mr-3 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium">Duration</h3>
                        <p className="text-gray-600">{selectedLocation.duration} min</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="text-gray-400 mr-3 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium">Capacity</h3>
                        <p className="text-gray-600">{selectedLocation.registeredCount ?? 0} / {selectedLocation.capacity ?? 'N/A'} registered</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="text-gray-400 mr-3 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-gray-600">
                          {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.country}
                          {activeSeminar.isVirtual && ' (Virtual)'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div>
                        <h3 className="font-medium">Price</h3>
                        <p className="text-gray-600">₦{selectedLocation.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div>
                        <h3 className="font-medium">Status</h3>
                        <p className="text-gray-600">{selectedLocation.status.charAt(0).toUpperCase() + selectedLocation.status.slice(1)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div>
                        <h3 className="font-medium">Host</h3>
                        <p className="text-gray-600">{activeSeminar.host}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="text-gray-600">
                    <span className="font-medium">{selectedLocation.registeredCount}</span> people attending
                  </div>
                  <button
                    className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                    onClick={() => alert(`Booking for ${activeSeminar.title} at ${selectedLocation.city}, ₦${selectedLocation.price.toLocaleString()}`)}
                    disabled={selectedLocation.status !== 'upcoming' || !selectedLocation.isActive}
                  >
                    Book / Pay
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Similar Seminars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {seminars
              .filter(seminar => seminar.id !== activeSeminar.id)
              .slice(0, 3)
              .map((seminar) => (
                <Link to={`/seminars/${seminar.id}`} key={seminar.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-gray-200">
                    <img
                      src={seminar.image}
                      alt={seminar.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeminarTypeColor(seminar.type ?? '')}`}>
                      {(seminar.type ?? '').charAt(0).toUpperCase() + (seminar.type ?? '').slice(1)}
                    </span>
                    <h3 className="font-semibold mt-2 mb-1">{seminar.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar size={14} className="mr-1" />
                      <span>{
                        seminar.locations[0].date instanceof Date
                          ? seminar.locations[0].date.toLocaleDateString()
                          : new Date(seminar.locations[0].date).toLocaleDateString()
                      }</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // Display seminar listing view
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Professional Development</h1>
      <p className="text-gray-600 mb-8">Discover workshops, webinars, and networking events to advance your career</p>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for seminars, topics, or tags"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="webinar">Webinars</option>
              <option value="workshop">Workshops</option>
              <option value="conference">Conferences</option>
              <option value="meetup">Meetups</option>
            </select>
            
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="upcoming"
                  checked={filters.upcoming}
                  onChange={handleCheckboxChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-700">Upcoming only</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="virtual"
                  checked={filters.virtual}
                  onChange={handleCheckboxChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-700">Virtual only</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {filteredSeminars.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <Filter size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No seminars found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search filters</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilters({ type: '', upcoming: true, virtual: false });
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeminars.map((seminar) => {
            // Find the soonest upcoming location
            const today = new Date();
            const upcomingLocations = seminar.locations.filter(loc => new Date(loc.date) >= today);
            const soonestLocation = upcomingLocations.length > 0
              ? upcomingLocations.reduce((a, b) => new Date(a.date) < new Date(b.date) ? a : b)
              : seminar.locations[0];
            return (
              <Link to={`/seminars/${seminar.id}`} key={seminar.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="h-48 bg-gray-200">
                  <img
                    src={seminar.image}
                    alt={seminar.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeminarTypeColor(seminar.type ?? '')}`}>
                      {(seminar.type ?? '').charAt(0).toUpperCase() + (seminar.type ?? '').slice(1)}
                    </span>
                    {seminar.isVirtual && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        Virtual
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold mb-2">{seminar.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{seminar.description}</p>
                  <div className="flex flex-wrap gap-y-2 gap-x-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{
                        soonestLocation.date instanceof Date
                          ? soonestLocation.date.toLocaleDateString()
                          : new Date(soonestLocation.date).toLocaleDateString()
                      }</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{seminar.time}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Users size={14} className="mr-1" />
                      <span>{soonestLocation.registeredCount} attendees</span>
                    </div>
                    <span className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                      View details
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SeminarsPage; 