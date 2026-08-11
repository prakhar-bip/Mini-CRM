import { useState, useEffect, useCallback } from 'react';
import type { DashboardOverviewData } from '../types/dashboard.types';
import { fetchDashboardOverview } from '../services/dashboardService';

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardOverview();
      setData(result);
    } catch (err: any) {
      setError('Unable to load dashboard overview data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    retry: loadData,
  };
};
