// Employee related types
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'employee' | 'manager';
  department: string;
  position: string;
  isActive: boolean;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'employee' | 'manager';
  department: string;
  position: string;
  hireDate: string;
}

export interface UpdateEmployeeRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: 'admin' | 'employee' | 'manager';
  department?: string;
  position?: string;
  isActive?: boolean;
}
