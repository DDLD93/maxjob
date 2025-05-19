import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { MapPin, Mail, Phone, Calendar, Edit, Plus, X, CreditCard, Bell, User, Briefcase, GraduationCap } from 'lucide-react';
import { Member, MembershipLevel, EducationLevel, MemberStatus, PaymentMethodType } from '../types';
import { mockMembers } from '../data/mockData';

// Default logged in user is the first member
const currentMember = mockMembers[0];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [user, setUser] = useState<Member>({
    ...currentMember,
    // Add missing fields for the UI that aren't in mockMembers
    title: 'Professional Nurse', // Assume title based on skills
    about: `Experienced healthcare professional specializing in nursing with expertise in patient care. Proficient in ${currentMember.skills.join(', ')}.`,
    // Dummy education data since mockMembers has empty array
    education: currentMember.education.length > 0 ? currentMember.education : [
      {
        id: 'e1',
        qualification: EducationLevel.Bachelor,
        institution: 'University of Kano',
        program: 'Nursing',
        startDate: new Date('2010-09-01'),
        endDate: new Date('2014-06-30'),
        current: false
      }
    ],
    // Dummy experience data since mockMembers has empty array
    experience: currentMember.experience.length > 0 ? currentMember.experience : [
      {
        id: 'ex1',
        title: 'Registered Nurse',
        company: 'Kano General Hospital',
        location: 'Kano, Nigeria',
        startDate: new Date('2015-01-01'),
        endDate: new Date(), 
        current: true,
        description: 'Provide direct patient care and monitor patient condition. Administer medications and treatments as prescribed.'
      }
    ],
    // Add billing info for UI
    billing: {
      plan: `${currentMember.membershipLevel} Monthly`,
      nextBillingDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toLocaleDateString(),
      amount: currentMember.membershipLevel === MembershipLevel.Gold ? '$29.00' : '$19.00',
      paymentMethod: 'Visa ending in 3456', 
      paymentMethodDetails: {
        cardBrand: 'VISA',
        expiryDate: '12/2027'
      },
      invoices: [
        { id: 'INV-001', date: '2023-04-15', amount: '$29.00', status: 'Paid' },
        { id: 'INV-002', date: '2023-03-15', amount: '$29.00', status: 'Paid' },
      ]
    },
    // Notifications settings
    notifications: [
      { id: 1, title: 'New Job Postings', description: 'Get notified about jobs matching your profile.', enabled: true },
      { id: 2, title: 'Application Updates', description: 'Receive updates on your job applications.', enabled: true },
      { id: 3, title: 'Promotional Emails', description: 'Get news, offers, and promotions from us.', enabled: false },
    ],
  });

  // Function to generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() && !user.skills.includes(newSkill.trim())) {
      setUser({
        ...user,
        skills: [...user.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setUser({
      ...user,
      skills: user.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const toggleNotification = (id: number) => {
    setUser(prevUser => ({
      ...prevUser,
      notifications: prevUser.notifications.map(notification =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    }));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 h-32"></div>
        
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="absolute -top-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 flex items-center justify-center">
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.fullName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-primary-600">{getInitials(user.fullName)}</span>
              )}
            </div>
            
            <div className="mt-16 sm:mt-0 sm:ml-36 flex-grow">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end">
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900">{user.fullName}</h1>
                  <p className="text-secondary-600">{user.title}</p>
                  <div className="flex items-center text-secondary-500 mt-1">
                    <MapPin size={16} className="mr-1" />
                    <span>{user.city}, {user.country}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-4 sm:mt-0 inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  <Edit size={16} className="mr-2" />
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="border-b border-gray-200 w-full justify-start">
                <TabsTrigger value="profile" className="pb-2">
                  <span className="flex items-center">
                    <User size={16} className="mr-2" />
                    Profile
                  </span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="pb-2">
                  <span className="flex items-center">
                    <CreditCard size={16} className="mr-2" />
                    Billing
                  </span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="pb-2">
                  <span className="flex items-center">
                    <Bell size={16} className="mr-2" />
                    Notifications
                  </span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4 text-secondary-800 flex items-center">
                        <User size={18} className="mr-2 text-primary-600" />
                        About
                      </h2>
                      {isEditing ? (
                        <textarea
                          value={user.about}
                          onChange={(e) => setUser({...user, about: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Tell us a bit about yourself..."
                        />
                      ) : (
                        <p className="text-secondary-700 whitespace-pre-line">{user.about || 'No information provided.'}</p>
                      )}
                    </div>
                    
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-secondary-800 flex items-center">
                          <Briefcase size={18} className="mr-2 text-primary-600" />
                          Experience
                        </h2>
                        {isEditing && (
                          <button className="text-primary-600 hover:text-primary-800 flex items-center">
                            <Plus size={16} className="mr-1" /> Add
                          </button>
                        )}
                      </div>
                      <div className="space-y-6">
                        {user.experience.map((exp) => (
                          <div key={exp.id} className="border-l-2 border-primary-100 pl-4 hover:border-l-primary-500 transition-colors duration-200">
                            <div className="flex justify-between">
                              <h3 className="font-semibold text-secondary-800">{exp.title}</h3>
                              {isEditing && (
                                <button className="text-secondary-400 hover:text-secondary-600">
                                  <Edit size={14} />
                                </button>
                              )}
                            </div>
                            <p className="text-secondary-600">{exp.company}</p>
                            <div className="flex items-center text-secondary-500 text-sm mt-1">
                              <Calendar size={14} className="mr-1" />
                              <span>
                                {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                              </span>
                            </div>
                            <p className="text-secondary-700 mt-2 whitespace-pre-line">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-secondary-800 flex items-center">
                          <GraduationCap size={18} className="mr-2 text-primary-600" />
                          Education
                        </h2>
                        {isEditing && (
                          <button className="text-primary-600 hover:text-primary-800 flex items-center">
                            <Plus size={16} className="mr-1" /> Add
                          </button>
                        )}
                      </div>
                      <div className="space-y-6">
                        {user.education.map((edu) => (
                          <div key={edu.id} className="border-l-2 border-primary-100 pl-4 hover:border-l-primary-500 transition-colors duration-200">
                            <div className="flex justify-between">
                              <h3 className="font-semibold text-secondary-800">{edu.qualification} in {edu.program}</h3>
                              {isEditing && (
                                <button className="text-secondary-400 hover:text-secondary-600">
                                  <Edit size={14} />
                                </button>
                              )}
                            </div>
                            <p className="text-secondary-600">{edu.institution}</p>
                            <div className="flex items-center text-secondary-500 text-sm mt-1">
                              <Calendar size={14} className="mr-1" />
                              <span>
                                {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div> {/* Right column for Contact Info and Skills */}
                    <div className="bg-secondary-50 rounded-lg p-6 mb-6">
                      <h2 className="text-lg font-semibold mb-4 text-secondary-800 flex items-center">
                        <Mail size={16} className="mr-2 text-primary-600" />
                        Contact Information
                      </h2>
                      <div className="space-y-3">
                        <div className="flex">
                          <Mail size={18} className="text-secondary-400 mr-3 mt-1 flex-shrink-0" />
                          <div className="flex-grow">
                            <div className="text-sm text-secondary-500">Email</div>
                            {isEditing ? (
                              <input
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                className="border border-gray-300 rounded-lg px-3 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <div className="text-secondary-800">{user.email}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          <Phone size={18} className="text-secondary-400 mr-3 mt-1 flex-shrink-0" />
                           <div className="flex-grow">
                            <div className="text-sm text-secondary-500">Phone</div>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={user.phone}
                                onChange={(e) => setUser({...user, phone: e.target.value})}
                                className="border border-gray-300 rounded-lg px-3 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <div className="text-secondary-800">{user.phone}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          <MapPin size={18} className="text-secondary-400 mr-3 mt-1 flex-shrink-0" />
                           <div className="flex-grow">
                            <div className="text-sm text-secondary-500">Address</div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={user.address}
                                onChange={(e) => setUser({...user, address: e.target.value})}
                                className="border border-gray-300 rounded-lg px-3 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <div className="text-secondary-800">{user.address}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-secondary-50 rounded-lg p-6 mb-6">
                      <h2 className="text-lg font-semibold mb-4 text-secondary-800">Membership</h2>
                      <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-secondary-900">{user.membershipLevel} Member</span>
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                            {user.status === MemberStatus.Active ? 'Active' : user.status}
                          </span>
                        </div>
                        <p className="text-sm text-secondary-600 mt-1">Member since {formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-secondary-50 rounded-lg p-6">
                      <h2 className="text-lg font-semibold mb-4 text-secondary-800">Skills</h2>
                      {isEditing && (
                        <div className="flex mb-4">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill"
                            className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
                          />
                          <button
                            onClick={handleSkillAdd}
                            className="bg-primary-600 text-white px-3 py-2 rounded-r-lg hover:bg-primary-700 transition"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <div 
                            key={index} 
                            className={`flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm`}
                          >
                            <span>{skill}</span>
                            {isEditing && (
                              <button onClick={() => handleSkillRemove(skill)} className="ml-2 text-primary-500 hover:text-primary-700">
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-secondary-50 rounded-lg p-6 mt-6">
                      <h2 className="text-lg font-semibold mb-4 text-secondary-800">Languages</h2>
                      <div className="flex flex-wrap gap-2">
                        {user.language.map((lang, index) => (
                          <div 
                            key={index} 
                            className={`bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm`}
                          >
                            {lang}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-secondary-50 rounded-lg p-6 mt-6">
                      <h2 className="text-lg font-semibold mb-4 text-secondary-800">Interests</h2>
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest, index) => (
                          <div 
                            key={index} 
                            className={`bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm`}
                          >
                            {interest}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="billing" className="pt-6">
                <div className="space-y-8">
                  {/* Current Plan Section */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center">
                      <div>
                        <h3 className="text-xl font-semibold">Current Plan</h3>
                        <p className="text-gray-600 text-sm mt-1">You are currently on the <strong>{user.billing.plan}</strong> plan.</p>
                      </div>
                      <span className="text-2xl font-bold mt-2 sm:mt-0">{user.billing.amount}<span className="text-base font-normal text-gray-500">/month</span></span>
                    </div>
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <p className="text-gray-600 text-sm">
                          Next billing date: {user.billing.nextBillingDate}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 space-x-2 flex-shrink-0">
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm">
                          Change Plan
                        </button>
                        <button className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition text-sm">
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-semibold">Payment Method</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center mr-3">
                            {/* Dynamically show card brand if available */}
                            <span className="text-xs font-medium">{user.billing.paymentMethodDetails.cardBrand || 'CARD'}</span>
                          </div>
                          <div>
                            <p className="font-medium">{user.billing.paymentMethod}</p>
                            <p className="text-gray-500 text-sm">Expires {user.billing.paymentMethodDetails.expiryDate}</p>
                          </div>
                        </div>
                        <button className="text-primary-600 hover:text-primary-800 text-sm">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Billing History Section */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-semibold">Billing History</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 text-left text-gray-600 text-sm">
                          <tr>
                            <th className="px-6 py-3 font-medium">Invoice</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Amount</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Download</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {user.billing.invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">{invoice.id}</td>
                              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{invoice.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{invoice.amount}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                                  invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {invoice.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button className="text-primary-600 hover:text-primary-800 text-sm">
                                  PDF
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="pt-6">
                <div className="space-y-8">
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-semibold">Notification Settings</h3>
                      <p className="text-gray-600 text-sm">Manage your notification preferences.</p>
                    </div>
                    <div className="p-6 space-y-6">
                      {user.notifications.map((notification) => (
                        <div key={notification.id} className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-gray-600 text-sm">{notification.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notification.enabled}
                              onChange={() => toggleNotification(notification.id)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-semibold mb-1">Email Delivery</h3>
                      <p className="text-gray-600 text-sm">Manage how often you receive emails</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label htmlFor="email-frequency" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Frequency
                        </label>
                        <select 
                          id="email-frequency" 
                          name="email-frequency"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          // value={user.emailFrequency} // You'd need to add this to user state
                          // onChange={(e) => setUser({...user, emailFrequency: e.target.value})}
                        >
                          <option>Immediate</option>
                          <option>Daily digest</option>
                          <option>Weekly digest</option>
                          <option>Never</option>
                        </select>
                      </div>
                      <div className="flex items-center mt-4">
                        <input
                          id="marketing-emails"
                          name="marketing-emails"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          // checked={user.receiveMarketingEmails} // You'd need to add this to user state
                          // onChange={(e) => setUser({...user, receiveMarketingEmails: e.target.checked})}
                        />
                        <label htmlFor="marketing-emails" className="ml-2 block text-sm text-gray-700">
                          Receive marketing emails and special offers
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
