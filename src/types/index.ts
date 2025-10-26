// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  details?: any;
}

// Export all types from this index file
export * from './user.types';
export * from './projects.types';
export * from './task.types';
export * from './employee.types';
export * from './timesheet.types';
