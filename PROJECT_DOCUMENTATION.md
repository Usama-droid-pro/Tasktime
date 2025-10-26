# OBS Task Manager - Project Documentation

## 📋 Project Overview

**OBS Task Manager** is a React TypeScript application designed as a timesheet management system with a Microsoft Excel-inspired theme. The application allows users to log their daily work hours, view reports, and manage projects with role-based access control.

## 🎯 Key Features

### 🔐 Authentication System
- **Login Page**: Email/password authentication with dummy data
- **Role-based Access**: Admin, QA, DEV, PM, DESIGN roles
- **Session Management**: localStorage persistence
- **Protected Routes**: React Router with authentication guards

### 📊 Dashboard Pages
- **Log Task**: Daily timesheet logging with multiple task entries
- **View Logs**: Excel-like table with user filtering and validation
- **Projects**: Project management (Admin only)
- **Reports**: Monthly reports with Excel export functionality

### 🎨 Design System
- **Excel Theme**: Microsoft Excel-inspired colors, fonts, and styling
- **Responsive Design**: Works on all screen sizes
- **Component Library**: Reusable UI components
- **Tailwind CSS**: Custom Excel theme configuration

## 🏗️ Project Structure

```
obs-task-manager/
├── public/
├── src/
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.tsx      # Main dashboard wrapper
│   │   │   └── SideNavbar.tsx           # Navigation sidebar
│   │   ├── ui/
│   │   │   ├── Alert.tsx                # Alert/notification component
│   │   │   ├── Button.tsx               # Button component
│   │   │   ├── Calendar.tsx             # Date picker component
│   │   │   ├── Input.tsx                # Input field component
│   │   │   └── Select.tsx               # Select dropdown component
│   │   ├── ProtectedRoute.tsx           # Route protection wrapper
│   │   └── ViewLogs.tsx                 # Excel-like logs table
│   ├── contexts/
│   │   └── AuthContext.tsx              # Authentication context
│   ├── pages/
│   │   ├── Login.tsx                    # Login page
│   │   ├── LogTask.tsx                  # Task logging page
│   │   ├── Projects.tsx                 # Project management page
│   │   └── Report.tsx                   # Reports page
│   ├── constants/
│   │   ├── dummyData.ts                 # User and project data
│   │   └── sampleLogData.ts            # Sample timesheet data
│   ├── utils/
│   │   └── helpers.ts                   # Utility functions
│   ├── App.tsx                          # Main app component
│   ├── App.css                          # App styles
│   └── index.css                        # Global styles
├── tailwind.config.js                   # Tailwind configuration
├── package.json                         # Dependencies
└── PROJECT_DOCUMENTATION.md            # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd obs-task-manager

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts
```bash
npm start          # Start development server
npm build          # Build for production
npm test           # Run tests
npm eject          # Eject from Create React App
```

## 🎨 Design System

### Excel Theme Configuration
The project uses a custom Excel-inspired theme defined in `tailwind.config.js`:

```javascript
// Primary Colors
excel: {
  blue: {
    500: '#217346',  // Primary green color
    600: '#1a5d3a',
    // ... other shades
  },
  // Gray, border, text colors...
}
```

### Typography
- **Font Family**: Segoe UI, Tahoma, Arial, sans-serif
- **Font Sizes**: excel-xs (13px) to excel-2xl (24px)
- **Line Heights**: Optimized for readability

### Spacing System
- **Padding/Margin**: excel-xs (4px) to excel-3xl (36px)
- **Border Radius**: excel (2px) for consistent rounded corners

## 🔐 Authentication System

### User Roles
```typescript
type UserRole = 'Admin' | 'QA' | 'DEV' | 'PM' | 'DESIGN';
```

### Dummy Users
```typescript
const DUMMY_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    password: 'password123',
    role: 'Admin',
  },
  // ... other users
];
```

### Login Credentials
- **Admin**: john.doe@company.com / password123
- **QA**: jane.smith@obs.com / password123
- **DEV**: mike.johnson@obs.com / password123
- **PM**: sarah.wilson@obs.com / password123
- **DESIGN**: david.brown@obs.com / password123

### Authentication Flow
1. User enters credentials on Login page
2. System validates against DUMMY_USERS
3. User data saved to localStorage
4. Redirected to Log Task page
5. Session persists across page refreshes

## 📊 Data Models

### User Interface
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'QA' | 'DEV' | 'PM' | 'DESIGN';
}
```

