import React, { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { cn } from '../utils/helpers';
import { BarChart3, Eye, Download, Plus, Edit2, X } from 'lucide-react';
import { DUMMY_USERS, User } from '../constants/dummyData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface EmployeesProps {}

const Employees: React.FC<EmployeesProps> = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>(DUMMY_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'QA' as 'Admin' | 'QA' | 'DEV' | 'PM' | 'DESIGN'
  });

  const roleOptions = [
    { value: 'QA', label: 'QA' },
    { value: 'DEV', label: 'DEV' },
    { value: 'PM', label: 'PM' },
    { value: 'DESIGN', label: 'DESIGN' }
  ];

  const handleViewReport = (userId: string, userName: string) => {
    navigate(`/employee-report/${userId}?name=${encodeURIComponent(userName)}`);
  };

  const handleViewLogs = (userId: string, userName: string) => {
    navigate(`/log-task?user=${userId}&name=${encodeURIComponent(userName)}`);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'QA'
    });
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: User) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: '', // Don't pre-fill password for security
      role: employee.role
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'QA'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    if (!editingEmployee && !formData.password.trim()) {
      toast.error('Password is required for new employees');
      return;
    }

    // Check if email already exists (for new employees)
    if (!editingEmployee && employees.some(emp => emp.email === formData.email)) {
      toast.error('Email already exists');
      return;
    }

    // Check if email exists for other employees (for editing)
    if (editingEmployee && employees.some(emp => emp.email === formData.email && emp.id !== editingEmployee.id)) {
      toast.error('Email already exists');
      return;
    }

    if (editingEmployee) {
      // Update existing employee
      const updatedEmployees = employees.map(emp => 
        emp.id === editingEmployee.id 
          ? {
              ...emp,
              name: formData.name.trim(),
              email: formData.email.trim(),
              password: formData.password.trim() || emp.password, // Keep existing password if not provided
              role: formData.role
            }
          : emp
      );
      setEmployees(updatedEmployees);
      toast.success('Employee updated successfully');
    } else {
      // Add new employee
      const newEmployee: User = {
        id: (employees.length + 1).toString(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: formData.role
      };
      setEmployees([...employees, newEmployee]);
      toast.success('Employee added successfully');
    }

    handleCloseModal();
  };

  return (
    <DashboardLayout title="Employees" subtitle="Manage and view employee reports">
      <div className="space-y-excel-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-excel-xl font-semibold text-excel-text-primary">
              Employee Management
            </h2>
            <p className="text-excel-sm text-excel-text-muted mt-excel-xs">
              View individual employee reports and logs
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleAddEmployee}
          >
            Add Employee
          </Button>
        </div>

        {/* Employees Table */}
        <div className="bg-white border border-excel-border rounded-excel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Column Headers */}
              <thead>
                {/* Excel Column Letters Row */}
                <tr className="bg-excel-gray-100 border-b border-excel-border">
                  <th className="w-12 h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted"></th>
                  <th className="h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center w-32">
                    A
                  </th>
                  <th className="h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center w-32">
                    B
                  </th>
                  <th className="h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center w-32">
                    C
                  </th>
                  <th className="h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center w-48">
                    D
                  </th>
                  <th className="h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center w-48">
                    E
                  </th>
                  <th className="h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center w-32">
                    F
                  </th>
                </tr>
                {/* Column Names Row */}
                <tr className="bg-excel-header border-b border-excel-border">
                  <th className="w-12 h-8 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted"></th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    Name
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    Role
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    Email
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    Final Report
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    View Logs
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    Edit
                  </th>
                </tr>
              </thead>

              {/* Data Rows */}
              <tbody>
                {employees.map((user, index) => (
                  <tr key={user.id} className="hover:bg-excel-hover border-b border-excel-border">
                    {/* Row Number */}
                    <td className="w-12 h-8 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center">
                      {index + 1}
                    </td>
                    
                    {/* Name */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary font-medium text-center">
                      {user.name}
                    </td>
                    
                    {/* Role */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary text-center">
                      <span className={cn(
                        'px-excel-sm py-excel-xs rounded-excel text-excel-xs font-medium',
                        user.role === 'Admin' && 'bg-blue-100 text-blue-700',
                        user.role === 'PM' && 'bg-purple-100 text-purple-700',
                        user.role === 'QA' && 'bg-green-100 text-green-700',
                        user.role === 'DEV' && 'bg-orange-100 text-orange-700',
                        user.role === 'DESIGN' && 'bg-pink-100 text-pink-700'
                      )}>
                        {user.role}
                      </span>
                    </td>
                    
                    {/* Email */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary text-center">
                      {user.email}
                    </td>
                    
                    {/* Final Report Button */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<BarChart3 className="w-4 h-4" />}
                        onClick={() => handleViewReport(user.id, user.name)}
                        className="text-excel-xs"
                      >
                        Report
                      </Button>
                    </td>
                    
                    {/* View Logs Button */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Eye className="w-4 h-4" />}
                        onClick={() => handleViewLogs(user.id, user.name)}
                        className="text-excel-xs"
                      >
                        Logs
                      </Button>
                    </td>
                    
                    {/* Edit Button */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit2 className="w-4 h-4" />}
                        onClick={() => handleEditEmployee(user)}
                        className="text-excel-xs"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Summary */}
        <div className="bg-excel-gray-50 border border-excel-border rounded-excel p-excel-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-excel-lg font-semibold text-excel-text-primary">
                Total Employees
              </h3>
              <p className="text-excel-sm text-excel-text-muted">
                {employees.length} employees across {new Set(employees.map(u => u.role)).size} roles
              </p>
            </div>
            <div className="text-right">
              <p className="text-excel-sm text-excel-text-muted">
                Roles: Admin, PM, QA, DEV, DESIGN
              </p>
            </div>
          </div>
        </div>

        {/* Add/Edit Employee Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-excel p-excel-2xl w-full max-w-md mx-excel-lg">
              <div className="flex items-center justify-between mb-excel-xl">
                <h3 className="text-excel-xl font-semibold text-excel-text-primary">
                  {editingEmployee ? 'Edit Employee' : 'Add Employee'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-excel-sm hover:bg-excel-hover rounded-excel transition-colors"
                >
                  <X className="w-5 h-5 text-excel-text-muted" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-excel-lg">
                <Input
                  label="Full Name"
                  placeholder="Enter employee name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />

                <Input
                  label={editingEmployee ? "New Password (leave blank to keep current)" : "Password"}
                  type="password"
                  placeholder={editingEmployee ? "Enter new password" : "Enter password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required={!editingEmployee}
                />

                <Select
                  label="Role"
                  options={roleOptions}
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'Admin' | 'QA' | 'DEV' | 'PM' | 'DESIGN' }))}
                />

                <div className="flex items-center justify-end space-x-excel-lg pt-excel-lg">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    {editingEmployee ? 'Update Employee' : 'Add Employee'}
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

export default Employees;
