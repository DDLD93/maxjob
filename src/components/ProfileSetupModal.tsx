import React, { useState, useRef } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { Member, MembershipLevel, EducationLevel, MemberStatus, Education, Experience } from '../types';
import { User, Briefcase, FileText, GraduationCap, Calendar, Upload, X, Plus, CreditCard, Check } from 'lucide-react';

const steps = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'uploads', label: 'Documents', icon: FileText },
  { id: 'interests', label: 'Interests', icon: Calendar },
];

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (member: Partial<Member>) => void;
}

// Add this type before the defaultMember
type Gender = 'male' | 'female' | 'other' | '';

const defaultMember: Partial<Member> = {
  fullName: '',
  profilePicture: '',
  email: '',
  phone: '',
  gender: '',
  dateOfBirth: undefined,
  membershipLevel: MembershipLevel.Standard,
  country: '',
  city: '',
  address: '',
  cv: '',
  language: [],
  skills: [],
  education: [],
  experience: [],
  status: MemberStatus.Active,
  applications: [],
  interests: [],
  createdAt: new Date(),
};

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Japan',
  'China',
  'India',
  'Brazil',
  'Mexico',
  // Add more countries as needed
];

const CITIES: Record<string, string[]> = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Newcastle', 'Sheffield', 'Bristol', 'Edinburgh'],
  // Add more cities for other countries
};

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Chinese',
  'Japanese',
  'Arabic',
  'Hindi',
  'Korean',
  'Dutch',
  'Swedish',
  'Turkish',
  // Add more languages as needed
];

