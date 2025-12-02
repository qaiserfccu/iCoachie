// Mock data for evaluations, attendance, and achievements
import type { Evaluation, AttendanceRecord, Achievement } from '../types';
import { mockStudents } from './students';
import { mockCoaches } from './coaches';

export const mockEvaluations: Evaluation[] = Array.from({ length: 40 }, (_, i) => {
  const student = mockStudents[i % mockStudents.length];
  const coach = mockCoaches[i % mockCoaches.length];

  return {
    id: `evaluation-${i + 1}`,
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    evaluatorId: coach.id,
    evaluatorName: `${coach.firstName} ${coach.lastName}`,
    type: (['skill', 'performance', 'progress', 'behavior'] as const)[i % 4],
    scores: [
      { category: 'Technical Skills', score: 70 + Math.floor(Math.random() * 30), maxScore: 100, notes: 'Good technique' },
      { category: 'Physical Fitness', score: 60 + Math.floor(Math.random() * 40), maxScore: 100 },
      { category: 'Tactical Awareness', score: 50 + Math.floor(Math.random() * 50), maxScore: 100 },
      { category: 'Teamwork', score: 70 + Math.floor(Math.random() * 30), maxScore: 100, notes: 'Works well with others' },
    ],
    overallScore: 65 + Math.floor(Math.random() * 35),
    comments: 'Overall showing good progress. Keep up the hard work!',
    recommendations: i % 2 === 0 ? 'Focus on improving speed and agility.' : undefined,
    evaluationDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

export const mockAttendanceRecords: AttendanceRecord[] = Array.from({ length: 100 }, (_, i) => {
  const student = mockStudents[i % mockStudents.length];
  const sessionDate = new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000);
  const checkInTime = new Date(sessionDate);
  checkInTime.setHours(9 + (i % 4), Math.floor(Math.random() * 15), 0);

  return {
    id: `attendance-${i + 1}`,
    sessionId: `session-${(i % 20) + 1}`,
    sessionName: ['Morning Training', 'Afternoon Practice', 'Skills Session', 'Match Day'][i % 4],
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    status: (['present', 'absent', 'late', 'excused'] as const)[i % 4 === 0 ? 1 : i % 5 === 0 ? 2 : i % 8 === 0 ? 3 : 0],
    checkInTime: i % 4 !== 1 ? checkInTime.toISOString() : undefined,
    checkOutTime: i % 4 !== 1 ? new Date(checkInTime.getTime() + 2 * 60 * 60 * 1000).toISOString() : undefined,
    notes: i % 10 === 0 ? 'Parent notified' : undefined,
    recordedBy: `Coach ${['Mike', 'Sarah', 'David'][i % 3]}`,
    createdAt: sessionDate.toISOString(),
  };
});

export const mockAchievements: Achievement[] = Array.from({ length: 50 }, (_, i) => {
  const student = mockStudents[i % mockStudents.length];

  return {
    id: `achievement-${i + 1}`,
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    title: [
      '100% Attendance Award',
      'Most Improved Player',
      'Skill Mastery Badge',
      'Team Spirit Award',
      'Tournament Champion',
      'Personal Best Record',
      'Leadership Award',
      'Sportsmanship Award',
      'Perfect Score',
      'Training Milestone',
    ][i % 10],
    description: 'Awarded for outstanding performance and dedication.',
    type: (['badge', 'certificate', 'trophy', 'milestone'] as const)[i % 4],
    category: ['Attendance', 'Performance', 'Skills', 'Character', 'Competition'][i % 5],
    awardedBy: `Coach ${['Mike', 'Sarah', 'David', 'Emily'][i % 4]}`,
    awardedDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

export const getEvaluationsByStudent = (studentId: string): Evaluation[] => {
  return mockEvaluations.filter(e => e.studentId === studentId);
};

export const getAttendanceByStudent = (studentId: string): AttendanceRecord[] => {
  return mockAttendanceRecords.filter(a => a.studentId === studentId);
};

export const getAttendanceBySession = (sessionId: string): AttendanceRecord[] => {
  return mockAttendanceRecords.filter(a => a.sessionId === sessionId);
};

export const getAchievementsByStudent = (studentId: string): Achievement[] => {
  return mockAchievements.filter(a => a.studentId === studentId);
};

export const getRecentAchievements = (limit: number = 10): Achievement[] => {
  return [...mockAchievements]
    .sort((a, b) => new Date(b.awardedDate).getTime() - new Date(a.awardedDate).getTime())
    .slice(0, limit);
};
