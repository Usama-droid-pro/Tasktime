import React, { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { DUMMY_PROJECTS } from '../constants/dummyData';
import { toast } from 'react-hot-toast';

interface ProjectsProps {}

interface Project {
  id: string;
  name: string;
  description: string;
}

const Projects: React.FC<ProjectsProps> = () => {
  const [projects, setProjects] = useState<Project[]>(DUMMY_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectName(project.name);
      setProjectDescription(project.description);
    } else {
      setEditingProject(null);
      setProjectName('');
      setProjectDescription('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setProjectName('');
    setProjectDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      // Update existing project
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...p, name: projectName, description: projectDescription }
          : p
      ));
      toast.success('Project updated successfully!');
    } else {
      // Add new project
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectName,
        description: projectDescription,
      };
      setProjects([...projects, newProject]);
      toast.success('Project added successfully!');
    }
    
    closeModal();
  };

  const handleDelete = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast.success('Project deleted successfully!');
  };

  return (
    <DashboardLayout title="Projects" subtitle="Manage your projects">
      <div className="space-y-excel-xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-excel-xl font-semibold text-excel-text-primary">
              All Projects
            </h2>
            <p className="text-excel-sm text-excel-text-muted mt-excel-xs">
              Manage and organize your projects
            </p>
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => openModal()}>
            Add New Project
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-excel-lg">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-excel-text-muted" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-excel pl-10 w-full"
            />
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white border border-excel-border rounded-excel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-excel-header border-b border-excel-border">
                  <th className="px-excel-lg py-excel-md text-excel-sm font-medium text-white text-left">
                    Project Name
                  </th>
                  <th className="px-excel-lg py-excel-md text-excel-sm font-medium text-white text-left">
                    Description
                  </th>
                  <th className="px-excel-lg py-excel-md text-excel-sm font-medium text-white text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <tr key={project.id} className="hover:bg-excel-hover border-b border-excel-border">
                    <td className="px-excel-lg py-excel-md text-excel-sm text-excel-text-primary font-medium">
                      {project.name}
                    </td>
                    <td className="px-excel-lg py-excel-md text-excel-sm text-excel-text-primary">
                      {project.description}
                    </td>
                    <td className="px-excel-lg py-excel-md text-excel-sm text-excel-text-primary">
                      <div className="flex items-center justify-center space-x-excel-sm">
                        <Button size="sm" variant="ghost" leftIcon={<Edit className="w-4 h-4" />} onClick={() => openModal(project)}>
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          leftIcon={<Trash2 className="w-4 h-4" />}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(project.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-excel-xl">
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h3 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-sm">
              Total Projects
            </h3>
            <p className="text-excel-2xl font-bold text-excel-blue-500">
              {projects.length}
            </p>
          </div>
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h3 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-sm">
              Active Projects
            </h3>
            <p className="text-excel-2xl font-bold text-green-500">
              {projects.length}
            </p>
          </div>
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h3 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-sm">
              Completed
            </h3>
            <p className="text-excel-2xl font-bold text-excel-text-muted">
              0
            </p>
          </div>
        </div> */}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-excel p-excel-2xl w-full max-w-md mx-excel-lg">
              <div className="flex items-center justify-between mb-excel-xl">
                <h3 className="text-excel-lg font-semibold text-excel-text-primary">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-excel-sm hover:bg-excel-hover rounded-excel transition-colors duration-150"
                >
                  <X className="w-5 h-5 text-excel-text-muted" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-excel-lg">
                <Input
                  label="Project Name"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />

                <Input
                  label="Description"
                  placeholder="Enter project description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                />

                <div className="flex justify-end space-x-excel-md">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingProject ? 'Update Project' : 'Add Project'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
