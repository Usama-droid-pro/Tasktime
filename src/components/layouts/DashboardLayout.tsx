import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { cn } from '../../utils/helpers';
import SideNavbar from './SideNavbar';
import { Menu, Search, Bell, User } from 'lucide-react';
import { RootState } from '../../services/store';
import { AuthState } from '../../types';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  className,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const authState = useSelector((state: RootState) => state.auth) as AuthState;
  const { user } = authState;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-excel-background flex">
      {/* Sidebar */}
      <SideNavbar 
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-excel-border px-excel-2xl py-excel-xl flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-excel-sm hover:bg-excel-hover rounded-excel transition-colors duration-150 mr-excel-md"
            >
              <Menu className="w-5 h-5 text-excel-text-primary" />
            </button>
            
            <div>
              {title && (
                <h1 className="text-excel-2xl font-semibold text-excel-text-primary">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-excel-base text-excel-text-muted">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-excel-xl">
            {/* Search */}
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-excel-text-muted" />
              <input
                type="text"
                placeholder="Search..."
                className="input-excel pl-10 pr-4 w-64"
              />
            </div> */}

            {/* Notifications */}
            {/* <button className="relative p-excel-sm hover:bg-excel-hover rounded-excel transition-colors duration-150">
              <Bell className="w-5 h-5 text-excel-text-primary" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-excel-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button> */}

            {/* User Menu */}
            <div className="flex items-center space-x-excel-lg">
              <div className="w-10 h-10 bg-excel-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-excel-base font-medium text-excel-text-primary">{user?.name || 'User'}</p>
                <p className="text-excel-sm text-excel-text-muted">{user?.role || 'User'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={cn('flex-1 p-excel-2xl', className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
