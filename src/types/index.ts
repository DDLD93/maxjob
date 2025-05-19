export enum MembershipLevel {
  Standard = 'standard',
  Gold = 'gold',
}

export enum MemberStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
  Suspended = 'suspended',
}

export enum PaymentMethodType {
  Paystack = 'paystack',
  Flutterwave = 'flutterwave',
}

export enum EducationLevel {
  HighSchool = 'o-level',
  Diploma = 'diploma',
  Bachelor = 'bachelor',
  Master = 'master',
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  qualification: EducationLevel;
  institution: string;
  program: string;
  startDate: Date;
  endDate: Date;
  current: boolean;
}

export interface Member {
  id: string;
  profilePicture: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | '';
  dateOfBirth: Date;
  membershipLevel: MembershipLevel;
  country: string;
  city: string;
  address: string;
  cv: string;
  language: string[];
  skills: string[];
  education: Education[];
  experience: Experience[];
  status: MemberStatus;
  applications: Application[];
  paymentMethods: PaymentMethod[];
  interests: string[];
  createdAt: Date;
  title?: string;
  about?: string;
  billing?: BillingInfo;
  notifications?: NotificationSetting[];
}

export interface Application {
  id: string;
  jobId: string;
  memberId: string;
  status: 'applied' | 'interview' | 'rejected' | 'accepted';
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  name: string;
  lastSixDigits: string;
  authorizationCode: string;
  cardType: string;
  expiryDate: string;
  type: PaymentMethodType;
  createdAt: Date;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  description: string;
  requirements: string[];
  responsibilities: string[]
  benefits: string[]
  tags: string[]
  salaryRange: {
    min: number;
    max: number;
  };
  deadline: Date;
  locationType: 'local' | 'abroad' | 'hybrid';
  country: string;
  city: string;
  address: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  status: 'active' | 'closed' | 'draft';
  createdAt: Date;
}


export interface Seminar {
  id: string;
  title: string;
  description: string;
  locationType: 'local' | 'remote';
  country: string;
  city: string;
  address: string;
  date: Date;
  duration: number;
  capacity: number;
  registeredCount: number;
  price: number;
  isExclusive: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags?: string[];
  type?: 'webinar' | 'workshop' | 'conference' | 'meetup';
  time?: string;
  isVirtual?: boolean;
  host?: string;
  attendees?: number;
  image?: string;
  registrationUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'job' | 'application' | 'message' | 'event' | 'profile';
  read: boolean;
}

export interface NotificationSetting {
  id: number;
  title: string;
  description: string;
  enabled: boolean;
}

export interface BillingInfo {
  plan: string;
  nextBillingDate: string;
  amount: string;
  paymentMethod: string;
  paymentMethodDetails: {
    cardBrand: string;
    expiryDate: string;
  };
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}