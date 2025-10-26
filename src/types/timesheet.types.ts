// Timesheet related types
export interface TimeLog {
  id: string;
  employeeId: string;
  projectId: string;
  taskId?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeLogState {
  timeLogs: TimeLog[];
  currentTimeLog: TimeLog | null;
  isLoading: boolean;
  error: string | null;
}

export interface CreateTimeLogRequest {
  employeeId: string;
  projectId: string;
  taskId?: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface UpdateTimeLogRequest {
  id: string;
  projectId?: string;
  taskId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}