### Project Interface
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
}
```

### Log Entry Interface
```typescript
interface LogEntry {
  id: string;
  date: string;           // YYYY-MM-DD format
  userId: number;         // User ID reference
  totalHours: number;
  tasks: {
    projectName: string;
    hours: number;
    description: string;
  }[];
}
```

## 🛣️ Routing System

### Route Structure
```
/login          → Login page (public)
/log-task       → Log Task page (protected)
/report         → Report page (protected)
/projects       → Projects page (Admin only)
/               → Redirects to /log-task
/*              → Redirects to /log-task
```

### Protected Routes
- **ProtectedRoute Component**: Wraps protected pages
- **Role-based Access**: Projects page only for Admin users
- **Automatic Redirects**: Unauthenticated users → Login

## 📱 Page Components

### Login Page (`/src/pages/Login.tsx`)
- **Purpose**: User authentication
- **Features**: Email/password form, error handling, success notifications
- **Styling**: Excel-themed form with validation

### Log Task Page (`/src/pages/LogTask.tsx`)
- **Purpose**: Daily timesheet logging
- **Features**: 
  - Date selection (defaults to today)
  - Total hours input
  - Multiple task entries with project dropdown
  - Dynamic add/remove task functionality
  - Two tabs: "Log your task" and "View Logs"

### View Logs Component (`/src/components/ViewLogs.tsx`)
- **Purpose**: Display timesheet data in Excel-like format
- **Features**:
  - Excel-style table with column letters (A, B, C...)
  - User filtering with bottom tabs
  - Hour validation (highlights discrepancies in red)
  - Row numbers and column headers
  - Responsive design

### Projects Page (`/src/pages/Projects.tsx`)
- **Purpose**: Project management (Admin only)
- **Features**:
  - Project listing table
  - Search functionality
  - Add/Edit/Delete projects via modal
  - Project statistics

### Report Page (`/src/pages/Report.tsx`)
- **Purpose**: Monthly reports and analytics
- **Features**:
  - Excel-like report table
  - Month selection dropdown
  - Project hours by role (PM, QA, DEV, DESIGN)
  - CSV export functionality
  - Summary statistics

## 🎯 Key Features Explained

### Excel-like Table Design
The ViewLogs component implements a Microsoft Excel-inspired table:

```typescript
// Column headers with Excel letters
const columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// Two header rows:
// 1. Excel column letters (A, B, C...)
// 2. Actual column names (Date, Total Hours, What Accomplished...)
```

### User Filtering System
- **Bottom Tabs**: Excel-like sheet tabs at bottom of screen
- **User Selection**: Click any tab to filter data
- **Dynamic Filtering**: Table updates to show selected user's logs
- **Visual Indicators**: Active tab highlighted, user info in header

### Hour Validation
```typescript
// Validates if total hours match sum of project hours
const hasValidationError = Math.abs(log.totalHours - sumOfProjectHours) > 0.01;

// Highlights rows in red when validation fails
className={cn(
  "border-b border-excel-border",
  log.hasValidationError 
    ? "bg-red-50 hover:bg-red-100" 
    : "hover:bg-excel-hover"
)}
```

### Role-based Access Control
```typescript
// SideNavbar conditionally shows Projects for Admin
...(user?.role === 'Admin' ? [{
  id: 'projects',
  label: 'Projects',
  icon: <FolderOpen className="w-5 h-5" />,
  href: '/projects',
}] : [])

// ProtectedRoute with role requirement
<ProtectedRoute user={user} requiredRole="Admin">
  <Projects />
</ProtectedRoute>
```

## 🔧 Technical Implementation

### State Management
- **React Hooks**: useState, useEffect for local state
- **Context API**: AuthContext for global authentication state
- **localStorage**: Session persistence

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme**: Excel-inspired color palette and spacing
- **Component Classes**: Reusable CSS classes (btn-excel, input-excel, etc.)

### Data Flow
1. **Authentication**: Login → AuthContext → localStorage
2. **Navigation**: SideNavbar → React Router → Protected Routes
3. **Data Display**: Component → Filter Data → Render Table
4. **User Interaction**: Click Tab → Update State → Re-render

### Performance Considerations
- **Memoization**: React.useEffect with proper dependencies
- **Key Props**: Force re-render when user changes
- **Efficient Filtering**: Array.filter for data processing

## 🐛 Common Issues & Solutions

### User Tab Switching Not Working
**Problem**: Clicking user tabs doesn't update data
**Solution**: 
- Check if `setSelectedUserId` is being called
- Verify `filteredLogData` is updating
- Ensure component re-renders with `key={selectedUserId}`

### Authentication State Issues
**Problem**: Login page appears briefly on page refresh
**Solution**: 
- AuthContext handles loading state
- Shows loading spinner while checking localStorage

### Styling Inconsistencies
**Problem**: Components don't match Excel theme
**Solution**: 
- Use custom Tailwind classes (excel-*)
- Check tailwind.config.js for theme configuration

## 🚀 Future Enhancements

### Potential Improvements
1. **Real API Integration**: Replace dummy data with actual backend
2. **Advanced Filtering**: Date range, project filters
3. **Data Visualization**: Charts and graphs for reports
4. **Export Options**: PDF, Excel file exports
5. **User Management**: Admin can manage users
6. **Notifications**: Real-time updates and alerts
7. **Mobile App**: React Native version
8. **Offline Support**: PWA capabilities

### Technical Debt
1. **Type Safety**: More specific TypeScript interfaces
2. **Error Handling**: Comprehensive error boundaries
3. **Testing**: Unit and integration tests
4. **Performance**: Code splitting and lazy loading
5. **Accessibility**: ARIA labels and keyboard navigation

## 📚 Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "react-hot-toast": "^2.4.0",
  "lucide-react": "^0.263.1"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.0.28",
  "@types/react-dom": "^18.0.11",
  "@types/react-router-dom": "^5.3.3",
  "tailwindcss": "^3.2.7",
  "typescript": "^4.9.5"
}
```

## 🤝 Contributing

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow React best practices
- **Prettier**: Consistent code formatting
- **Naming**: PascalCase for components, camelCase for functions

### Git Workflow
1. Create feature branch from main
2. Make changes with descriptive commits
3. Test thoroughly
4. Create pull request with detailed description

## 📞 Support

### Getting Help
- **Documentation**: This file and inline code comments
- **Console Logs**: Debug information available in browser console
- **Component Props**: Check TypeScript interfaces for required props

### Troubleshooting
1. **Check Console**: Look for error messages and debug logs
2. **Verify Data**: Ensure sample data matches expected format
3. **Clear Storage**: Clear localStorage if authentication issues persist
4. **Restart Dev Server**: Sometimes fixes hot reload issues

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
