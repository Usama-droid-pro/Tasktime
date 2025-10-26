import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cn } from '../../utils/helpers';
import { 
  Clock, 
  BarChart3, 
  FolderOpen,
  Users,
  Settings, 
  LogOut
} from 'lucide-react';
import { RootState } from '../../services/store';
import { AuthState } from '../../types';
import { logoutUser } from '../../services/auth/auth.slice';
import { useAppDispatch } from '../../services/hooks';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  children?: NavItem[];
  onClick?: () => void;
}

export interface SideNavbarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

const SideNavbar: React.FC<SideNavbarProps> = ({
  isCollapsed = false,
  onToggle,
  className,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const authState = useSelector((state: RootState) => state.auth) as AuthState;
  const { user } = authState;
  const navItems: NavItem[] = [
    {
      id: 'log-task',
      label: 'Log Task',
      icon: <Clock className="w-5 h-5" />,
      href: '/log-task',
    },
    {
      id: 'report',
      label: 'Report',
      icon: <BarChart3 className="w-5 h-5" />,
      href: '/report',
    },
    // Only show Projects and Employees for Admin users
    // ...(user?.role === 'Admin' ? [
    //   {
    //     id: 'projects',
    //     label: 'Projects',
    //     icon: <FolderOpen className="w-5 h-5" />,
    //     href: '/projects',
    //   },
    //   {
    //     id: 'employees',
    //     label: 'Employees',
    //     icon: <Users className="w-5 h-5" />,
    //     href: '/employees',
    //   }
    // ] : []),
  ];

  const bottomNavItems: NavItem[] = [
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOut className="w-5 h-5" />,
      href: '#',
      onClick: () => {
        dispatch(logoutUser());
        navigate('/login');
      },
    },
  ];

  const renderNavItem = (item: NavItem) => (
    <button
      key={item.id}
      onClick={() => {
        if (item.onClick) {
          item.onClick();
        } else if (item.href && item.href !== '#') {
          navigate(item.href);
        }
      }}
      className={cn(
        'flex items-center px-excel-xl py-excel-lg text-excel-base font-medium text-excel-text-primary hover:bg-excel-hover transition-colors duration-150 relative w-full text-left',
        isCollapsed && 'justify-center px-excel-lg',
        location.pathname === item.href && 'bg-excel-blue-50 text-excel-blue-600'
      )}
    >
      <span className={cn('flex-shrink-0', !isCollapsed && 'mr-excel-md')}>
        {item.icon}
      </span>
      
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && item.badge > 0 && (
            <span className="bg-excel-blue-500 text-white text-excel-sm rounded-full px-excel-md py-excel-xs min-w-[24px] text-center">
              {item.badge}
            </span>
          )}
        </>
      )}
      
      {isCollapsed && item.badge && item.badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-excel-blue-500 text-white text-excel-sm rounded-full w-6 h-6 flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </button>
  );

  return (
    <div className={cn('sidebar-excel w-64 flex flex-col', isCollapsed && 'w-16', className)}>
      {/* Header */}
      <div className="p-excel-xl border-b border-excel-border">
        <div className={cn('flex items-center', isCollapsed && 'justify-center')}>
          <div className="w-10 h-10 bg-excel-blue-500 rounded-excel flex items-center justify-center">
            <span className="text-white font-bold text-excel-base">O</span>
          </div>
          {!isCollapsed && (
            <div className="ml-excel-lg">
              <h1 className="text-excel-xl font-semibold text-excel-text-primary">OBS Task Manager</h1>
              <p className="text-excel-sm text-excel-text-muted">Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-excel-xl">
        <div className="space-y-excel-sm">
          {navItems.map(renderNavItem)}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-excel-border py-excel-xl">
        <div className="space-y-excel-sm">
          {bottomNavItems.map(renderNavItem)}
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
