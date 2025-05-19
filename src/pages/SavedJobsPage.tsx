import React, { useState } from 'react';
import { MapPin, Briefcase } from 'lucide-react';

import { Job } from '../types';
import { Link } from 'react-router-dom';
import { mockSavedJobs } from '../data/mockData';


const SavedJobsPage: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>(mockSavedJobs);

  const handleRemove = (id: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Saved Jobs</h1>
          <p className="text-gray-600 mt-1">
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved for later
          </p>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved jobs</h3>
          <p className="text-gray-500 mb-4">Save jobs you're interested in to apply later.</p>
          <a href="/explore" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-gray-500 text-sm">{job.companyName}</p>
                  <div className="flex items-center text-gray-400 text-xs mt-2">
                    <MapPin size={14} className="mr-1" />
                    {job.city}, {job.country}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.tags && job.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded mr-1">{tag}</span>
                    ))}
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={e => { e.preventDefault(); handleRemove(job.id); }}
                >
                  Remove
                </button>
              </div>
              <div className="text-gray-400 text-xs mt-2">
                Deadline: {job.deadline.toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage; 