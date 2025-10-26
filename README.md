# OBS Task Manager

A Microsoft Excel-inspired task management dashboard built with React, TypeScript, and Tailwind CSS.

## 🎨 Design System

This project implements a comprehensive Microsoft Excel-inspired design system featuring:

- **Excel Color Palette**: Authentic Microsoft Excel colors and styling
- **Typography**: Segoe UI font family matching Excel's interface
- **Components**: Excel-like buttons, inputs, tables, and layouts
- **Hover Effects**: Subtle transitions and hover states
- **Spacing**: Excel-specific spacing system (2px, 4px, 8px, 12px, 16px, 24px)

## 🚀 Features

- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Excel-like UI Components**: Buttons, inputs, selects, alerts, loaders
- ✅ **Collapsible Sidebar**: Navigation with badge notifications
- ✅ **Dashboard Layout**: Header with search, notifications, and user menu
- ✅ **Toast Notifications**: Excel-styled notifications with react-hot-toast
- ✅ **TypeScript Support**: Full type safety throughout the application
- ✅ **Mock Data**: Sample users, tasks, and departments for development

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS v3** with custom Excel theme
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** for HTTP requests
- **Create React App** for build tooling

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Alert.tsx
│   │   └── Loader.tsx
│   ├── layouts/            # Layout components
│   │   ├── SideNavbar.tsx
│   │   └── DashboardLayout.tsx
│   └── index.ts           # Component exports
├── pages/                 # Page components
│   └── Dashboard.tsx
├── config/                # Configuration files
│   ├── axios.ts          # Axios instance
│   └── constants.ts      # App constants
├── utils/                # Utility functions
│   └── helpers.ts
├── constants/            # Data constants
│   └── usersdata.ts
└── App.tsx
```

## 🎯 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd obs-task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎨 Component Usage

### Button Component
```tsx
import { Button } from './components';

<Button variant="primary" size="md" leftIcon={<Plus />}>
  Add Task
</Button>
```

### Input Component
```tsx
import { Input } from './components';

<Input
  label="Task Title"
  placeholder="Enter task title..."
  error="Please enter a valid title"
/>
```

### Select Component
```tsx
import { Select } from './components';

<Select
  label="Status"
  options={TASK_STATUS_OPTIONS}
  placeholder="Select status..."
/>
```

### Alert Component
```tsx
import { Alert } from './components';

<Alert
  type="success"
  title="Success!"
  message="Task created successfully"
  dismissible
/>
```

## 🎨 Theme Customization

The Excel theme is defined in `tailwind.config.js` and `src/index.css`. Key features:

- **Colors**: Excel blue (#0078D4), header blue (#2F5597), and gray palette
- **Typography**: Segoe UI font family with Excel-specific sizes
- **Spacing**: Excel spacing system
- **Components**: Pre-built Excel-like component classes

## 📱 Responsive Design

The dashboard is fully responsive with:
- Collapsible sidebar for mobile devices
- Responsive grid layouts
- Mobile-optimized form elements
- Touch-friendly button sizes

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```env
REACT_APP_API_BASE_URL=http://localhost:3500/api
REACT_APP_API_TIMEOUT=10000
REACT_APP_APP_NAME=OBS Task Manager
REACT_APP_VERSION=1.0.0
```

### Axios Configuration

The Axios instance is configured in `src/config/axios.ts` with:
- Automatic token attachment
- Request/response interceptors
- Error handling
- Timeout configuration

## 🧪 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Type Checking

```bash
npx tsc --noEmit
```

## 📋 Next Steps

1. **Routing**: Implement React Router for navigation
2. **State Management**: Add Redux Toolkit or Zustand
3. **API Integration**: Connect to backend APIs
4. **Authentication**: Implement login/logout functionality
5. **Task Management**: Build task CRUD operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Microsoft Excel for design inspiration
- Tailwind CSS for the utility-first CSS framework
- Lucide React for beautiful icons
- React Hot Toast for elegant notifications# Tasktime
