import apiClient from '../../config/axios';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, ApiResponse, PaginatedResponse } from '../../types';

class EmployeeService {
  /**
   * Get all employees
   */
  async getEmployees(page = 1, limit = 10): Promise<PaginatedResponse<Employee>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Employee>>(`/employees?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch employees');
    }
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
    try {
      const response = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch employee');
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(employeeData: CreateEmployeeRequest): Promise<ApiResponse<Employee>> {
    try {
      const response = await apiClient.post<ApiResponse<Employee>>('/employees', employeeData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create employee');
    }
  }

  /**
   * Update employee
   */
  async updateEmployee(id: string, employeeData: UpdateEmployeeRequest): Promise<ApiResponse<Employee>> {
    try {
      const response = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update employee');
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/employees/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete employee');
    }
  }
}

export const employeeService = new EmployeeService();
