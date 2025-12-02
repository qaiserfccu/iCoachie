// Mock data for medical records
import type { HealthRecord, InjuryRecord, MedicalClearance } from '../types';
import { mockStudents } from './students';

export const mockHealthRecords: HealthRecord[] = mockStudents.slice(0, 30).map((student, i) => ({
  id: `health-${i + 1}`,
  studentId: student.id,
  studentName: `${student.firstName} ${student.lastName}`,
  bloodType: (['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const)[i % 8],
  allergies: i % 3 === 0 ? ['Peanuts'] : i % 5 === 0 ? ['Penicillin', 'Latex'] : [],
  conditions: i % 4 === 0 ? ['Asthma'] : [],
  medications: i % 4 === 0 ? ['Albuterol Inhaler'] : [],
  emergencyContact: {
    name: `Parent of ${student.firstName}`,
    phone: `+1 555-${String(i + 100).padStart(3, '0')}-${String((i + 1) * 111).padStart(4, '0')}`,
    relationship: 'Parent',
  },
  lastCheckup: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  nextCheckup: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  notes: i % 5 === 0 ? 'Requires regular monitoring' : undefined,
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const mockInjuryRecords: InjuryRecord[] = Array.from({ length: 20 }, (_, i) => ({
  id: `injury-${i + 1}`,
  studentId: `student-${(i % 30) + 1}`,
  studentName: `${mockStudents[i % 30].firstName} ${mockStudents[i % 30].lastName}`,
  injuryType: ['Sprain', 'Strain', 'Bruise', 'Cut', 'Concussion', 'Fracture'][i % 6],
  description: 'Injury occurred during training session.',
  severity: (['minor', 'moderate', 'severe'] as const)[i % 3],
  location: ['Ankle', 'Knee', 'Shoulder', 'Wrist', 'Head', 'Arm'][i % 6],
  occurredAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  reportedBy: `Coach ${['Mike', 'Sarah', 'David'][i % 3]}`,
  treatment: ['Ice and rest', 'Physical therapy', 'Medical evaluation required', 'Minor first aid applied'][i % 4],
  status: (['active', 'recovered', 'ongoing-treatment'] as const)[i % 3],
  followUpDate: i % 3 !== 1 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const mockMedicalClearances: MedicalClearance[] = Array.from({ length: 40 }, (_, i) => {
  const issuedDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  const expiryDate = new Date(issuedDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const isExpired = expiryDate < new Date();

  return {
    id: `clearance-${i + 1}`,
    studentId: `student-${(i % 40) + 1}`,
    studentName: i < 40 ? `${mockStudents[i % mockStudents.length].firstName} ${mockStudents[i % mockStudents.length].lastName}` : `Student ${i + 1}`,
    type: (['participation', 'return-to-play', 'annual-physical'] as const)[i % 3],
    issuedBy: `Dr. ${['Johnson', 'Smith', 'Williams', 'Brown'][i % 4]}`,
    issuedDate: issuedDate.toISOString().split('T')[0],
    expiryDate: expiryDate.toISOString().split('T')[0],
    status: isExpired ? 'expired' : i % 10 === 0 ? 'pending' : 'valid',
    notes: i % 4 === 0 ? 'Cleared for full participation' : undefined,
    createdAt: issuedDate.toISOString(),
  };
});

export const getHealthRecordByStudent = (studentId: string): HealthRecord | undefined => {
  return mockHealthRecords.find(r => r.studentId === studentId);
};

export const getInjuriesByStudent = (studentId: string): InjuryRecord[] => {
  return mockInjuryRecords.filter(r => r.studentId === studentId);
};

export const getActiveInjuries = (): InjuryRecord[] => {
  return mockInjuryRecords.filter(r => r.status !== 'recovered');
};

export const getClearancesByStudent = (studentId: string): MedicalClearance[] => {
  return mockMedicalClearances.filter(c => c.studentId === studentId);
};

export const getExpiringClearances = (days: number = 30): MedicalClearance[] => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + days);
  return mockMedicalClearances.filter(c => 
    c.status === 'valid' && new Date(c.expiryDate) <= threshold
  );
};
