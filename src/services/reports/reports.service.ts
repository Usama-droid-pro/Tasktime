import apiClient from '../../config/axios';
import { ApiResponse } from '../../types';

// Report interfaces based on API documentation
export interface ProjectReport {
  project: string;
  totalHours: number;
  QA: number;
  DESIGN: number;
  DEV: number;
  PM: number;
}

export interface ReportTotals {
  totalHours: number;
  QA: number;
  DESIGN: number;
  DEV: number;
  PM: number;
}

export interface GrandReportData {
  projects: ProjectReport[];
  totals: ReportTotals;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  totalProjects: number;
}

class ReportsService {
  /**
   * Get grand report with role-based hour tracking
   */
  async getGrandReport(startDate?: string, endDate?: string): Promise<ApiResponse<GrandReportData>> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await apiClient.get<ApiResponse<GrandReportData>>(
        `/reports/grand?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch grand report');
    }
  }
}

export const reportsService = new ReportsService();