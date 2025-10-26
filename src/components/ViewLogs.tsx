import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '../utils/helpers';
import { DUMMY_PROJECTS } from '../constants/dummyData';
import { timesheetService, userService } from '../services';
import { User } from '../services/users/users.service';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProcessedTimeLog {
  id?: string;
  date: string;
  totalHours: number;
  projectHours: Record<string, number>;
  descriptions: string[];
  hasValidationError: boolean;
  originalLogs: any[]; // Can be empty for processed logs
}

const ViewLogs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preSelectedUserId = searchParams.get('user');
  const preSelectedUserName = searchParams.get('name');
  
  const [selectedUserId, setSelectedUserId] = useState<string>(
    preSelectedUserId || ''
  );
  
  // Date range state - default to current month (first to last day)
  const getCurrentMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Format dates without timezone conversion
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      startDate: formatDate(firstDay),
      endDate: formatDate(lastDay)
    };
  };
  
  const [dateRange, setDateRange] = useState(getCurrentMonthRange());
  
  // API state management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Users state
  const [apiUsers, setApiUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  
  // Fetch users from API
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    
    try {
      const response = await userService.getUsers();
      setApiUsers(response.data.users);
      console.log('Successfully fetched users from API:', response.data.users.length);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setUsersError(errorMessage);
      setApiUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Get users list from API
  const getUsersList = () => {
    return apiUsers;
  };
  
  // Helper function to get user name from ID
  const getUserNameById = (userId: number | string) => {
    const users = getUsersList();
    const userData = users.find(u => u.id === userId.toString());
    return userData?.name || `User ${userId}`;
  };

  // Get user IDs for tabs from API users
  const getUserIdsForTabs = () => {
    return apiUsers.map(user => user.id);
  };
  
  // State for processed API logs
  const [apiProcessedLogs, setApiProcessedLogs] = useState<ProcessedTimeLog[]>([]);

  // Fetch task logs from API
  const fetchTimeLogs = async (employeeId: string, startDate?: string, endDate?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const processedLogs = await processApiTaskLogs(employeeId, startDate, endDate);
      setApiProcessedLogs(processedLogs);
    } catch (err) {
      console.error('Failed to fetch task logs:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch task logs';
      setError(errorMessage);
      setApiProcessedLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []); // Only run once on mount

  // Set default to first user on component mount (only if no pre-selected user)
  React.useEffect(() => {
    const userIds = getUserIdsForTabs();
    if (userIds.length > 0 && !selectedUserId && !preSelectedUserId) {
      setSelectedUserId(userIds[0]);
    }
  }, [selectedUserId, preSelectedUserId, apiUsers]);

  // Debounced fetch to prevent excessive API calls
  useEffect(() => {
    if (!selectedUserId) return;
    
    const timeoutId = setTimeout(() => {
      fetchTimeLogs(selectedUserId, dateRange.startDate, dateRange.endDate);
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [selectedUserId, dateRange]);

  // Handle employee change with proper state management
  const handleEmployeeChange = (newEmployeeId: number | string) => {
    const stringId = newEmployeeId.toString();
    console.log('Switching to employee ID:', stringId);
    setSelectedUserId(stringId);
    setError(null); // Clear any previous errors
  };

  // Validate date range
  const isValidDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) return true; // Allow empty dates
    return new Date(dateRange.startDate) <= new Date(dateRange.endDate);
  };
  
  // Debug logging for pre-selected user
  React.useEffect(() => {
    if (preSelectedUserId) {
      console.log('Pre-selected user ID:', preSelectedUserId);
      console.log('Pre-selected user name:', preSelectedUserName);
      console.log('Selected user ID:', selectedUserId);
    }
  }, [preSelectedUserId, preSelectedUserName, selectedUserId]);
  
  // Debug when selectedUserId changes
  React.useEffect(() => {
    console.log('selectedUserId changed to:', selectedUserId);
  }, [selectedUserId]);
  
  // Process real API task logs into display format
  const processApiTaskLogs = async (employeeId: string, startDate?: string, endDate?: string): Promise<ProcessedTimeLog[]> => {
    try {
      const response = await timesheetService.getTaskLogsByEmployee(employeeId, startDate, endDate);
      
      return response.data.taskLogs.map(taskLog => {
        const projectHours: Record<string, number> = {};
        const descriptions: string[] = [];
        
        // Initialize all projects with 0 hours
        projectNames.forEach(projectName => {
          projectHours[projectName] = 0;
        });

        // Process tasks from the task log
        taskLog.tasks.forEach(task => {
          if (!projectHours[task.project_name]) {
            projectHours[task.project_name] = 0;
          }
          projectHours[task.project_name] += task.hours;
          if (task.description) {
            descriptions.push(task.description);
          }
        });

        const sumOfProjectHours = Object.values(projectHours).reduce((sum, hours) => sum + hours, 0);
        const hasValidationError = Math.abs(taskLog.totalHours - sumOfProjectHours) > 0.01;

        return {
          id: taskLog.id,
          date: taskLog.date,
          totalHours: taskLog.totalHours,
          projectHours,
          descriptions,
          hasValidationError,
          originalLogs: [] // We don't need to convert to TimeLog format for display
        };
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Failed to process task logs:', error);
      return [];
    }
  };

  // Get all unique project names from API data
  const projectNames = Array.from(new Set(
    apiProcessedLogs.flatMap(log => Object.keys(log.projectHours))
  ));
  
  // Use API processed logs
  const processedLogs = apiProcessedLogs;
  
  console.log('Processed logs for user', selectedUserId, ':', processedLogs);

  // Generate column headers (A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z)
  const columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const totalColumns = 3 + projectNames.length; // Date, Total Hours, What Accomplished + Projects
  const usedColumns = columnHeaders.slice(0, totalColumns);

  return (
    <div className="flex flex-col h-full" key={selectedUserId}>
      {/* User Info Header with Date Filter */}
      <div className="bg-white border border-excel-border rounded-t-excel p-excel-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-excel-md">
            <h3 className="text-excel-lg font-semibold text-black">
              Viewing logs for: {preSelectedUserName || getUserNameById(selectedUserId)}
            </h3>
            {/* {apiUsers.length > 0 && (
              <span className="text-excel-xs text-green-600 bg-green-50 px-excel-xs py-excel-xs rounded">
                {apiUsers.length} users
              </span>
            )} */}
            {apiUsers.length === 0 && !usersLoading && (
              <span className="text-excel-xs text-orange-600 bg-orange-50 px-excel-xs py-excel-xs rounded">
                No users found
              </span>
            )}
          </div>
          <div className="flex items-center space-x-excel-md">
            {(isLoading || usersLoading) && (
              <div className="flex items-center space-x-excel-xs text-excel-sm text-excel-text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{usersLoading ? 'Loading users...' : 'Loading...'}</span>
              </div>
            )}
            {(error || usersError) && (
              <div className="flex items-center space-x-excel-xs text-excel-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>Error loading data</span>
              </div>
            )}
            <span className="text-excel-sm text-excel-text-muted">
              {apiProcessedLogs.length} entries
              {!isValidDateRange() && (
                <span className="text-red-600 ml-excel-xs">(Invalid date range)</span>
              )}
            </span>
            <div className="flex items-center space-x-excel-sm">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setDateRange(prev => ({ ...prev, startDate: newStartDate }));
                  setError(null); // Clear errors when changing filters
                }}
                className="px-excel-sm py-excel-xs text-excel-xs border border-excel-border rounded-excel bg-white"
                disabled={isLoading}
              />
              <span className="text-excel-xs text-excel-text-muted">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => {
                  const newEndDate = e.target.value;
                  setDateRange(prev => ({ ...prev, endDate: newEndDate }));
                  setError(null); // Clear errors when changing filters
                }}
                className="px-excel-sm py-excel-xs text-excel-xs border border-excel-border rounded-excel bg-white"
                disabled={isLoading}
              />
              <button
                onClick={() => {
                  setDateRange(getCurrentMonthRange());
                  setError(null); // Clear errors when resetting
                }}
                className="px-excel-sm py-excel-xs text-excel-xs bg-white border border-excel-border rounded-excel hover:bg-excel-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Current Month"
                disabled={isLoading}
              >
                📅
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Table Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-l border-r border-b border-excel-border rounded-b-excel overflow-hidden">
      {/* Excel-like Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Column Headers */}
          <thead>
            {/* Excel Column Letters Row */}
            <tr className="bg-excel-gray-100 border-b border-excel-border">
              <th className="w-12 h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted"></th>
              {usedColumns.map((col, index) => (
                <th
                  key={col}
                  className={cn(
                    'h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center',
                    index === 0 && 'w-32', // Date column
                    index === 1 && 'w-24', // Total Hours column
                    index === 2 && 'w-80', // What Accomplished column
                    index > 2 && 'w-32' // Project columns
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
            {/* Column Names Row */}
            <tr className="bg-excel-header border-b border-excel-border">
              <th className="w-12 h-8 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted"></th>
              <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-left">
                Date
              </th>
              <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                Total Hours
              </th>
              <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-left">
                What Accomplished
              </th>
              {projectNames.map((projectName) => (
                <th
                  key={projectName}
                  className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center"
                >
                  {projectName}
                </th>
              ))}
            </tr>
          </thead>

          {/* Data Rows */}
          <tbody>
            {isLoading ? (
              <tr>
                <td 
                  colSpan={totalColumns + 1} 
                  className="h-16 px-excel-md py-excel-sm text-center text-excel-sm text-excel-text-muted bg-excel-gray-50"
                >
                  <div className="flex items-center justify-center space-x-excel-md">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading time logs...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td 
                  colSpan={totalColumns + 1} 
                  className="h-16 px-excel-md py-excel-sm text-center text-excel-sm text-red-600 bg-red-50"
                >
                  <div className="flex items-center justify-center space-x-excel-md">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                    <button
                      onClick={() => fetchTimeLogs(selectedUserId, dateRange.startDate, dateRange.endDate)}
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : processedLogs.length === 0 ? (
              <tr>
                <td 
                  colSpan={totalColumns + 1} 
                  className="h-16 px-excel-md py-excel-sm text-center text-excel-sm text-excel-text-muted bg-excel-gray-50"
                >
                  {selectedUserId
                    ? `No logs available for ${getUserNameById(selectedUserId)}. This user may not have logged any tasks yet.`
                    : 'No logs found for the selected criteria.'
                  }
                </td>
              </tr>
            ) : (
              processedLogs.map((log, rowIndex) => (
              <tr 
                key={log.id} 
                className={cn(
                  "border-b border-excel-border",
                  log.hasValidationError 
                    ? "bg-red-50 hover:bg-red-100" 
                    : "hover:bg-excel-hover"
                )}
              >
                {/* Row Number */}
                <td className={cn(
                  "w-4 h-4 border-r border-excel-border text-excel-xs font-medium text-center",
                  log.hasValidationError 
                    ? "bg-red-100 text-red-600" 
                    : "bg-excel-gray-200 text-excel-text-muted"
                )}>
                  {rowIndex + 1}
                </td>
                
                {/* Date */}
                <td className={cn(
                  "h-8 px-excel-md py-excel-sm border-r border-excel-border text-excel-sm",
                  log.hasValidationError 
                    ? "bg-red-50 text-red-800" 
                    : "bg-white text-excel-text-primary"
                )}>
                  {new Date(log.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </td>
                
                {/* Total Hours */}
                <td className={cn(
                  "h-8 px-excel-md py-excel-sm border-r border-excel-border text-excel-sm text-center font-medium",
                  log.hasValidationError 
                    ? "bg-red-50 text-red-800" 
                    : "bg-white text-excel-text-primary"
                )}>
                  {log.totalHours}
                </td>
                
                {/* What Accomplished */}
                <td className={cn(
                  "h-auto px-excel-md py-excel-sm border-r border-excel-border text-excel-sm max-w-80",
                  log.hasValidationError 
                    ? "bg-red-50 text-red-800" 
                    : "bg-white text-excel-text-primary"
                )}>
                  <div className="break-words whitespace-normal">
                    {log.descriptions.join(' + ')}
                  </div>
                </td>
                
                {/* Project Columns */}
                {projectNames.map((projectName) => (
                  <td
                    key={projectName}
                    className={cn(
                      "h-8 px-excel-md py-excel-sm border-r border-excel-border text-excel-sm text-center",
                      log.hasValidationError 
                        ? "bg-red-50 text-red-800" 
                        : "bg-white text-excel-text-primary"
                    )}
                  >
                    {log.projectHours[projectName] > 0 ? `${log.projectHours[projectName]} hrs` : '-'}
                  </td>
                ))}
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      {/* Validation Summary */}
      {processedLogs.some(log => log.hasValidationError) && (
        <div className="bg-red-50 border-t border-red-200 p-excel-md">
          <div className="flex items-center space-x-excel-md text-excel-sm text-red-700">
            <span className="font-medium">⚠️ Validation Alert:</span>
            <span>
              {processedLogs.filter(log => log.hasValidationError).length} row(s) have total hours that don't match the sum of project hours
            </span>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Bottom User Tabs Navigation (Excel-like) */}
      <div className="bg-excel-gray-100 border-t border-excel-border">
        <div className="flex overflow-x-auto">
          {usersLoading ? (
            <div className="px-excel-lg py-excel-sm text-excel-sm text-excel-text-muted flex items-center space-x-excel-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading users...</span>
            </div>
          ) : (
            getUserIdsForTabs().map((userId) => {
              const stringUserId = userId.toString();
              const user = getUsersList().find(u => u.id === stringUserId);
              
              return (
                <button
                  key={userId}
                  onClick={() => handleEmployeeChange(userId)}
                  className={cn(
                    'px-excel-lg py-excel-sm text-excel-sm font-medium border-r border-excel-border whitespace-nowrap transition-colors duration-150',
                    selectedUserId === stringUserId
                      ? 'bg-white text-excel-blue-600 border-b-2 border-excel-blue-500'
                      : 'bg-excel-gray-100 text-excel-text-primary hover:bg-excel-gray-200'
                  )}
                  title={user?.name ? `${user.name} (${user.role})` : `User ${userId}`}
                >
                  {getUserNameById(userId)}
                  {user?.role && (
                    <span className="text-excel-xs text-excel-text-muted ml-excel-xs">
                      ({user.role})
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
        
        {/* Users API status indicator */}
        {usersError && (
          <div className="px-excel-md py-excel-xs bg-yellow-50 border-t border-yellow-200 text-excel-xs text-yellow-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-excel-xs">
                <AlertCircle className="w-3 h-3" />
                <span>Users API unavailable</span>
              </div>
              <button
                onClick={fetchUsers}
                disabled={usersLoading}
                className="text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
              >
                {usersLoading ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        )}
        {!usersError && apiUsers.length > 0 && (
          <div className="px-excel-md py-excel-xs bg-green-50 border-t border-green-200 text-excel-xs text-green-700">
            <div className="flex items-center justify-between">
              <span>✓ {apiUsers.length} users loaded from API</span>
              <button
                onClick={fetchUsers}
                disabled={usersLoading}
                className="text-green-600 hover:text-green-700 underline disabled:opacity-50"
              >
                {usersLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLogs;
