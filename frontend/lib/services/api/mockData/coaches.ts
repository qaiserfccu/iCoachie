// Mock data for coaches and staff
import type { Coach } from '../types';

const specialties = ['Soccer', 'Basketball', 'Swimming', 'Tennis', 'Track & Field', 'Volleyball', 'Strength & Conditioning', 'Youth Development'];
const qualifications = [
  ['UEFA A License', 'First Aid Certified'],
  ['USSF Coaching License', 'CPR Certified'],
  ['ASCA Level 3', 'Lifeguard Certified'],
  ['PTR Certified', 'Sports Psychology Certificate'],
  ['USATF Level 2', 'Nutrition Specialist'],
];

export const mockCoaches: Coach[] = Array.from({ length: 20 }, (_, i) => ({
  id: `coach-${i + 1}`,
  userId: `user-${i + 50}`,
  firstName: ['Michael', 'Sarah', 'David', 'Emily', 'James', 'Lisa', 'Robert', 'Amanda', 'William', 'Jessica', 'Christopher', 'Jennifer', 'Daniel', 'Michelle', 'Andrew', 'Nicole', 'Matthew', 'Stephanie', 'Joshua', 'Ashley'][i],
  lastName: ['Anderson', 'Thompson', 'Wilson', 'Martinez', 'Taylor', 'Brown', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Johnson', 'Williams', 'Jones', 'Moore', 'Martin', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis'][i],
  email: `coach${i + 1}@icoachie.com`,
  specialty: specialties[i % specialties.length],
  qualifications: qualifications[i % qualifications.length],
  experience: Math.floor(Math.random() * 15) + 2,
  rating: Number((4 + Math.random()).toFixed(1)),
  status: i % 10 === 0 ? 'inactive' : 'active',
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const getCoachById = (id: string): Coach | undefined => {
  return mockCoaches.find(coach => coach.id === id);
};

export const getCoachesBySpecialty = (specialty: string): Coach[] => {
  return mockCoaches.filter(coach => coach.specialty === specialty);
};
