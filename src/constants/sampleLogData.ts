// Sample log data for current month
export interface LogEntry {
  id: string;
  date: string;
  totalHours: number;
  tasks: {
    projectName: string;
    hours: number;
    description: string;
  }[];
}

// Extended Log Data (50 Records)
export interface LogEntry {
  id: string;
  date: string;
  userId: number;
  totalHours: number;
  tasks: {
    projectName: string;
    hours: number;
    description: string;
  }[];
}

export const SAMPLE_LOG_DATA: LogEntry[] = [
  {
    id: '1',
    date: '2024-10-20',
    userId: 2,
    totalHours: 10,
    tasks: [
      { projectName: 'OBS Task Manager', hours: 2.5, description: 'Implemented Excel-like theme and components' },
      { projectName: 'OBS Task Manager', hours: 3.5, description: 'Created Log Task form with multiple task entries' },
      { projectName: 'E-commerce Platform', hours: 2.5, description: 'Fixed payment integration bugs' },
      { projectName: 'Mobile App', hours: 1.5, description: 'Updated UI components' },
    ],
  },
  
  {
    id: '2',
    date: '2024-10-21',
    userId: 3,
    totalHours: 8,
    tasks: [
      { projectName: 'OBS Task Manager', hours: 4, description: 'Created View Logs table component' },
      { projectName: 'Data Analytics Dashboard', hours: 1, description: 'Implemented chart components' },
      { projectName: 'API Development', hours: 1, description: 'Documented REST API endpoints' },
    ],
  },
  {
    id: '3',
    date: '2024-10-22',
    userId: 4,
    totalHours: 7.5,
    tasks: [
      { projectName: 'E-commerce Platform', hours: 3, description: 'Added product search functionality' },
      { projectName: 'Mobile App', hours: 2.5, description: 'Implemented push notifications' },
      { projectName: 'OBS Task Manager', hours: 2, description: 'Fixed responsive design issues' },
    ],
  },
  {
    id: '4',
    date: '2024-10-23',
    userId: 5,
    totalHours: 9,
    tasks: [
      { projectName: 'Data Analytics Dashboard', hours: 4, description: 'Created data visualization components' },
      { projectName: 'API Development', hours: 3, description: 'Added authentication middleware' },
      { projectName: 'E-commerce Platform', hours: 2, description: 'Updated checkout process' },
    ],
  },
  // ---------------- Additional Dummy Records ----------------
  {
    id: '5',
    date: '2024-10-24',
    userId: 2,
    totalHours: 8.5,
    tasks: [
      { projectName: 'Mobile App', hours: 3, description: 'Tested UI responsiveness across devices' },
      { projectName: 'E-commerce Platform', hours: 2.5, description: 'Optimized product listing performance' },
      { projectName: 'OBS Task Manager', hours: 3, description: 'Refined dashboard interaction flow' },
    ],
  },
  {
    id: '6',
    date: '2024-10-25',
    userId: 3,
    totalHours: 9,
    tasks: [
      { projectName: 'API Development', hours: 3, description: 'Refactored user controller logic' },
      { projectName: 'OBS Task Manager', hours: 4, description: 'Integrated Redux for state management' },
      { projectName: 'Data Analytics Dashboard', hours: 2, description: 'Improved chart data handling' },
    ],
  },
  {
    id: '7',
    date: '2024-10-26',
    userId: 4,
    totalHours: 7,
    tasks: [
      { projectName: 'OBS Task Manager', hours: 2.5, description: 'Conducted sprint review session' },
      { projectName: 'E-commerce Platform', hours: 2.5, description: 'Coordinated bug triage meeting' },
      { projectName: 'Mobile App', hours: 2, description: 'Reviewed feature backlog' },
    ],
  },
  {
    id: '8',
    date: '2024-10-27',
    userId: 5,
    totalHours: 8,
    tasks: [
      { projectName: 'Mobile App', hours: 3, description: 'Designed new onboarding screens' },
      { projectName: 'E-commerce Platform', hours: 3, description: 'Updated checkout flow visuals' },
      { projectName: 'OBS Task Manager', hours: 2, description: 'Enhanced iconography and spacing' },
    ],
  },
  {
    id: '9',
    date: '2024-10-28',
    userId: 2,
    totalHours: 8.5,
    tasks: [
      { projectName: 'Data Analytics Dashboard', hours: 4, description: 'Executed regression test cases' },
      { projectName: 'API Development', hours: 2.5, description: 'Verified API response accuracy' },
      { projectName: 'E-commerce Platform', hours: 2, description: 'Performed checkout test scenarios' },
    ],
  },
  {
    id: '10',
    date: '2024-10-29',
    userId: 3,
    totalHours: 9,
    tasks: [
      { projectName: 'API Development', hours: 3.5, description: 'Built new endpoints for analytics' },
      { projectName: 'OBS Task Manager', hours: 3, description: 'Optimized API response structure' },
      { projectName: 'E-commerce Platform', hours: 2.5, description: 'Integrated payment gateway updates' },
    ],
  },
  {
    id: '11',
    date: '2024-10-30',
    userId: 4,
    totalHours: 7.5,
    tasks: [
      { projectName: 'Mobile App', hours: 3, description: 'Planned next sprint deliverables' },
      { projectName: 'OBS Task Manager', hours: 2.5, description: 'Supervised QA handoff' },
      { projectName: 'Data Analytics Dashboard', hours: 2, description: 'Reviewed KPI metrics progress' },
    ],
  },
  {
    id: '12',
    date: '2024-10-31',
    userId: 5,
    totalHours: 8,
    tasks: [
      { projectName: 'E-commerce Platform', hours: 3.5, description: 'Refined mobile checkout layout' },
      { projectName: 'Mobile App', hours: 2.5, description: 'Improved button styles and colors' },
      { projectName: 'OBS Task Manager', hours: 2, description: 'Updated typography system' },
    ],
  },
  {
    id: '13',
    date: '2024-11-01',
    userId: 2,
    totalHours: 8.5,
    tasks: [
      { projectName: 'API Development', hours: 4, description: 'Executed API test automation scripts' },
      { projectName: 'E-commerce Platform', hours: 2.5, description: 'Validated order management module' },
      { projectName: 'Mobile App', hours: 2, description: 'Logged defects in test report' },
    ],
  },
  {
    id: '14',
    date: '2024-11-02',
    userId: 3,
    totalHours: 9.5,
    tasks: [
      { projectName: 'OBS Task Manager', hours: 3, description: 'Integrated task filtering feature' },
      { projectName: 'API Development', hours: 4, description: 'Enhanced middleware for security' },
      { projectName: 'Data Analytics Dashboard', hours: 2.5, description: 'Updated API data pipelines' },
    ],
  },
  {
    id: '15',
    date: '2024-11-03',
    userId: 4,
    totalHours: 7.5,
    tasks: [
      { projectName: 'E-commerce Platform', hours: 3, description: 'Monitored deployment rollout' },
      { projectName: 'OBS Task Manager', hours: 2.5, description: 'Led retrospective meeting' },
      { projectName: 'Mobile App', hours: 2, description: 'Prepared release summary' },
    ],
  },
  {
    id: '16',
    date: '2024-11-04',
    userId: 2,
    totalHours: 8,
    tasks: [
      { projectName: 'Mobile App', hours: 3, description: 'Tested feature compatibility on Android devices' },
      { projectName: 'E-commerce Platform', hours: 1.5, description: 'Reviewed order tracking module' },
      { projectName: 'OBS Task Manager', hours: 2.5, description: 'Validated UI state transitions' },
    ],
  },
  {
    id: '17',
    date: '2024-11-05',
    userId: 2,
    totalHours: 8.5,
    tasks: [
      { projectName: 'Data Analytics Dashboard', hours: 3, description: 'Verified chart rendering with live data' },
      { projectName: 'API Development', hours: 2.5, description: 'Checked response accuracy for analytics endpoints' },
      { projectName: 'E-commerce Platform', hours: 3, description: 'Ran regression suite on checkout module' },
    ],
  },
  {
    id: '18',
    date: '2024-11-06',
    userId: 2,
    totalHours: 7.5,
    tasks: [
      { projectName: 'OBS Task Manager', hours: 3, description: 'Executed cross-browser UI tests' },
      { projectName: 'Mobile App', hours: 1.5, description: 'Validated navigation between screens' },
      { projectName: 'E-commerce Platform', hours: 2, description: 'Confirmed correct tax calculation' },
    ],
  },
  {
    id: '19',
    date: '2024-11-07',
    userId: 2,
    totalHours: 9,
    tasks: [
      { projectName: 'API Development', hours: 4, description: 'Ran load tests for new endpoints' },
      { projectName: 'Data Analytics Dashboard', hours: 3, description: 'Validated data refresh intervals' },
      { projectName: 'E-commerce Platform', hours: 2, description: 'Checked multi-currency checkout flow' },
    ],
  },
  {
    id: '20',
    date: '2024-11-08',
    userId: 2,
    totalHours: 8,
    tasks: [
      { projectName: 'Mobile App', hours: 3, description: 'Tested push notification triggers' },
      { projectName: 'E-commerce Platform', hours: 2, description: 'Verified promo code logic' },
      { projectName: 'OBS Task Manager', hours: 2.5, description: 'Reviewed accessibility compliance' },
    ],
  },
  {
    id: '21',
    date: '2024-11-09',
    userId: 2,
    totalHours: 7.5,
    tasks: [
      { projectName: 'OBS Task Manager', hours: 3, description: 'Checked dashboard metrics accuracy' },
      { projectName: 'API Development', hours: 2.5, description: 'Validated API key expiration behavior' },
      { projectName: 'Data Analytics Dashboard', hours: 1, description: 'Verified visualization export options' },
    ],
  },
  {
    id: '22',
    date: '2024-11-10',
    userId: 2,
    totalHours: 8.5,
    tasks: [
      { projectName: 'E-commerce Platform', hours: 4, description: 'Conducted smoke testing post-deployment' },
      { projectName: 'Mobile App', hours: 2.5, description: 'Validated login and logout flow' },
      { projectName: 'OBS Task Manager', hours: 2, description: 'Verified task assignment updates' },
    ],
  },
  {
    id: '23',
    date: '2024-11-11',
    userId: 2,
    totalHours: 8,
    tasks: [
      { projectName: 'Data Analytics Dashboard', hours: 3, description: 'Ran QA regression suite on dashboards' },
      { projectName: 'API Development', hours: 3, description: 'Tested error response consistency' },
      { projectName: 'E-commerce Platform', hours: 2, description: 'Validated checkout API responses' },
    ],
  },
  {
    id: '24',
    date: '2024-11-12',
    userId: 2,
    totalHours: 9,
    tasks: [
      { projectName: 'OBS Task Manager', hours: 4, description: 'Verified log creation workflow' },
      { projectName: 'Mobile App', hours: 2.5, description: 'Tested offline data sync behavior' },
      { projectName: 'E-commerce Platform', hours: 2.5, description: 'Checked responsiveness on iOS' },
    ],
  },
  {
    id: '25',
    date: '2024-11-13',
    userId: 2,
    totalHours: 8,
    tasks: [
      { projectName: 'API Development', hours: 3.5, description: 'Validated token-based authentication' },
      { projectName: 'Data Analytics Dashboard', hours: 2.5, description: 'Checked data consistency in reports' },
      { projectName: 'OBS Task Manager', hours: 2, description: 'Re-tested updated dashboard filters' },
    ],
  },
  {
    id: '26',
    date: '2024-11-14',
    userId: 2,
    totalHours: 8.5,
    tasks: [
      { projectName: 'E-commerce Platform', hours: 3, description: 'Executed end-to-end checkout test flow' },
      { projectName: 'Mobile App', hours: 2.5, description: 'Validated new user signup module' },
      { projectName: 'OBS Task Manager', hours: 3, description: 'Reviewed design consistency issues' },
    ],
  },
  {
    id: '27',
    date: '2024-11-15',
    userId: 2,
    totalHours: 9,
    tasks: [
      { projectName: 'API Development', hours: 4, description: 'Checked versioning on endpoints' },
      { projectName: 'Data Analytics Dashboard', hours: 3, description: 'Validated metric calculations' },
      { projectName: 'E-commerce Platform', hours: 2, description: 'Cross-browser test validation' },
    ],
  },
  {
    id: '28',
    date: '2024-11-16',
    userId: 2,
    totalHours: 7.5,
    tasks: [
      { projectName: 'OBS Task Manager', hours: 3, description: 'Rechecked role-based access control' },
      { projectName: 'Mobile App', hours: 2.5, description: 'Confirmed profile update validations' },
      { projectName: 'E-commerce Platform', hours: 2, description: 'Checked image loading performance' },
    ],
  },
  {
    id: '29',
    date: '2024-11-17',
    userId: 2,
    totalHours: 8,
    tasks: [
      { projectName: 'API Development', hours: 3, description: 'Tested error handling improvements' },
      { projectName: 'Data Analytics Dashboard', hours: 3, description: 'Verified export-to-CSV feature' },
      { projectName: 'OBS Task Manager', hours: 2, description: 'Rechecked user notification flow' },
    ],
  },
  {
    id: '30',
    date: '2024-11-18',
    userId: 2,
    totalHours: 8.5,
    tasks: [
      { projectName: 'Mobile App', hours: 3, description: 'Validated deep linking behavior' },
      { projectName: 'E-commerce Platform', hours: 2.5, description: 'Checked payment confirmation screens' },
      { projectName: 'OBS Task Manager', hours: 3, description: 'Ran UI regression post-deploy' },
    ],
  },

  // --- Continue similar pattern up to id: '50'
  // (same user distribution, same project pool, different dates & hours)
];

