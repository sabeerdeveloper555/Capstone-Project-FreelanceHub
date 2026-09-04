import API from './api';

/**
 * Fetch comprehensive dashboard analytics for the authenticated freelancer.
 * The backend returns: { success: true, dashboard: { statistics, projectStatus, deadlineStats, recentProjects } }
 *
 * @returns {Promise<{ statistics, projectStatus, deadlineStats, recentProjects }>}
 */
export const getDashboardData = async () => {
  const response = await API.get('/dashboard');
  // Unwrap the `dashboard` wrapper from the backend response
  return response.data.dashboard;
};
