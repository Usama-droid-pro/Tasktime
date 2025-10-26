import apiClient from '../../config/axios';
import { ApiResponse } from '../../types';

// User interface based on API documentation
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'QA' | 'DESIGN' | 'DEV' | 'PM' | 'Admin';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'QA' | 'DESIGN' | 'DEV' | 'PM' | 'Admin';
}

class UserService {
  /**
   * Get all users (Admin only according to API docs)
   */
  async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    try {
      const response = await apiClient.get<ApiResponse<{ users: User[] }>>('/users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  /**
   * Create new user (Admin only)
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ user: User }>>('/users', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  }

  /**
   * Update user password (Admin only)
   */
  async updateUserPassword(id: string, password: string): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.put<ApiResponse<{ user: User }>>(`/users/${id}/password`, { password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user password');
    }
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(id: string): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.delete<ApiResponse<{ user: User }>>(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }
}

export const userService = new UserService();