import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Calendar, Building, DollarSign, Heart, Share, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

import { Job } from '../types';
import { mockJobs } from '../data/mockData';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null as File | null,
  });
  
  useEffect(() => {
    // Find the job from mockJobs
    setTimeout(() => {
      const foundJob = mockJobs.find(j => j.id === id);
      setJob(foundJob || null);
      setIsLoading(false);
    }, 500); // Simulate loading
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationData({
      ...applicationData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData({
        ...applicationData,
        resume: e.target.files[0],
      });
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle application submission logic
    alert('Your application has been submitted!');
    setIsApplying(false);
  };

  // Format salary range to display
  const formatSalary = (job: Job) => {
    if (!job.salaryRange) return 'Not specified';
    return `₦${job.salaryRange.min.toLocaleString()} - ₦${job.salaryRange.max.toLocaleString()}`;
  };

  // Format date to display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-48 bg-gray-200 rounded mb-6"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job listing you're looking for doesn't exist or has been removed.</p>
          <Link to="/explore">
            <Button leftIcon={<ArrowLeft size={16} />}>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/explore" className="inline-flex items-center text-gray-600 hover:text-primary-600 transition">
          <ArrowLeft size={18} className="mr-2" />
          Back to job listings
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                <p className="text-lg text-gray-600">{job.companyName}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsSaved(!isSaved)}
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                  aria-label="Save job"
                >
                  <Heart fill={isSaved ? "currentColor" : "none"} size={20} className={isSaved ? "text-red-500" : ""} />
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Share job"
                >
                  <Share size={20} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2 text-gray-400" />
                <span>{job.city}, {job.country}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase size={18} className="mr-2 text-gray-400" />
                <span>{job.employmentType}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign size={18} className="mr-2 text-gray-400" />
                <span>{formatSalary(job)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2 text-gray-400" />
                <span>Posted {formatDate(job.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {job.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-gray-700 mb-6">{job.description}</p>
              
              <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                {job.requirements.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Benefits</h3>
              <ul className="list-disc pl-5 space-y-2">
                {job.benefits.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">About {job.companyName}</h2>
              <div className="flex items-start mb-4">
                <Building size={40} className="text-gray-400 mr-4" />
                <p className="text-gray-700">A leading company in {job.city} specializing in {job.tags[0]} solutions.</p>
              </div>
              <a href="#" className="text-primary-600 hover:text-primary-800 inline-flex items-center">
                Visit company profile
                <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
          
          {isApplying && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Apply for this position</h2>
              <form onSubmit={handleSubmitApplication}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={applicationData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={applicationData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={applicationData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">Resume/CV</label>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      required
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      accept=".pdf,.doc,.docx"
                    />
                    <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                  
                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      rows={5}
                      value={applicationData.coverLetter}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Why are you a good fit for this position?"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit">Submit Application</Button>
                  <button
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-6">Job Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <span className="block text-sm text-gray-500">Posted On</span>
                <span className="font-medium">{formatDate(job.createdAt)}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Job Type</span>
                <span className="font-medium">{job.employmentType}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Salary Range</span>
                <span className="font-medium">{formatSalary(job)}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Location</span>
                <span className="font-medium">{job.city}, {job.country}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Application Deadline</span>
                <span className="font-medium">{formatDate(job.deadline)}</span>
              </div>
            </div>
            
            {!isApplying && (
              <Button 
                onClick={() => setIsApplying(true)} 
                className="w-full"
              >
                Apply Now
              </Button>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Similar Jobs</h2>
            
            <div className="space-y-4">
              <a href="#" className="block hover:bg-gray-50 p-3 rounded-lg transition">
                <h3 className="font-medium">Frontend Developer</h3>
                <p className="text-sm text-gray-600">WebTech Solutions</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-500">New York, NY</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">New</span>
                </div>
              </a>
              
              <a href="#" className="block hover:bg-gray-50 p-3 rounded-lg transition">
                <h3 className="font-medium">React Developer</h3>
                <p className="text-sm text-gray-600">InnoSoft Inc.</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-500">Remote</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Featured</span>
                </div>
              </a>
              
              <a href="#" className="block hover:bg-gray-50 p-3 rounded-lg transition">
                <h3 className="font-medium">UI/UX Developer</h3>
                <p className="text-sm text-gray-600">Creative Design</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-500">San Francisco, CA</span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">2d ago</span>
                </div>
              </a>
            </div>
            
            <a href="/explore" className="text-primary-600 hover:text-primary-800 inline-flex items-center mt-4">
              View all similar jobs
              <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage; 