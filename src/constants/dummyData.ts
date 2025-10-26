// Dummy data for users
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'QA' | 'DEV' | 'PM' | 'DESIGN';
}

export const DUMMY_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    password: 'password123',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@obs.com',
    password: 'password123',
    role: 'QA',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@obs.com',
    password: 'password123',
    role: 'DEV',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@obs.com',
    password: 'password123',
    role: 'PM',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@obs.com',
    password: 'password123',
    role: 'DESIGN',
  },
];

// Dummy data for projects
export interface Project {
  id: string;
  name: string;
  description: string;
}

export const DUMMY_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'OBS Task Manager',
    description: 'Task management system development',
  },
  {
    id: '2',
    name: 'E-commerce Platform',
    description: 'Online shopping platform with payment integration',
  },
  {
    id: '3',
    name: 'Mobile App',
    description: 'Cross-platform mobile application',
  },
  {
    id: '4',
    name: 'Data Analytics Dashboard',
    description: 'Business intelligence and analytics platform',
  },
  {
    id: '5',
    name: 'API Development',
    description: 'RESTful API development and documentation',
  },
];
