/**
 * Medical Staff Service
 * Handles API calls for medical staff functionality
 */

import { apiClient } from '../api';

// Types
export interface MedicalStats {
  activeInjuries: number;
  checkupsToday: number;
  medicationAlerts: number;
  emergencyKitStatus: string;
}

export interface HealthRecord {
  id: number;
  patientName: string;
  recordType: string;
  date: string;
  provider: string;
  status: string;
}

export interface InjuryReport {
  id: number;
  athleteName: string;
  injuryType: string;
  date: string;
  severity: string;
  status: string;
  estimatedRecovery: string;
}

export interface FirstAidIncident {
  id: number;
  patientName: string;
  incident: string;
  treatedBy: string;
  date: string;
  time: string;
  location: string;
}

// Service class
class MedicalService {
  private readonly BASE_PATH = '/medical';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: MedicalStats }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get health records
   */
  async getHealthRecords(): Promise<{ data: HealthRecord[] }> {
    return apiClient.get(`${this.BASE_PATH}/health-records`);
  }

  /**
   * Get injury reports
   */
  async getInjuries(): Promise<{ data: InjuryReport[] }> {
    return apiClient.get(`${this.BASE_PATH}/injuries`);
  }

  /**
   * Get first aid incidents
   */
  async getFirstAidIncidents(): Promise<{ data: FirstAidIncident[] }> {
    return apiClient.get(`${this.BASE_PATH}/first-aid`);
  }
}

// Export singleton instance
export const medicalService = new MedicalService();
export default medicalService;