// Add this constant with the skills list after the LANGUAGES array
const SKILLS = [
  'JavaScript',
  'React',
  'TypeScript',
  'Node.js',
  'HTML/CSS',
  'Angular',
  'Vue.js',
  'Python',
  'Java',
  'C#',
  'PHP',
  'Ruby',
  'SQL',
  'NoSQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'Git',
  'UI/UX Design',
  'Project Management',
  'Agile/Scrum',
  'DevOps',
  'Data Analysis',
  'Machine Learning',
  'Mobile Development',
];

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(2);
  const [member, setMember] = useState<Partial<Member>>(defaultMember);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    institution: '',
    qualification: EducationLevel.Bachelor,
    program: '',
    startDate: new Date(),
    current: false,
  });
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    title: '',
    company: '',
    startDate: new Date(),
    current: false,
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleChange = (field: keyof Member, value: any) => {
    setMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof Member, value: any[]) => {
    setMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    onComplete(member);
    onClose();
  };

  const addEducation = () => {
    if (!newEducation.institution || !newEducation.program) return;
    
    const education = {
      id: `edu-${Date.now()}`,
      ...newEducation,
      endDate: newEducation.current ? new Date() : (newEducation.endDate || new Date()),
    } as Education;
    
    handleArrayChange('education', [...(member.education || []), education]);
    
    // Reset form
    setNewEducation({
      institution: '',
      qualification: EducationLevel.Bachelor,
      program: '',
      startDate: new Date(),
      current: false,
    });
  };

  const removeEducation = (id: string) => {
    handleArrayChange('education', (member.education || []).filter(edu => edu.id !== id));
  };

  const addExperience = () => {
    if (!newExperience.company || !newExperience.title) return;
    
    const experience = {
      id: `exp-${Date.now()}`,
      ...newExperience,
      endDate: newExperience.current ? new Date() : (newExperience.endDate || new Date()),
    } as Experience;
    
    handleArrayChange('experience', [...(member.experience || []), experience]);
    
    // Reset form
    setNewExperience({
      title: '',
      company: '',
      startDate: new Date(),
      current: false,
    });
  };

  const removeExperience = (id: string) => {
    handleArrayChange('experience', (member.experience || []).filter(exp => exp.id !== id));
  };

  const handleFileUpload = (field: 'profilePicture' | 'cv', file: File) => {
    // In a real app, you would upload the file to storage
    // and then set the URL to the member state
    // For this demo, we'll just set a placeholder value
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleChange(field, reader.result);
      }
    };
    
    reader.readAsDataURL(file);
  };

  // --- Step Components ---
  const renderStep = () => {
    switch (step) {
      case 0: // Profile
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input 
                  label="Full Name" 
                  value={member.fullName || ''} 
                  onChange={(e) => handleChange('fullName', e.target.value)} 
                  required 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Input 
                  label="Email" 
                  value={member.email || ''} 
                  onChange={(e) => handleChange('email', e.target.value)} 
                  required 
                  type="email" 
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Input 
                  label="Phone" 
                  value={member.phone || ''} 
                  onChange={(e) => handleChange('phone', e.target.value)} 
                  required 
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                  value={member.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value as Gender)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Input
                  label="Date of Birth"
                  type="date"
                  value={member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleChange('dateOfBirth', new Date(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                  value={member.country || ''}
                  onChange={(e) => {
                    handleChange('country', e.target.value);
                    handleChange('city', ''); // Reset city when country changes
                  }}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                  value={member.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  disabled={!member.country}
                >
                  <option value="">Select city</option>
                  {member.country && CITIES[member.country]?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <Input 
                  label="Address" 
                  value={member.address || ''} 
                  onChange={(e) => handleChange('address', e.target.value)} 
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                <div className="relative">
                  <select
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                    value=""
                    onChange={(e) => {
                      const newLanguage = e.target.value;
                      if (newLanguage && !member.language?.includes(newLanguage)) {
                        handleArrayChange('language', [...(member.language || []), newLanguage]);
                      }
                    }}
                  >
                    <option value="">Select a language</option>
                    {LANGUAGES.filter(lang => !member.language?.includes(lang)).map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>
                {member.language && member.language.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.language.map((lang) => (
                      <span 
                        key={lang} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => handleArrayChange('language', member.language?.filter(l => l !== lang) || [])}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 1: // Education
        return (
          <div className="space-y-6">
            {/* List of existing education entries */}
            {member.education && member.education.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Education History</h4>
                  <span className="text-sm text-gray-500">{member.education.length} entries</span>
                </div>
                <div className="grid gap-4">
                  {member.education.map((edu) => (
                    <div 
                      key={edu.id} 
                      className="bg-white border border-gray-200 rounded-lg p-4 relative hover:border-primary-200 transition-colors"
                    >
                      <button 
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                          <GraduationCap className="text-primary-600" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="text-base font-medium text-gray-900 truncate">
                              {edu.qualification} in {edu.program}
                            </h5>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {edu.qualification}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Calendar size={14} />
                            <span>
                              {new Date(edu.startDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short'})} - 
                              {edu.current ? ' Present' : edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short'}) : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Form to add new education */}
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <Plus size={20} className="text-primary-600" />
                <h4 className="text-lg font-medium text-gray-900">Add Education</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input 
                    label="Institution" 
                    value={newEducation.institution} 
                    onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                    placeholder="University of California, Berkeley"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <select
                    value={newEducation.qualification}
                    onChange={(e) => setNewEducation({...newEducation, qualification: e.target.value as EducationLevel})}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {Object.values(EducationLevel).map((level) => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Input 
                    label="Program" 
                    value={newEducation.program} 
                    onChange={(e) => setNewEducation({...newEducation, program: e.target.value})}
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <Input 
                    label="Start Date" 
                    type="date"
                    value={newEducation.startDate ? new Date(newEducation.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewEducation({...newEducation, startDate: new Date(e.target.value)})}
                  />
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Input 
                      label="End Date" 
                      type="date"
                      disabled={newEducation.current}
                      value={!newEducation.current && newEducation.endDate ? new Date(newEducation.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewEducation({...newEducation, endDate: new Date(e.target.value)})}
                    />
                  </div>
                  <div className="mb-2 flex items-center">
                    <input 
                      type="checkbox" 
                      id="current-education" 
                      checked={newEducation.current}
                      onChange={(e) => setNewEducation({...newEducation, current: e.target.checked})}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <label htmlFor="current-education" className="ml-2 text-sm text-gray-700">
                      Current
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  type="button" 
                  onClick={addEducation}
                  variant="primary"
                  rightIcon={<Plus size={16} />}
                  disabled={!newEducation.institution || !newEducation.program}
                >
                  Add Education
                </Button>
              </div>
            </div>
          </div>
        );
      case 2: // Experience
        return (
          <div className="space-y-6">            
            {/* List of existing experience entries */}
            {member.experience && member.experience.length > 0 && (
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-800">Added Experience</h4>
                {member.experience.map((exp) => (
                  <div key={exp.id} className="border border-gray-200 rounded-lg p-4 relative">
                    <button 
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                    <div className="font-medium">{exp.title}</div>
                    <div className="text-gray-700">{exp.company}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(exp.startDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short'})} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short'}) : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Form to add new experience */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4">Add Experience</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input 
                    label="Job Title" 
                    value={newExperience.title} 
                    onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                    placeholder="Senior Frontend Developer"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input 
                    label="Company" 
                    value={newExperience.company} 
                    onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <Input 
                    label="Start Date" 
                    type="date"
                    value={newExperience.startDate ? new Date(newExperience.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewExperience({...newExperience, startDate: new Date(e.target.value)})}
                  />
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Input 
                      label="End Date" 
                      type="date"
                      disabled={newExperience.current}
                      value={!newExperience.current && newExperience.endDate ? new Date(newExperience.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewExperience({...newExperience, endDate: new Date(e.target.value)})}
                    />
                  </div>
                  <div className="mb-2 flex items-center">
                    <input 
                      type="checkbox" 
                      id="current-job" 
                      checked={newExperience.current}
                      onChange={(e) => setNewExperience({...newExperience, current: e.target.checked})}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <label htmlFor="current-job" className="ml-2 text-sm text-gray-700">
                      Current Job
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  type="button" 
                  onClick={addExperience}
                  variant="secondary"
                  rightIcon={<Plus size={16} />}
                  disabled={!newExperience.company || !newExperience.title}
                >
                  Add Experience
                </Button>
              </div>
            </div>
          </div>
        );
      case 3: // File Uploads
        return (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border border-gray-200">
                  {member.profilePicture ? (
                    <img 
                      src={member.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="text-gray-400" size={40} />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={profilePictureInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload('profilePicture', e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => profilePictureInputRef.current?.click()}
                    rightIcon={<Upload size={16} />}
                  >
                    {member.profilePicture ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {member.profilePicture && (
                    <button
                      type="button"
                      onClick={() => handleChange('profilePicture', '')}
                      className="ml-3 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resume/CV</h3>
              <div className="border border-gray-200 bg-white rounded-lg p-4">
                {member.cv ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="text-primary-500 mr-3" />
                      <span className="text-gray-700">Resume uploaded</span>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleChange('cv', '')}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="cv-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500"
                      >
                        <span>Upload your CV</span>
                        <input
                          id="cv-upload"
                          name="cv-upload"
                          type="file"
                          className="sr-only"
                          ref={cvInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload('cv', e.target.files[0]);
                            }
                          }}
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills and Expertise</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select your skills</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border rounded-md bg-white">
                    {SKILLS.map((skill) => (
                      <div key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`skill-${skill}`}
                          checked={member.skills?.includes(skill) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleArrayChange('skills', [...(member.skills || []), skill]);
                            } else {
                              handleArrayChange('skills', (member.skills || []).filter(s => s !== skill));
                            }
                          }}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor={`skill-${skill}`} className="ml-2 text-sm text-gray-700">
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {member.skills && member.skills.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selected skills</label>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleArrayChange('skills', member.skills?.filter(s => s !== skill) || [])}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 4: // Payment
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-100 mb-4">
                <CreditCard className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Complete Your Registration</h3>
              <p className="text-gray-500 mt-2">One-time access fee to unlock all features</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">Payment Summary</h4>
              </div>
              
              <div className="px-6 py-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Registration Fee</span>
                  <span className="font-medium">₦10,000</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">VAT (7.5%)</span>
                  <span className="font-medium">₦750</span>
                </div>
                <div className="flex justify-between py-3 font-medium text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">₦10,750</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">Payment Method</h4>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="relative border border-primary-200 bg-primary-50 rounded-lg p-4 flex items-start">
                    <input
                      type="radio"
                      id="payment-method-card"
                      name="payment-method"
                      className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500 mt-1"
                      checked
                      readOnly
                    />
                    <label htmlFor="payment-method-card" className="ml-3 flex-1">
                      <span className="block text-sm font-medium text-gray-900">Credit/Debit Card</span>
                      <span className="block text-sm text-gray-500 mt-1">Pay securely with your card</span>
                      <div className="mt-3 flex space-x-2">
                        <div className="h-8 w-12 rounded border border-gray-200 bg-white flex items-center justify-center">
                          <img src="https://www.svgrepo.com/show/328132/visa.svg" alt="Visa" className="h-4" />
                        </div>
                        <div className="h-8 w-12 rounded border border-gray-200 bg-white flex items-center justify-center">
                          <img src="https://www.svgrepo.com/show/328121/mastercard.svg" alt="Mastercard" className="h-4" />
                        </div>
                        <div className="h-8 w-12 rounded border border-gray-200 bg-white flex items-center justify-center">
                          <img src="https://www.svgrepo.com/show/472981/verve.svg" alt="Verve" className="h-4" />
                        </div>
                      </div>
                    </label>
                    <div className="absolute top-4 right-4">
                      <Check className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Secure Payment</h4>
                  <p className="text-sm text-gray-500">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">You're almost done!</h4>
              <p className="text-green-700 text-sm mt-1">Click "Complete Payment" to process your payment and gain access to all features.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-900">{steps[step].label}</h2>
            <span className="text-sm text-gray-500">Step {step + 1} of {steps.length}</span>
          </div>
          
          <div className="flex items-center w-full">
            {steps.map((stepItem, i) => (
              <React.Fragment key={stepItem.id}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium
                    ${i < step ? 'bg-primary-600 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {i < step ? '✓' : <stepItem.icon size={16} />}
                  </div>
                  <span className={`text-xs mt-1 ${i === step ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>{stepItem.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-1 flex-grow mx-1 ${i < step ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (step === steps.length - 1) handleComplete();
            else nextStep();
          }}
          className="space-y-6 overflow-y-auto flex-1"
        >
          {renderStep()}
          <div className="flex justify-between mt-8 sticky bottom-0 bg-white pt-4 border-t">
            <Button type="button" onClick={prevStep} disabled={step === 0} variant="secondary">Back</Button>
            {step === steps.length - 1 ? (
              <Button type="submit" variant="primary">Complete Payment</Button>
            ) : (
              <Button type="submit" variant="primary">Next</Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProfileSetupModal;
