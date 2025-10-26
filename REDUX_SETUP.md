# Redux Toolkit Setup Documentation

This document explains the Redux Toolkit setup for the Timesheet Frontend application.

## Project Structure

```
src/
├── services/                 # Redux services and store
│   ├── auth/                # Authentication service
│   │   ├── auth.service.ts  # Auth API calls
│   │   └── auth.slice.ts    # Auth Redux slice
│   ├── projects/            # Projects service
│   │   └── projects.service.ts
│   ├── employees/           # Employees service
│   │   └── employees.service.ts
│   ├── timesheet/           # Timesheet service
│   │   └── timesheet.service.ts
│   ├── store.ts             # Redux store configuration
│   ├── hooks.ts             # Typed Redux hooks
│   └── index.ts             # Service exports
├── types/                   # TypeScript type definitions
│   ├── user.types.ts        # User and auth types
│   ├── projects.types.ts    # Project types
│   ├── task.types.ts        # Task types
│   ├── employee.types.ts    # Employee types
│   ├── timesheet.types.ts   # Timesheet types
│   └── index.ts             # Type exports
└── config/
    ├── axios.ts             # Axios configuration
    └── constants.ts          # App constants
```

## Features

### ✅ Implemented
- Redux Toolkit store configuration
- TypeScript type definitions for all entities
- Auth service with login API integration
- Axios interceptors for authentication
- Typed Redux hooks
- Environment configuration for local/production

### 🔄 Ready for Implementation
- Project management service
- Employee management service
- Timesheet service
- Redux slices for all services

## Usage Examples

### Using Auth Service

```typescript
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { loginUser, logoutUser } from '../services/auth/auth.slice';

const LoginComponent = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      // Login successful
      console.log('User logged in:', result.payload.user);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    // Your component JSX
  );
};
```

### Using Other Services

```typescript
import { projectService } from '../services';

// Get all projects
const projects = await projectService.getProjects(1, 10);

// Create a new project
const newProject = await projectService.createProject({
  name: 'New Project',
  description: 'Project description',
  startDate: '2024-01-01',
  managerId: 'manager-id'
});
```

## API Configuration

### Backend URL
- **Local Development**: `http://localhost:4100/api`
- **Production**: Set via `REACT_APP_API_BASE_URL` environment variable

### Environment Variables
Create a `.env.local` file with:
```env
REACT_APP_API_BASE_URL=http://localhost:4100/api
REACT_APP_API_TIMEOUT=10000
```

## Authentication Flow

1. User submits login form
2. `loginUser` thunk is dispatched
3. Auth service makes API call to `/auth/login`
4. On success, user data and token are stored in Redux state and localStorage
5. Axios interceptor automatically adds token to subsequent requests
6. On 401 errors, user is automatically logged out

## Type Safety

All services and Redux slices are fully typed with TypeScript:

```typescript
// Strongly typed state
const authState: AuthState = {
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
};

// Strongly typed API responses
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

## Next Steps

1. **Implement Redux Slices**: Create slices for projects, employees, and timesheet
2. **Add Error Handling**: Implement global error handling middleware
3. **Add Persistence**: Consider adding Redux Persist for state persistence
4. **Add Caching**: Implement RTK Query for better API caching
5. **Add Tests**: Write unit tests for services and slices

## Available Services

- `authService`: Authentication operations
- `projectService`: Project CRUD operations
- `employeeService`: Employee CRUD operations
- `timesheetService`: Timesheet CRUD operations

All services follow the same pattern:
- Consistent error handling
- TypeScript type safety
- Axios integration
- Standardized API response format
