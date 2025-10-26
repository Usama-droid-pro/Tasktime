import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { cn } from '../utils/helpers';
import { Download, ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { SAMPLE_LOG_DATA } from '../constants/sampleLogData';
import { DUMMY_PROJECTS } from '../constants/dummyData';
import { DUMMY_USERS } from '../constants/dummyData';
import { timesheetService } from '../services';

interface EmployeeReportProps {}

interface EmployeeReportData {
  project: string;
  totalHours: number;
  taskCount: number;
  avgHoursPerTask: number;
}

const EmployeeReport: React.FC<EmployeeReportProps> = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeName = searchParams.get('name') || 'Employee';
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  
  // API state management
  const [apiTaskLogs, setApiTaskLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useRealData, setUseRealData] = useState(true); // Default to API data

  // Fetch employee task logs from API
  const fetchEmployeeTaskLogs = async (employeeId: string, month?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let startDate: string | undefined;
      let endDate: string | undefined;
      
      if (month) {
        // Convert YYYY-MM to date range
        const [year, monthNum] = month.split('-');
        const firstDay = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
        const lastDay = new Date(parseInt(year), parseInt(monthNum), 0);
        
        startDate = firstDay.toISOString().split('T')[0];
        endDate = lastDay.toISOString().split('T')[0];
      }
      
      const response = await timesheetService.getTaskLogsByEmployee(employeeId, startDate, endDate);
      setApiTaskLogs(response.data.taskLogs || []);
      console.log('Employee task logs fetched:', response.data.taskLogs);
    } catch (err) {
      console.error('Failed to fetch employee task logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch employee task logs');
      setApiTaskLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate month options for the last 12 months
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    
    return options;
  };

  // Fetch data on component mount
  useEffect(() => {
    if (userId && useRealData) {
      fetchEmployeeTaskLogs(userId, selectedMonth);
    }
  }, []);

  // Fetch data when month or user changes (only if using real data)
  useEffect(() => {
    if (userId && useRealData) {
      fetchEmployeeTaskLogs(userId, selectedMonth);
    }
  }, [selectedMonth, useRealData, userId]);

  // Process API task logs to generate employee report
  const processApiEmployeeReportData = (): EmployeeReportData[] => {
    if (!apiTaskLogs.length) return [];
    
    const reportData: { [key: string]: EmployeeReportData } = {};
    
    // Process task logs
    apiTaskLogs.forEach(taskLog => {
      taskLog.tasks.forEach((task: any) => {
        const projectName = task.project_name;
        
        if (!reportData[projectName]) {
          reportData[projectName] = {
            project: projectName,
            totalHours: 0,
            taskCount: 0,
            avgHoursPerTask: 0,
          };
        }
        
        reportData[projectName].totalHours += task.hours;
        reportData[projectName].taskCount += 1;
      });
    });

    // Calculate average hours per task
    Object.values(reportData).forEach(project => {
      project.avgHoursPerTask = project.taskCount > 0 ? project.totalHours / project.taskCount : 0;
    });

    return Object.values(reportData).filter(project => project.totalHours > 0);
  };

  // Process log data to generate employee report (dummy data)
  const generateEmployeeReportData = (): EmployeeReportData[] => {
    const reportData: { [key: string]: EmployeeReportData } = {};
    
    // Initialize all projects
    DUMMY_PROJECTS.forEach(project => {
      reportData[project.name] = {
        project: project.name,
        totalHours: 0,
        taskCount: 0,
        avgHoursPerTask: 0,
      };
    });

    // Process log entries for selected month and user
    const [year, month] = selectedMonth.split('-');
    SAMPLE_LOG_DATA.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate.getFullYear() === parseInt(year) && 
          logDate.getMonth() === parseInt(month) - 1 && 
          log.userId === parseInt(userId || '0')) {
        log.tasks.forEach(task => {
          if (reportData[task.projectName]) {
            reportData[task.projectName].totalHours += task.hours;
            reportData[task.projectName].taskCount += 1;
          }
        });
      }
    });

    // Calculate average hours per task
    Object.values(reportData).forEach(project => {
      project.avgHoursPerTask = project.taskCount > 0 ? project.totalHours / project.taskCount : 0;
    });

    return Object.values(reportData).filter(project => project.totalHours > 0);
  };

  const reportData = useRealData ? processApiEmployeeReportData() : generateEmployeeReportData();

  // Calculate summary totals
  const summaryTotals = reportData.reduce(
    (totals, row) => ({
      totalHours: totals.totalHours + row.totalHours,
      taskCount: totals.taskCount + row.taskCount,
      avgHoursPerTask: totals.avgHoursPerTask + row.avgHoursPerTask,
    }),
    { totalHours: 0, taskCount: 0, avgHoursPerTask: 0 }
  );

  // Generate column headers (A, B, C, D, E)
  const columnHeaders = ['A', 'B', 'C', 'D', 'E'];
  const totalColumns = 5; // Project, Total Hours, Task Count, Avg Hours/Task, (empty for Excel feel)

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['Project', 'Total Hours', 'Task Count', 'Avg Hours/Task'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => [
        `"${row.project}"`,
        row.totalHours,
        row.taskCount,
        row.avgHoursPerTask.toFixed(2),
      ].join(',')),
      // Add summary row
      [
        '"TOTAL"',
        summaryTotals.totalHours,
        summaryTotals.taskCount,
        summaryTotals.taskCount > 0 ? (summaryTotals.totalHours / summaryTotals.taskCount).toFixed(2) : '0',
      ].join(',')
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${employeeName}_report_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goBack = () => {
    navigate('/employees');
  };

  return (
    <DashboardLayout title="Employee Report" subtitle={`${employeeName} - Project hours and performance`}>
      <div className="space-y-excel-xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-excel-lg">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={goBack}
            >
              Back to Employees
            </Button>
            <div>
              <h2 className="text-excel-xl font-semibold text-excel-text-primary">
                {employeeName} - Project Report
              </h2>
              <p className="text-excel-sm text-excel-text-muted mt-excel-xs">
                Individual project hours and task performance
              </p>
            </div>
            
            {/* Data source toggle */}
            <button
              onClick={() => setUseRealData(!useRealData)}
              className={cn(
                "px-excel-sm py-excel-xs text-excel-xs rounded-excel border transition-colors",
                useRealData 
                  ? "bg-blue-50 text-blue-700 border-blue-200" 
                  : "bg-gray-50 text-gray-700 border-gray-200"
              )}
              title={useRealData ? "Switch to demo data" : "Switch to real API data"}
            >
              {useRealData ? "API Data" : "Demo Data"}
            </button>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center space-x-excel-xs text-excel-sm text-excel-text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </div>
            )}
            
            {/* Error indicator */}
            {error && (
              <div className="flex items-center space-x-excel-xs text-excel-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>Error</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-excel-lg">
            {/* Refresh button */}
            {useRealData && userId && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={() => fetchEmployeeTaskLogs(userId, selectedMonth)}
                disabled={isLoading}
              >
                Refresh
              </Button>
            )}
            
            <Select
              label=""
              options={generateMonthOptions()}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-48"
              disabled={isLoading}
            />
            <Button 
              leftIcon={<Download className="w-4 h-4" />} 
              onClick={exportToExcel}
              disabled={isLoading}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Excel-like Report Table */}
        <div className="bg-white border border-excel-border rounded-excel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Column Headers */}
              <thead>
                {/* Excel Column Letters Row */}
                <tr className="bg-excel-gray-100 border-b border-excel-border">
                  <th className="w-12 h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted"></th>
                  {columnHeaders.map((col, index) => (
                    <th
                      key={col}
                      className={cn(
                        'h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center',
                        index === 0 && 'w-48', // Project column
                        index === 1 && 'w-24', // Total Hours column
                        index === 2 && 'w-24', // Task Count column
                        index === 3 && 'w-32', // Avg Hours/Task column
                        index > 3 && 'w-20' // Other columns
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
                    Project
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    Total Hours
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    Task Count
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    Avg Hours/Task
                  </th>
                </tr>
              </thead>

              {/* Data Rows */}
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="h-16 px-excel-md py-excel-sm text-center text-excel-sm text-excel-text-muted bg-excel-gray-50">
                      <div className="flex items-center justify-center space-x-excel-md">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading employee report...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="h-16 px-excel-md py-excel-sm text-center text-excel-sm text-red-600 bg-red-50">
                      <div className="flex items-center justify-center space-x-excel-md">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                        {userId && (
                          <button
                            onClick={() => fetchEmployeeTaskLogs(userId, selectedMonth)}
                            className="text-blue-600 hover:text-blue-700 underline"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-16 px-excel-md py-excel-sm text-center text-excel-sm text-excel-text-muted bg-excel-gray-50">
                      No task logs found for {employeeName} in the selected period.
                    </td>
                  </tr>
                ) : (
                  reportData.map((row, rowIndex) => (
                  <tr key={row.project} className="hover:bg-excel-hover border-b border-excel-border">
                    {/* Row Number */}
                    <td className="w-12 h-8 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center">
                      {rowIndex + 1}
                    </td>
                    
                    {/* Project */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary font-medium">
                      {row.project}
                    </td>
                    
                    {/* Total Hours */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary text-center">
                      {row.totalHours}
                    </td>
                    
                    {/* Task Count */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary text-center">
                      {row.taskCount}
                    </td>
                    
                    {/* Avg Hours/Task */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary text-center">
                      {row.avgHoursPerTask.toFixed(2)}
                    </td>
                  </tr>
                  ))
                )}
                
                {/* Summary Row */}
                {!isLoading && !error && reportData.length > 0 && (
                <tr className="bg-excel-gray-100 border-t-2 border-excel-border font-semibold">
                  {/* Row Number */}
                  <td className="w-12 h-8 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center">
                    {reportData.length + 1}
                  </td>
                  
                  {/* Project */}
                  <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-excel-gray-100 text-excel-sm text-excel-text-primary font-bold">
                    TOTAL
                  </td>
                  
                  {/* Total Hours */}
                  <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-excel-gray-100 text-excel-sm text-excel-text-primary text-center font-bold">
                    {summaryTotals.totalHours}
                  </td>
                  
                  {/* Task Count */}
                  <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-excel-gray-100 text-excel-sm text-excel-text-primary text-center font-bold">
                    {summaryTotals.taskCount}
                  </td>
                  
                  {/* Avg Hours/Task */}
                  <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-excel-gray-100 text-excel-sm text-excel-text-primary text-center font-bold">
                    {summaryTotals.taskCount > 0 ? (summaryTotals.totalHours / summaryTotals.taskCount).toFixed(2) : '0'}
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-excel-xl">
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h3 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-sm">
              Total Projects
            </h3>
            <p className="text-excel-2xl font-bold text-excel-blue-500">
              {reportData.length}
            </p>
          </div>
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h3 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-sm">
              Total Hours
            </h3>
            <p className="text-excel-2xl font-bold text-green-500">
              {summaryTotals.totalHours}
            </p>
          </div>
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h3 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-sm">
              Total Tasks
            </h3>
            <p className="text-excel-2xl font-bold text-orange-500">
              {summaryTotals.taskCount}
            </p>
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeReport;
