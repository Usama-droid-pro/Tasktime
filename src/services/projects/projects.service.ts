import apiClient from '../../config/axios';
import { Project, CreateProjectRequest, UpdateProjectRequest, ApiResponse, PaginatedResponse } from '../../types';

class ProjectService {
  /**
   * Get all projects
   */
  async getProjects(page = 1, limit = 10): Promise<PaginatedResponse<Project>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Project>>(`/projects?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  }

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    try {
      const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
  }

  /**
   * Create new project
   */
  async createProject(projectData: CreateProjectRequest): Promise<ApiResponse<Project>> {
    try {
      const response = await apiClient.post<ApiResponse<Project>>('/projects', projectData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  }

  /**
   * Update project
   */
  async updateProject(id: string, projectData: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    try {
      const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, projectData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/projects/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  }
}

export const projectService = new ProjectService();
