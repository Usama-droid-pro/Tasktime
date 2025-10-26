import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { cn } from '../utils/helpers';
import { Download, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { reportsService, GrandReportData } from '../services/reports/reports.service';

interface ReportData {
  project: string;
  totalHours: number;
  PM: number;
  QA: number;
  DEV: number;
  DESIGN: number;
}

const Report: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  
  // API state management
  const [apiReportData, setApiReportData] = useState<GrandReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch report data from API
  const fetchReportData = async (month: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert YYYY-MM to date range (first and last day of the month)
      const [year, monthNum] = month.split('-');
      const firstDay = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const lastDay = new Date(parseInt(year), parseInt(monthNum), 0);
      
      // Format dates without timezone conversion
      const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };
      
      const startDate = formatDate(firstDay);
      const endDate = formatDate(lastDay);
      
      console.log(`Fetching report for ${month}: ${startDate} to ${endDate}`);
      
      const response = await reportsService.getGrandReport(startDate, endDate);
      setApiReportData(response.data);
      console.log('Report data fetched:', response.data);
    } catch (err) {
      console.error('Failed to fetch report data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch report data');
      setApiReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate month options for the last 12 months
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    
    return options;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchReportData(selectedMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch data when month changes
  useEffect(() => {
    fetchReportData(selectedMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  // Process API data to match the existing ReportData format
  const reportData = apiReportData ? apiReportData.projects.map(project => ({
    project: project.project,
    totalHours: project.totalHours,
    PM: project.PM,
    QA: project.QA,
    DEV: project.DEV,
    DESIGN: project.DESIGN,
  })) : [];

  // Calculate summary totals
  const summaryTotals = apiReportData 
    ? apiReportData.totals 
    : reportData.reduce(
        (totals, row) => ({
          totalHours: totals.totalHours + row.totalHours,
          PM: totals.PM + row.PM,
          QA: totals.QA + row.QA,
          DEV: totals.DEV + row.DEV,
          DESIGN: totals.DESIGN + row.DESIGN,
        }),
        { totalHours: 0, PM: 0, QA: 0, DEV: 0, DESIGN: 0 }
      );

  // Generate column headers (A, B, C, D, E, F, G)
  const columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const totalColumns = 7; // Project, Total Hours, PM, QA, DEV, DESIGN, (empty for Excel feel)

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['Project', 'Total Hours', 'PM', 'QA', 'DEV', 'DESIGN'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => [
        `"${row.project}"`,
        row.totalHours,
        row.PM,
        row.QA,
        row.DEV,
        row.DESIGN,
      ].join(',')),
      // Add summary row
      [
        '"TOTAL"',
        summaryTotals.totalHours,
        summaryTotals.PM,
        summaryTotals.QA,
        summaryTotals.DEV,
        summaryTotals.DESIGN,
      ].join(',')
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `report_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout title="Reports" subtitle="Project hours and team performance">
      <div className="space-y-excel-xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-excel-md">
            <div>
              <h2 className="text-excel-xl font-semibold text-excel-text-primary">
                Project Reports
              </h2>
              <p className="text-excel-sm text-excel-text-muted mt-excel-xs">
                Monthly project hours and team allocation
              </p>
            </div>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center space-x-excel-xs text-excel-sm text-excel-text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </div>
            )}
            
            {/* Error indicator */}
            {error && (
              <div className="flex items-center space-x-excel-xs text-excel-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>Error loading data</span>
              </div>
            )}
            
       
          </div>
          
          <div className="flex items-center space-x-excel-lg">
            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => fetchReportData(selectedMonth)}
              disabled={isLoading}
            >
              Refresh
            </Button>
            
            <Select
              label=""
              options={generateMonthOptions()}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-48"
              disabled={isLoading}
            />
            <Button 
              leftIcon={<Download className="w-4 h-4" />} 
              onClick={exportToExcel}
              disabled={isLoading}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Excel-like Report Table */}
        <div className="bg-white border border-excel-border rounded-excel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Column Headers */}
              <thead>
                {/* Excel Column Letters Row */}
                <tr className="bg-excel-gray-100 border-b border-excel-border">
                  <th className="w-12 h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted"></th>
                  {columnHeaders.map((col, index) => (
                    <th
                      key={col}
                      className={cn(
                        'h-6 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center',
                        index === 0 && 'w-48', // Project column
                        index === 1 && 'w-24', // Total Hours column
                        index > 1 && 'w-20' // Role columns
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
                {/* Column Names Row */}
                <tr className="bg-excel-header border-b border-excel-border">
                  <th className="w-12 h-8 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted"></th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-left">
                    Project
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    Total Hours
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    PM
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    QA
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    DEV
                  </th>
                  <th className="h-8 px-excel-md border-r border-excel-border bg-excel-header text-excel-sm font-medium text-white text-center">
                    DESIGN
                  </th>
                </tr>
              </thead>

              {/* Data Rows */}
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="h-16 px-excel-md py-excel-sm text-center text-excel-sm text-excel-text-muted bg-excel-gray-50">
                      <div className="flex items-center justify-center space-x-excel-md">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading report data...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="h-16 px-excel-md py-excel-sm text-center text-excel-sm text-red-600 bg-red-50">
                      <div className="flex items-center justify-center space-x-excel-md">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                        <button
                          onClick={() => fetchReportData(selectedMonth)}
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="h-16 px-excel-md py-excel-sm text-center text-excel-sm text-excel-text-muted bg-excel-gray-50">
                      No report data available for the selected period.
                    </td>
                  </tr>
                ) : (
                  reportData.map((row, rowIndex) => (
                  <tr key={row.project} className="hover:bg-excel-hover border-b border-excel-border">
                    {/* Row Number */}
                    <td className="w-12 h-8 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center">
                      {rowIndex + 1}
                    </td>
                    
                    {/* Project */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary font-medium">
                      {row.project}
                    </td>
                    
                    {/* Total Hours */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary text-center">
                      {row.totalHours}
                    </td>
                    
                    {/* PM Hours */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary text-center">
                      {row.PM || '-'}
                    </td>
                    
                    {/* QA Hours */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary text-center">
                      {row.QA || '-'}
                    </td>
                    
                    {/* DEV Hours */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary text-center">
                      {row.DEV || '-'}
                    </td>
                    
                    {/* DESIGN Hours */}
                    <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-white text-excel-sm text-excel-text-primary text-center">
                      {row.DESIGN || '-'}
                    </td>
                  </tr>
                  ))
                )}
                
                {/* Summary Row */}
                {!isLoading && !error && reportData.length > 0 && (
                <tr className="bg-excel-gray-100 border-t-2 border-excel-border font-semibold">
                  {/* Row Number */}
                  <td className="w-12 h-8 border-r border-excel-border bg-excel-gray-200 text-excel-xs font-medium text-excel-text-muted text-center">
                    {reportData.length + 1}
                  </td>
                  
                  {/* Project */}
                  <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-excel-gray-100 text-excel-sm text-excel-text-primary font-bold">
                    TOTAL
                  </td>
                  
                  {/* Total Hours */}
                  <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-excel-gray-100 text-excel-sm text-excel-text-primary text-center font-bold">
                    {summaryTotals.totalHours}
                  </td>
                  
                  {/* PM Hours */}
                  <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-excel-gray-100 text-excel-sm text-excel-text-primary text-center font-bold">
                    {summaryTotals.PM || '-'}
                  </td>
                  
                  {/* QA Hours */}
                  <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-excel-gray-100 text-excel-sm text-excel-text-primary text-center font-bold">
                    {summaryTotals.QA || '-'}
                  </td>
                  
                  {/* DEV Hours */}
                  <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-excel-gray-100 text-excel-sm text-excel-text-primary text-center font-bold">
                    {summaryTotals.DEV || '-'}
                  </td>
                  
                  {/* DESIGN Hours */}
                  <td className="h-8 px-excel-md py-excel-sm border-r border-excel-border bg-excel-gray-100 text-excel-sm text-excel-text-primary text-center font-bold">
                    {summaryTotals.DESIGN || '-'}
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>

      
        </div>

        {/* Summary Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-excel-xl">
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h3 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-sm">
              Total Projects
            </h3>
            <p className="text-excel-2xl font-bold text-excel-blue-500">
              {reportData.length}
            </p>
          </div>
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h3 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-sm">
              Total Hours
            </h3>
            <p className="text-excel-2xl font-bold text-green-500">
              {reportData.reduce((sum, row) => sum + row.totalHours, 0)}
            </p>
          </div>
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h3 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-sm">
              Active Projects
            </h3>
            <p className="text-excel-2xl font-bold text-orange-500">
              {reportData.filter(row => row.totalHours > 0).length}
            </p>
          </div>
          <div className="bg-white border border-excel-border rounded-excel p-excel-xl">
            <h3 className="text-excel-lg font-semibold text-excel-text-primary mb-excel-sm">
              Month
            </h3>
            <p className="text-excel-lg font-bold text-excel-text-muted">
              {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default Report;
