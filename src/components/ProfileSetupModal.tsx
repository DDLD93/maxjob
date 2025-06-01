import React, { useState, useRef } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { Member, MembershipLevel, EducationLevel, MemberStatus, Education, Experience } from '../types';
import { User, Briefcase, FileText, GraduationCap, Calendar, Upload, X, Plus, CreditCard, Check, Lock } from 'lucide-react';

const steps = [
  { id: 'profile', label: 'Personal Info', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'uploads', label: 'Documents & Skills', icon: FileText },
  { id: 'payment', label: 'Membership', icon: CreditCard },
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
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt',
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
];

const CITIES: Record<string, string[]> = {
  'Nigeria': ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt'],
  'Ghana': ['Accra', 'Kumasi', 'Tamale', 'Takoradi'],
  'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
  'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne'],
};

const LANGUAGES = [
  'English', 'Hausa', 'Yoruba', 'Igbo', 'Swahili', 'French', 'Arabic', 'Portuguese', 'Zulu', 'Afrikaans',
];

// Add this constant with the skills list after the LANGUAGES array
const SKILLS = [
  'Customer Service', 'Project Management', 'Digital Marketing', 'Sales', 'Software Development',
  'Data Analysis', 'Graphic Design', 'Content Creation', 'Financial Analysis', 'Human Resources',
  'Nursing', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Legal Practice',
  'Teaching', 'Research', 'Supply Chain Management', 'Logistics', 'Quality Assurance',
  'React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS', 'Azure', 'Google Cloud',
];

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [member, setMember] = useState<Partial<Member>>(defaultMember);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    institution: '', qualification: EducationLevel.Bachelor, program: '', startDate: new Date(), current: false,
  });
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    title: '', company: '', startDate: new Date(), current: false,
  });

  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const nextStep = () => setCurrentStepIndex((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStepIndex((s) => Math.max(s - 1, 0));

  const handleChange = (field: keyof Member, value: any) => {
    setMember((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handleArrayChange = (field: keyof Member, value: any[]) => {
    setMember((prev) => ({ ...prev, [field]: value }));
  };
  
  const validateStep = (): boolean => {
    const currentStepId = steps[currentStepIndex].id;
    const newErrors: Record<string, string> = {};

    if (currentStepId === 'profile') {
      if (!member.fullName?.trim()) newErrors.fullName = 'Full name is required.';
      if (!member.email?.trim()) newErrors.email = 'Email is required.';
      // else if (!/S+@S+\.\S+/.test(member.email)) newErrors.email = 'Email is invalid.';
      if (!member.phone?.trim()) newErrors.phone = 'Phone number is required.';
      if (!member.country) newErrors.country = 'Country is required.';
      if (!member.city) newErrors.city = 'City is required.';
    }
    // Add more validation for other steps if needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  const handleComplete = () => {
    if (validateStep()) {
      onComplete(member);
      onClose();
    }
  };

  const addEducation = () => {
    if (!newEducation.institution || !newEducation.program) return;
    const education = { id: `edu-${Date.now()}`, ...newEducation, endDate: newEducation.current ? undefined : (newEducation.endDate || new Date()) } as Education;
    handleArrayChange('education', [...(member.education || []), education]);
    setNewEducation({ institution: '', qualification: EducationLevel.Bachelor, program: '', startDate: new Date(),endDate: undefined, current: false });
  };

  const removeEducation = (id: string) => {
    handleArrayChange('education', (member.education || []).filter(edu => edu.id !== id));
  };

  const addExperience = () => {
    if (!newExperience.company || !newExperience.title) return;
    const experience = { id: `exp-${Date.now()}`, ...newExperience, endDate: newExperience.current ? undefined : (newExperience.endDate || new Date()) } as Experience;
    handleArrayChange('experience', [...(member.experience || []), experience]);
    setNewExperience({ title: '', company: '', startDate: new Date(), endDate: undefined, current: false });
  };

  const removeExperience = (id: string) => {
    handleArrayChange('experience', (member.experience || []).filter(exp => exp.id !== id));
  };

  const handleFileUpload = (field: 'profilePicture' | 'cv', file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleChange(field, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const renderError = (field: string) => errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

  // --- Step Components ---
  const renderStepContent = () => {
    switch (steps[currentStepIndex].id) {
      case 'profile':
        return (
          <div className="w-full max-w-none">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <Input 
                      label="Full Name" 
                      value={member.fullName || ''} 
                      onChange={(e) => handleChange('fullName', e.target.value)} 
                      required 
                      placeholder="e.g. Aisha Bello" 
                      error={errors.fullName}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input 
                        label="Email Address" 
                        value={member.email || ''} 
                        onChange={(e) => handleChange('email', e.target.value)} 
                        required 
                        type="email" 
                        placeholder="e.g. aisha@example.com" 
                        error={errors.email} 
                      />
                    </div>
                    <div>
                      <Input 
                        label="Phone Number" 
                        value={member.phone || ''} 
                        onChange={(e) => handleChange('phone', e.target.value)} 
                        required 
                        placeholder="e.g. +234 800 000 0000" 
                        error={errors.phone} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900" 
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
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Location Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <select 
                        className={`w-full border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900`} 
                        value={member.country || ''} 
                        onChange={(e) => { handleChange('country', e.target.value); handleChange('city', ''); }}
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      {renderError('country')}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <select 
                        className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900`} 
                        value={member.city || ''} 
                        onChange={(e) => handleChange('city', e.target.value)} 
                        disabled={!member.country}
                      >
                        <option value="">Select city</option>
                        {member.country && CITIES[member.country]?.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {renderError('city')}
                    </div>
                    <div className="sm:col-span-2">
                      <Input 
                        label="Address (Optional)" 
                        value={member.address || ''} 
                        onChange={(e) => handleChange('address', e.target.value)} 
                        placeholder="e.g. 123 Main Street, Ikeja" 
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Languages (Optional)</h3>
                  <div className="space-y-3">
                    <select 
                      className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900" 
                      value="" 
                      onChange={(e) => { 
                        const newLanguage = e.target.value; 
                        if (newLanguage && !member.language?.includes(newLanguage)) { 
                          handleArrayChange('language', [...(member.language || []), newLanguage]); 
                        }
                      }}
                    >
                      <option value="">Add a language</option>
                      {LANGUAGES.filter(lang => !member.language?.includes(lang)).map((language) => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                    {member.language && member.language.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {member.language.map((lang) => (
                          <span key={lang} className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 border border-primary-200">
                            {lang}
                            <button 
                              type="button" 
                              onClick={() => handleArrayChange('language', member.language?.filter(l => l !== lang) || [])} 
                              className="ml-1.5 text-primary-600 hover:text-primary-800 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-6">
            {member.education && member.education.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Education History</h4>
                  <span className="text-sm text-gray-500">{member.education.length} {member.education.length === 1 ? 'entry' : 'entries'}</span>
                </div>
                <div className="grid gap-4">
                  {member.education.map((edu) => (
                    <div key={edu.id} className="bg-white border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition-shadow">
                      <button type="button" onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                          <GraduationCap className="text-primary-600" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-semibold text-gray-800 truncate">{edu.qualification} in {edu.program}</h5>
                          <p className="text-sm text-gray-600 mt-0.5">{edu.institution}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                            <Calendar size={14} />
                            <span>{new Date(edu.startDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short'})} - {edu.current ? 'Present' : edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short'}) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Plus size={20} className="text-primary-600" />
                <h4 className="text-lg font-medium text-gray-900">Add New Education</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                  <Input label="Institution" value={newEducation.institution || ''} onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})} placeholder="e.g. University of Lagos" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <select value={newEducation.qualification} onChange={(e) => setNewEducation({...newEducation, qualification: e.target.value as EducationLevel})} className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-primary-500 focus:border-primary-500">
                    {Object.values(EducationLevel).map((level) => (<option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>))}
                  </select>
                </div>
                <div>
                  <Input label="Program/Course of Study" value={newEducation.program || ''} onChange={(e) => setNewEducation({...newEducation, program: e.target.value})} placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <Input label="Start Date" type="date" value={newEducation.startDate ? new Date(newEducation.startDate).toISOString().split('T')[0] : ''} onChange={(e) => setNewEducation({...newEducation, startDate: new Date(e.target.value)})} />
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Input label="End Date" type="date" disabled={newEducation.current} value={!newEducation.current && newEducation.endDate ? new Date(newEducation.endDate).toISOString().split('T')[0] : ''} onChange={(e) => setNewEducation({...newEducation, endDate: new Date(e.target.value)})} />
                  </div>
                  <div className="mb-2.5 flex items-center">
                    <input type="checkbox" id="current-education" checked={!!newEducation.current} onChange={(e) => setNewEducation({...newEducation, current: e.target.checked, endDate: e.target.checked ? undefined : newEducation.endDate})} className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                    <label htmlFor="current-education" className="ml-2 text-sm text-gray-700">Current</label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="button" onClick={addEducation} variant="primary" rightIcon={<Plus size={16} />} disabled={!newEducation.institution || !newEducation.program}>Add Education</Button>
              </div>
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-6">
            {member.experience && member.experience.length > 0 && (
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Work Experience</h4>
                  <span className="text-sm text-gray-500">{member.experience.length} {member.experience.length === 1 ? 'entry' : 'entries'}</span>
                </div>
                <div className="grid gap-4">
                  {member.experience.map((exp) => (
                    <div key={exp.id} className="bg-white border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition-shadow">
                       <button type="button" onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-50 flex items-center justify-center">
                          <Briefcase className="text-secondary-600" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h5 className="text-base font-semibold text-gray-800 truncate">{exp.title}</h5>
                           <p className="text-sm text-gray-600 mt-0.5">{exp.company}</p>
                           <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                            <Calendar size={14} />
                            <span>{new Date(exp.startDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short'})} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short'}) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Plus size={20} className="text-primary-600" />
                <h4 className="text-lg font-medium text-gray-900">Add New Experience</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                  <Input label="Job Title" value={newExperience.title || ''} onChange={(e) => setNewExperience({...newExperience, title: e.target.value})} placeholder="e.g. Senior Software Engineer" />
                </div>
                <div className="md:col-span-2">
                  <Input label="Company" value={newExperience.company || ''} onChange={(e) => setNewExperience({...newExperience, company: e.target.value})} placeholder="e.g. Tech Solutions Ltd." />
                </div>
                <div>
                  <Input label="Start Date" type="date" value={newExperience.startDate ? new Date(newExperience.startDate).toISOString().split('T')[0] : ''} onChange={(e) => setNewExperience({...newExperience, startDate: new Date(e.target.value)})} />
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Input label="End Date" type="date" disabled={newExperience.current} value={!newExperience.current && newExperience.endDate ? new Date(newExperience.endDate).toISOString().split('T')[0] : ''} onChange={(e) => setNewExperience({...newExperience, endDate: new Date(e.target.value)})} />
                  </div>
                  <div className="mb-2.5 flex items-center">
                    <input type="checkbox" id="current-job" checked={!!newExperience.current} onChange={(e) => setNewExperience({...newExperience, current: e.target.checked, endDate: e.target.checked ? undefined : newExperience.endDate})} className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                    <label htmlFor="current-job" className="ml-2 text-sm text-gray-700">Current Job</label>
                  </div>
                </div>
                 <div className="md:col-span-2">
                  <label htmlFor="experience-description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    id="experience-description"
                    rows={3}
                    value={newExperience.description || ''}
                    onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                    placeholder="Briefly describe your responsibilities and achievements..."
                    className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="button" onClick={addExperience} variant="primary" rightIcon={<Plus size={16} />} disabled={!newExperience.company || !newExperience.title}>Add Experience</Button>
              </div>
            </div>
          </div>
        );
      case 'uploads':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile Picture</h3>
              <p className="text-sm text-gray-500 mb-4">A professional photo helps you stand out.</p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-28 h-28 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-200 shadow-inner">
                  {member.profilePicture ? (<img src={member.profilePicture} alt="Profile" className="w-full h-full object-cover" />) : (<User className="text-gray-400" size={48} />)}
                </div>
                <div className="flex-grow">
                  <input type="file" ref={profilePictureInputRef} onChange={(e) => { if (e.target.files && e.target.files[0]) { handleFileUpload('profilePicture', e.target.files[0]); }}} accept="image/*" className="hidden" />
                  <Button type="button" variant="outline" onClick={() => profilePictureInputRef.current?.click()} rightIcon={<Upload size={16} />} className="w-full sm:w-auto">
                    {member.profilePicture ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {member.profilePicture && (<button type="button" onClick={() => handleChange('profilePicture', '')} className="mt-2 sm:mt-0 sm:ml-3 text-sm text-red-600 hover:text-red-700 transition-colors">Remove</button>)}
                  <p className="text-xs text-gray-500 mt-2">Recommended: JPG, PNG, or GIF, max 2MB.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Resume/CV</h3>
              <p className="text-sm text-gray-500 mb-4">Upload your latest resume or CV. (PDF, DOC, DOCX, max 5MB)</p>
              <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input id="cv-upload" name="cv-upload" type="file" className="sr-only" ref={cvInputRef} onChange={(e) => { if (e.target.files && e.target.files[0]) { handleFileUpload('cv', e.target.files[0]); }}} accept=".pdf,.doc,.docx" />
                {member.cv ? (
                  <div className="flex flex-col items-center">
                    <FileText className="text-primary-500 h-10 w-10" />
                    <p className="text-gray-700 mt-2 font-medium">CV Uploaded</p>
                    <p className="text-xs text-gray-500">(File: { (member.cv as string)?.substring(0,30) + '...' }) {/* Truncate for display */}</p>
                     <div className="mt-3 space-x-3">
                        <Button type="button" variant="outline" size="sm" onClick={() => cvInputRef.current?.click()} rightIcon={<Upload size={14}/>}>Change CV</Button>
                        <Button type="button" variant="danger" size="sm" onClick={() => handleChange('cv', '')}>Remove</Button> 
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <label htmlFor="cv-upload" className="mt-2 block text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer">
                      Click to upload your CV
                    </label>
                    <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Skills & Expertise</h3>
              <p className="text-sm text-gray-500 mb-4">Highlight your key skills to attract employers.</p>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Select your skills (max 10)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-3 border rounded-md bg-gray-50">
                  {SKILLS.map((skill) => (
                    <div key={skill} className="flex items-center">
                      <input type="checkbox" id={`skill-${skill}`} checked={member.skills?.includes(skill) || false} onChange={(e) => {
                        const currentSkills = member.skills || [];
                        if (e.target.checked) {
                          if (currentSkills.length < 10) handleArrayChange('skills', [...currentSkills, skill]);
                        } else {
                          handleArrayChange('skills', currentSkills.filter(s => s !== skill));
                        }
                      }} disabled={(member.skills?.length || 0) >= 10 && !member.skills?.includes(skill)} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50" />
                      <label htmlFor={`skill-${skill}`} className="ml-2 text-sm text-gray-700 truncate cursor-pointer">{skill}</label>
                    </div>
                  ))}
                </div>
                {member.skills && member.skills.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your skills ({member.skills.length}/10)</label>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 shadow-sm">
                          {skill}
                          <button type="button" onClick={() => handleArrayChange('skills', member.skills?.filter(s => s !== skill) || [])} className="ml-1.5 text-primary-600 hover:text-primary-700">
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
      case 'payment':
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Unlock Your Potential</h3>
              <p className="text-gray-600 mt-2 text-md">A one-time membership fee gives you full access to MaxJob Africa.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800">Membership Summary</h4>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>MaxJob Africa Standard Membership</span>
                  <span className="font-medium text-gray-800">₦10,000</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>VAT (7.5%)</span>
                  <span className="font-medium text-gray-800">₦750</span>
                </div>
                <hr className="my-2 border-gray-200"/>
                <div className="flex justify-between text-lg font-bold text-primary-700">
                  <span>Total Amount Due</span>
                  <span>₦10,750</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800">Secure Payment Method</h4>
              </div>
              <div className="px-6 py-5">
                <div className="relative border-2 border-primary-500 bg-primary-50 rounded-lg p-5 flex items-start shadow-inner">
                  <input type="radio" id="payment-method-card" name="payment-method" className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500 mt-1" checked readOnly />
                  <label htmlFor="payment-method-card" className="ml-3 flex-1">
                    <span className="block text-md font-semibold text-primary-700">Credit/Debit Card</span>
                    <span className="block text-sm text-gray-600 mt-1">Pay securely with Visa, Mastercard, Verve.</span>
                    <div className="mt-3 flex space-x-3">
                      <img src="https://www.svgrepo.com/show/328132/visa.svg" alt="Visa" className="h-6" />
                      <img src="https://www.svgrepo.com/show/328121/mastercard.svg" alt="Mastercard" className="h-6" />
                      <img src="https://www.svgrepo.com/show/472981/verve.svg" alt="Verve" className="h-6" />
                    </div>
                  </label>
                  <Check className="h-6 w-6 text-primary-600 absolute top-4 right-4" />
                </div>
                 <p className="text-xs text-gray-500 mt-4 text-center">
                  <Lock className="inline h-3 w-3 mr-1" /> Your payment is processed securely by Paystack.
                </p>
              </div>
            </div>
            <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200 text-center shadow">
              <h4 className="text-lg font-semibold text-green-800">You\'re All Set!</h4>
              <p className="text-green-700 text-sm mt-1">Click "Complete & Pay" to activate your MaxJob Africa membership.</p>
            </div>
          </div>
        );
      default: return null;
    }
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" className="mx-2 sm:mx-4"> 
      <div className="flex flex-col h-[90vh] max-h-[700px] bg-white overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight truncate">
                {steps[currentStepIndex].label}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                Complete your profile to unlock opportunities
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm border whitespace-nowrap">
                {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
          </div>
          
          {/* Progress Steps - Desktop */}
          <div className="hidden lg:flex items-center mt-4 space-x-1 overflow-x-auto">
            {steps.map((stepItem, i) => (
              <React.Fragment key={stepItem.id}>
                <div 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer group flex-shrink-0
                              ${i === currentStepIndex ? 'bg-primary-100 shadow-sm' : 
                                i < currentStepIndex ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}`}
                  onClick={() => { if (i <= currentStepIndex) setCurrentStepIndex(i) }}
                >
                  <div className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold transition-all duration-300 flex-shrink-0
                                  ${i < currentStepIndex ? 'bg-green-500 text-white' : 
                                    i === currentStepIndex ? 'bg-primary-600 text-white' : 
                                    'bg-gray-200 text-gray-500 group-hover:bg-gray-300'}`}
                  >
                    {i < currentStepIndex ? <Check size={12} /> : <stepItem.icon size={12} />}
                  </div>
                  <span className={`text-xs font-medium transition-colors duration-300 truncate max-w-[80px]
                                  ${i === currentStepIndex ? 'text-primary-700' : 
                                    i < currentStepIndex ? 'text-green-700' : 'text-gray-600'}`}>
                    {stepItem.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 w-4 transition-all duration-500 flex-shrink-0
                                  ${i < currentStepIndex ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Progress Steps - Mobile/Tablet */}
          <div className="lg:hidden mt-3">
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {steps.map((stepItem, i) => (
                <div key={stepItem.id} className="flex flex-col items-center flex-shrink-0 min-w-0">
                  <div className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold transition-all duration-300
                                  ${i < currentStepIndex ? 'bg-green-500 text-white' : 
                                    i === currentStepIndex ? 'bg-primary-600 text-white' : 
                                    'bg-gray-200 text-gray-500'}`}
                  >
                    {i < currentStepIndex ? <Check size={10} /> : <stepItem.icon size={10} />}
                  </div>
                  <span className={`text-[10px] font-medium mt-1 text-center truncate max-w-[50px]
                                  ${i === currentStepIndex ? 'text-primary-700' : 
                                    i < currentStepIndex ? 'text-green-700' : 'text-gray-500'}`}>
                    {stepItem.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center mt-2 space-x-1">
              {steps.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500
                                        ${i <= currentStepIndex ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <form
            onSubmit={e => { e.preventDefault(); if (currentStepIndex === steps.length - 1) handleComplete(); else handleNext(); }}
            className="h-full flex flex-col"
          >
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {renderStepContent()}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
                <Button 
                  type="button" 
                  onClick={prevStep} 
                  disabled={currentStepIndex === 0} 
                  variant="outline" 
                  className="w-full sm:w-auto order-2 sm:order-1"
                  size="sm"
                >
                  Back
                </Button>
                <div className="flex flex-col sm:flex-row items-center gap-2 order-1 sm:order-2">
                  {currentStepIndex < steps.length - 1 && (
                    <span className="text-[10px] text-gray-500 text-center sm:text-right truncate">
                      Next: {steps[currentStepIndex + 1]?.label}
                    </span>
                  )}
                  {currentStepIndex === steps.length - 1 ? (
                    <Button 
                      type="submit" 
                      variant="primary" 
                      onClick={handleComplete} 
                      className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                      size="sm"
                    >
                      Complete & Pay ₦10,750
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      variant="primary" 
                      onClick={handleNext} 
                      className="w-full sm:w-auto"
                      size="sm"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileSetupModal;
