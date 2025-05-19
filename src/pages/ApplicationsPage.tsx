import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';

import { Job } from '../types';
import { Link } from 'react-router-dom';
import { mockApplications } from '../data/mockData';

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Job[]>(mockApplications);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Interview':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-gray-600 mt-1">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'} submitted
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
          <p className="text-gray-500 mb-4">Start applying to jobs to track your applications here.</p>
          <a href="/explore" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-gray-600">Position</th>
                  <th className="px-4 py-3 text-gray-600">Company</th>
                  <th className="px-4 py-3 text-gray-600">Date Applied</th>
                  <th className="px-4 py-3 text-gray-600">Status</th>
                  <th className="px-4 py-3 text-gray-600">Deadline</th>
                  <th className="px-4 py-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/jobs/${application.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {application.title}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {application.tags && application.tags.map((tag) => (
                          <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded mr-1">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.deadline.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link className="text-primary-600 hover:text-primary-800" to={`/jobs/${application.id}`}>View Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage; 