// Backend API format for task log creation
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

export interface TaskEntry {
  id: string;
  projectId: string;
  description: string;
  hours: string;
}

export interface DailyLogForm {
  date: string;
  totalHours: string;
  tasks: TaskEntry[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates that total hours match the sum of individual task hours
 */
export const validateTotalHours = (totalHours: string, tasks: TaskEntry[]): ValidationResult => {
  const errors: string[] = [];
  
  const total = parseFloat(totalHours) || 0;
  const taskHoursSum = tasks.reduce((sum, task) => {
    const hours = parseFloat(task.hours) || 0;
    return sum + hours;
  }, 0);
  
  // Allow small floating point differences (0.01 hours = 36 seconds)
  const difference = Math.abs(total - taskHoursSum);
  
  if (difference > 0.01) {
    errors.push(`Total hours (${total}) must match sum of task hours (${taskHoursSum})`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates form fields for required data and proper formats
 */
export const validateFormFields = (form: DailyLogForm): ValidationResult => {
  const errors: string[] = [];
  
  // Validate date
  if (!form.date) {
    errors.push('Date is required');
  }
  
  // Validate total hours
  const totalHours = parseFloat(form.totalHours);
  if (!form.totalHours || isNaN(totalHours) || totalHours <= 0) {
    errors.push('Total hours must be a positive number');
  }
  
  if (totalHours > 24) {
    errors.push('Total hours cannot exceed 24 hours per day');
  }
  
  // Validate tasks
  if (form.tasks.length === 0) {
    errors.push('At least one task is required');
  }
  
  form.tasks.forEach((task, index) => {
    if (!task.projectId) {
      errors.push(`Task ${index + 1}: Project is required`);
    }
    
    if (!task.description.trim()) {
      errors.push(`Task ${index + 1}: Description is required`);
    }
    
    const hours = parseFloat(task.hours);
    if (!task.hours || isNaN(hours) || hours <= 0) {
      errors.push(`Task ${index + 1}: Hours must be a positive number`);
    }
    
    if (hours > 24) {
      errors.push(`Task ${index + 1}: Hours cannot exceed 24 hours`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Transforms form data to API format for creating task log
 */
export const transformFormToTaskLog = (
  form: DailyLogForm, 
  employeeId: string,
  projects: Array<{ id: string; name: string }>
): TaskLogCreateRequest => {
  const tasks = form.tasks.map(task => {
    const hours = parseFloat(task.hours);
    // Find project name by ID
    const project = projects.find(p => p.id === task.projectId);
    const projectName = project?.name || `Project ${task.projectId}`;
    
    return {
      project_name: projectName,
      description: task.description.trim(),
      hours: hours
    };
  });

  return {
    userId: employeeId,
    date: form.date,
    totalHours: parseFloat(form.totalHours),
    tasks: tasks
  };
};

/**
 * Validates the complete form including field validation and total hours validation
 */
export const validateCompleteForm = (form: DailyLogForm): ValidationResult => {
  const fieldValidation = validateFormFields(form);
  
  if (!fieldValidation.isValid) {
    return fieldValidation;
  }
  
  const totalHoursValidation = validateTotalHours(form.totalHours, form.tasks);
  
  return {
    isValid: fieldValidation.isValid && totalHoursValidation.isValid,
    errors: [...fieldValidation.errors, ...totalHoursValidation.errors]
  };
};