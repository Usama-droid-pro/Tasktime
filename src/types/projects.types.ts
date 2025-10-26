// Project related types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'completed';
  startDate: string;
  endDate?: string;
  managerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  managerId: string;
}

export interface UpdateProjectRequest {
  id: string;
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'completed';
  startDate?: string;
  endDate?: string;
  managerId?: string;
}
