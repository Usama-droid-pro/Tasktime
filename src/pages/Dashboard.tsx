import React from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Alert from '../components/ui/Alert';
import Loader from '../components/ui/Loader';
import { Plus, Filter, Download, Upload } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [showAlert, setShowAlert] = React.useState(true);

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome to OBS Task Manager"
    >
      <div className="space-y-excel-xl">
        {/* Alert Example */}
        {showAlert && (
          <Alert
            type="info"
            title="Welcome!"
            message="This is your Microsoft Excel-inspired dashboard. All components follow the Excel design system."
            dismissible
            onDismiss={() => setShowAlert(false)}
          />
        )}

        {/* Component Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-excel-xl">
          {/* Buttons */}
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h2 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-lg">
              Buttons
            </h2>
            <div className="space-y-excel-md">
              <div className="flex flex-wrap gap-excel-md">
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Primary Button
                </Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
              <div className="flex flex-wrap gap-excel-md">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-excel-md">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>

          {/* Form Elements */}
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h2 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-lg">
              Form Elements
            </h2>
            <div className="space-y-excel-lg">
              <Input
                label="Task Title"
                placeholder="Enter task title..."
                helperText="This is a helper text"
              />
              <Input
                label="Email"
                placeholder="Enter email..."
                error="Please enter a valid email"
              />
             
            </div>
          </div>
        </div>

        {/* Table Example */}
        <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
          <div className="flex items-center justify-between mb-excel-lg">
            <h2 className="text-excel-lg font-semibold text-excel-text-primary">
              Recent Tasks
            </h2>
            <div className="flex items-center space-x-excel-md">
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                Filter
              </Button>
              <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                Export
              </Button>
              <Button leftIcon={<Plus className="w-4 h-4" />}>
                New Task
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table-excel w-full">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Update Dashboard Design</td>
                  <td>
                    <span className="px-excel-sm py-excel-xs rounded-excel-sm text-excel-xs font-medium bg-blue-100 text-blue-800">
                      In Progress
                    </span>
                  </td>
                  <td>
                    <span className="px-excel-sm py-excel-xs rounded-excel-sm text-excel-xs font-medium bg-orange-100 text-orange-800">
                      High
                    </span>
                  </td>
                  <td>John Doe</td>
                  <td>Oct 25, 2024</td>
                  <td>
                    <div className="flex space-x-excel-sm">
                      <Button size="sm" variant="ghost">Edit</Button>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Create User Management</td>
                  <td>
                    <span className="px-excel-sm py-excel-xs rounded-excel-sm text-excel-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td>
                    <span className="px-excel-sm py-excel-xs rounded-excel-sm text-excel-xs font-medium bg-yellow-100 text-yellow-800">
                      Medium
                    </span>
                  </td>
                  <td>Jane Smith</td>
                  <td>Oct 30, 2024</td>
                  <td>
                    <div className="flex space-x-excel-sm">
                      <Button size="sm" variant="ghost">Edit</Button>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Implement Task Tracking</td>
                  <td>
                    <span className="px-excel-sm py-excel-xs rounded-excel-sm text-excel-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td>
                    <span className="px-excel-sm py-excel-xs rounded-excel-sm text-excel-xs font-medium bg-orange-100 text-orange-800">
                      High
                    </span>
                  </td>
                  <td>Mike Johnson</td>
                  <td>Oct 20, 2024</td>
                  <td>
                    <div className="flex space-x-excel-sm">
                      <Button size="sm" variant="ghost">Edit</Button>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Loader Example */}
        <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
          <h2 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-lg">
            Loading States
          </h2>
          <div className="flex items-center space-x-excel-xl">
            <div className="text-center">
              <Loader size="sm" />
              <p className="text-excel-xs text-excel-text-muted mt-excel-sm">Small</p>
            </div>
            <div className="text-center">
              <Loader size="md" />
              <p className="text-excel-xs text-excel-text-muted mt-excel-sm">Medium</p>
            </div>
            <div className="text-center">
              <Loader size="lg" />
              <p className="text-excel-xs text-excel-text-muted mt-excel-sm">Large</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
