// Mock data for students/athletes
import type { Student } from '../types';

const firstNames = ['Alex', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Quinn', 'Blake', 'Drew', 'Sam', 'Jamie', 'Avery', 'Cameron', 'Hayden', 'Logan', 'Parker', 'Skyler', 'Reese', 'Finley', 'Emerson'];
const lastNames = ['Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill'];
const sports = ['Soccer', 'Basketball', 'Swimming', 'Tennis', 'Track & Field', 'Volleyball', 'Baseball', 'Football'];
const levels: Student['level'][] = ['beginner', 'intermediate', 'advanced', 'elite'];

export const mockStudents: Student[] = Array.from({ length: 50 }, (_, i) => ({
  id: `student-${i + 1}`,
  firstName: firstNames[i % firstNames.length],
  lastName: lastNames[i % lastNames.length],
  email: i > 15 ? `student${i + 1}@email.com` : undefined,
  dateOfBirth: new Date(Date.now() - (8 + Math.floor(Math.random() * 12)) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other',
  guardianId: `user-${Math.floor(Math.random() * 20) + 1}`,
  level: levels[i % levels.length],
  sport: sports[i % sports.length],
  status: i % 8 === 0 ? 'inactive' : 'active',
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find(student => student.id === id);
};

export const getStudentsByLevel = (level: Student['level']): Student[] => {
  return mockStudents.filter(student => student.level === level);
};

export const getStudentsBySport = (sport: string): Student[] => {
  return mockStudents.filter(student => student.sport === sport);
};
