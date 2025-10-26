import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Calendar from '../components/ui/Calendar';
import { Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { DUMMY_PROJECTS, Project } from '../constants/dummyData';
import { cn } from '../utils/helpers';
import ViewLogs from '../components/ViewLogs';
import { timesheetService, authService } from '../services';
import { 
  validateFormFields, 
  transformFormToTaskLog, 
  TaskEntry as TaskEntryType,
  DailyLogForm 
} from '../utils/timesheet.utils';
import toast from 'react-hot-toast';

interface LogTaskProps {}

const LogTask: React.FC<LogTaskProps> = () => {
  const [searchParams] = useSearchParams();
  const isFromEmployees = searchParams.get('user') && searchParams.get('name');
  
  const [activeTab, setActiveTab] = useState<'log' | 'view'>(
    isFromEmployees ? 'view' : 'log'
  );
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalHours, setTotalHours] = useState('');
  const [tasks, setTasks] = useState<TaskEntryType[]>([
    {
      id: '1',
      projectId: '',
      description: '',
      hours: '',
    },
  ]);
  
  // New state for API integration
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(false);
  
  // Get current user info - use useEffect to get stable reference
  const [currentUser, setCurrentUser] = useState(authService.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    setCurrentUser(authService.getUser());
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  // Fetch existing task log when date changes
  useEffect(() => {
    const fetchExistingTaskLog = async () => {
      if (!isAuthenticated || !currentUser || activeTab !== 'log') return;
      
      setIsLoadingExistingData(true);
      
      try {
        const response = await timesheetService.getTaskLogByUserAndDate(
          currentUser.id,
          selectedDate
        );
        
        if (response.success && response.data.taskLog) {
          // Populate form with existing data
          const taskLog = response.data.taskLog;
          setTotalHours(taskLog.totalHours.toString());
          
          // Convert tasks from API format to form format
          const formattedTasks = taskLog.tasks.map((task, index) => {
            // Find project by name
            const project = DUMMY_PROJECTS.find(p => p.name === task.project_name);
            
            return {
              id: Date.now().toString() + index,
              projectId: project?.id || '',
              description: task.description,
              hours: task.hours.toString(),
            };
          });
          
          setTasks(formattedTasks.length > 0 ? formattedTasks : [
            {
              id: Date.now().toString(),
              projectId: '',
              description: '',
              hours: '',
            }
          ]);
          
          // toast.success('Loaded existing task log for this date. You can update it.');
        } else {
          // No existing data, reset to empty form
          setTotalHours('');
          setTasks([{
            id: Date.now().toString(),
            projectId: '',
            description: '',
            hours: '',
          }]);
        }
      } catch (error: any) {
        // If 404 or no data found, that's okay - user will create new entry
        if (error.message.includes('not found') || error.message.includes('404')) {
          setTotalHours('');
          setTasks([{
            id: Date.now().toString(),
            projectId: '',
            description: '',
            hours: '',
          }]);
        } else {
          console.error('Failed to fetch existing task log:', error);
        }
      } finally {
        setIsLoadingExistingData(false);
      }
    };
    
    fetchExistingTaskLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, activeTab]);

  const addTask = () => {
    const newTask: TaskEntryType = {
      id: Date.now().toString(),
      projectId: '',
      description: '',
      hours: '',
    };
    setTasks([...tasks, newTask]);
  };


  const removeTask = (taskId: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const updateTask = (taskId: string, field: keyof TaskEntryType, value: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const projectOptions = DUMMY_PROJECTS.map((project: Project) => ({
    value: project.id,
    label: project.name,
  }));

  const resetForm = () => {
    setTotalHours('');
    setTasks([{
      id: Date.now().toString(),
      projectId: '',
      description: '',
      hours: '',
    }]);
    setValidationErrors([]);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous states
    setSubmitError(null);
    setValidationErrors([]);
    setSubmitSuccess(false);
    
    // Create form data object
    const formData: DailyLogForm = {
      date: selectedDate,
      totalHours,
      tasks
    };
    
    // Validate form (removed total hours matching validation)
    const validation = validateFormFields(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user m auth service
      const currentUser = authService.getUser();
      const employeeId = currentUser?.id || '1'; // Fallback to '1' if no user is logged in
      
      // Transform form data to API format
      const taskLogData = transformFormToTaskLog(formData, employeeId, DUMMY_PROJECTS);
      
      // Submit to API
      await timesheetService.createTaskLog(taskLogData);
      
      // Success handling - show success message without resetting form
      setSubmitSuccess(true);
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Failed to submit time logs:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save time logs. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Log Task" subtitle="Track your daily work hours">
      <div className="space-y-excel-xl">
        {/* Tabs */}
        <div className="border-b border-excel-border">
          <nav className="-mb-px flex space-x-excel-xl">
            <button
              onClick={() => setActiveTab('log')}
              className={cn(
                'py-excel-md px-excel-lg border-b-2 font-medium text-excel-sm transition-colors duration-150',
                activeTab === 'log'
                  ? 'border-excel-blue-500 text-excel-blue-500'
                  : 'border-transparent text-excel-text-muted hover:text-excel-text-primary hover:border-excel-gray-300'
              )}
            >
              Log your task
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={cn(
                'py-excel-md px-excel-lg border-b-2 font-medium text-excel-sm transition-colors duration-150',
                activeTab === 'view'
                  ? 'border-excel-blue-500 text-excel-blue-500'
                  : 'border-transparent text-excel-text-muted hover:text-excel-text-primary hover:border-excel-gray-300'
              )}
            >
              View Logs
            </button>
          </nav>
        </div>

        {activeTab === 'log' && (
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            {/* {isAuthenticated && currentUser ? (
              <div className="bg-blue-50 border border-blue-200 rounded-excel p-excel-md mb-excel-xl">
                <div className="flex items-center space-x-excel-md">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-excel-sm font-medium">
                    {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-excel-sm font-medium text-blue-900">
                      Logging time for: {currentUser.name || 'Unknown User'}
                    </div>
                    <div className="text-excel-xs text-blue-700">
                      {currentUser.email} • {currentUser.role || 'No role'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-excel p-excel-md mb-excel-xl">
                <div className="flex items-center space-x-excel-md">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="text-excel-sm font-medium text-yellow-900">
                      Not authenticated
                    </div>
                    <div className="text-excel-xs text-yellow-700">
                      Time logs will be saved with a default user ID. Please log in for proper user tracking.
                    </div>
                  </div>
                </div>
              </div>
            )} */}
            
            <form onSubmit={handleSubmit} className="space-y-excel-xl">
              {/* Loading State */}
              {isLoadingExistingData && (
                <div className="bg-blue-50 border border-blue-200 rounded-excel p-excel-md flex items-center space-x-excel-md">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800 text-excel-sm font-medium">
                    Loading existing data for selected date...
                  </span>
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-excel p-excel-md flex items-center space-x-excel-md">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 text-excel-sm font-medium">
                    Time logs saved successfully! You can edit and save again to update.
                  </span>
                </div>
              )}

              {/* Error Messages */}
              {(submitError || validationErrors.length > 0) && (
                <div className="bg-red-50 border border-red-200 rounded-excel p-excel-md">
                  <div className="flex items-start space-x-excel-md">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-red-800 text-excel-sm font-medium mb-excel-sm">
                        Please fix the following errors:
                      </h4>
                      <ul className="text-red-700 text-excel-sm space-y-excel-xs">
                        {submitError && <li>• {submitError}</li>}
                        {validationErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Date and Total Hours Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-excel-xl">
                <div className="space-y-excel-sm">
                  <label className="block text-excel-sm font-medium text-excel-text-primary mb-excel-xs">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    disabled={isLoadingExistingData}
                    className="input-excel disabled:bg-excel-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <Input
                  label="Total Hours"
                  type="decimal"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="Enter total hours worked"
                  value={totalHours}
                  onChange={(e) => {
                    setTotalHours(e.target.value);
                    // Clear validation errors when user starts typing
                    if (validationErrors.length > 0) {
                      setValidationErrors([]);
                    }
                  }}
                  disabled={isLoadingExistingData}
                />
              </div>

              {/* Task Entries */}
              <div className="space-y-excel-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-excel-lg font-semibold text-excel-text-primary">
                    Tasks
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={addTask}
                    disabled={isLoadingExistingData}
                  >
                    Add Task
                  </Button>
                </div>

                <div className="space-y-excel-lg">
                  {tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="border border-excel-border rounded-excel p-excel-lg bg-excel-gray-50"
                    >
                      <div className="flex items-center justify-between mb-excel-md">
                        <h4 className="text-excel-sm font-medium text-excel-text-primary">
                          Task {index + 1}
                        </h4>
                        {tasks.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTask(task.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isLoadingExistingData}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-excel-lg">
                        <div>
                          <Select
                            label="Project"
                            options={projectOptions}
                            placeholder="Select project..."
                            value={task.projectId}
                            onChange={(e) => updateTask(task.id, 'projectId', e.target.value)}
                            disabled={isLoadingExistingData}
                          />
                          {!task.projectId && validationErrors.some(error => error.includes(`Task ${index + 1}`) && error.includes('Project')) && (
                            <div className="text-red-600 text-excel-xs mt-excel-xs">Project is required</div>
                          )}
                        </div>

                        <div>
                          <Input
                            label="Description"
                            placeholder="Enter task description..."
                            value={task.description}
                            onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                            disabled={isLoadingExistingData}
                          />
                          {!task.description.trim() && validationErrors.some(error => error.includes(`Task ${index + 1}`) && error.includes('Description')) && (
                            <div className="text-red-600 text-excel-xs mt-excel-xs">Description is required</div>
                          )}
                        </div>

                        <div>
                          <Input
                            label="Hours"
                            type="decimal"
                            step="0.5"
                            min="0"
                            max="24"
                            placeholder="Hours"
                            value={task.hours}
                            onChange={(e) => updateTask(task.id, 'hours', e.target.value)}
                            disabled={isLoadingExistingData}
                          />
                          {(() => {
                            const hours = parseFloat(task.hours);
                            const hasHoursError = validationErrors.some(error => 
                              error.includes(`Task ${index + 1}`) && error.includes('Hours')
                            );
                            if (hasHoursError) {
                              return <div className="text-red-600 text-excel-xs mt-excel-xs">Valid hours required</div>;
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-excel-md">
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isSubmitting || isLoadingExistingData}
                >
                  {isSubmitting ? 'Saving...' : 'Save Tasks'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'view' && (
          <div className="h-[calc(100vh-200px)]">
            <ViewLogs />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LogTask;
