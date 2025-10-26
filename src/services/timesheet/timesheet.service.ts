import apiClient from '../../config/axios';
import { TimeLog, CreateTimeLogRequest, UpdateTimeLogRequest, ApiResponse, PaginatedResponse } from '../../types';

// Backend API response format for task logs
interface TaskLogResponse {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  date: string;
  totalHours: number;
  tasks: Array<{
    project_name: string;
    description: string;
    hours: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface TaskLogCreateRequest {
  userId: string;
  date: string;
  totalHours: number;
  tasks: Array<{
    project_name: string;
    description: string;
    hours: number;
  }>;
}

class TimesheetService {
  /**
   * Get all task logs
   */
  async getTaskLogs(userId?: string, startDate?: string, endDate?: string, projectName?: string): Promise<ApiResponse<{ taskLogs: TaskLogResponse[] }>> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (projectName) params.append('project_name', projectName);
      
      const response = await apiClient.get<ApiResponse<{ taskLogs: TaskLogResponse[] }>>(`/tasklogs?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task logs');
    }
  }

  /**
   * Get single task log by user ID and date
   */
  async getTaskLogByUserAndDate(userId: string, date: string): Promise<ApiResponse<{ taskLog: TaskLogResponse }>> {
    try {
      const params = new URLSearchParams({ userId, date });
      const response = await apiClient.get<ApiResponse<{ taskLog: TaskLogResponse }>>(`/tasklogs/single?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task log');
    }
  }
 
  /**
   * Create or update task log
   */
  async createTaskLog(taskLogData: TaskLogCreateRequest): Promise<ApiResponse<{ taskLog: TaskLogResponse }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ taskLog: TaskLogResponse }>>('/tasklogs', taskLogData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create task log');
    }
  }

  // Note: The backend API doesn't have separate update/delete endpoints
  // Task logs are created or updated via the POST /tasklogs endpoint

  /**
   * Get task logs by employee with date range filtering
   * This uses the main /tasklogs endpoint with userId filter
   */
  async getTaskLogsByEmployee(
    employeeId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<ApiResponse<{ taskLogs: TaskLogResponse[] }>> {
    try {
      return await this.getTaskLogs(employeeId, startDate, endDate);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch employee task logs');
    }
  }

  /**
   * Get task logs by project name
   */
  async getTaskLogsByProject(projectName: string, startDate?: string, endDate?: string): Promise<ApiResponse<{ taskLogs: TaskLogResponse[] }>> {
    try {
      return await this.getTaskLogs(undefined, startDate, endDate, projectName);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch project task logs');
    }
  }
}

export const timesheetService = new TimesheetService();
