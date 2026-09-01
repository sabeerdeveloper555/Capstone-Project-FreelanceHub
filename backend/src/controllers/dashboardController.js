import mongoose from 'mongoose';
import { Project, Client } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * @desc    Get comprehensive dashboard overview statistics for authenticated freelancer
 * @route   GET /api/dashboard
 * @access  Private (Freelancer only)
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // 1. Client counts (Total and Added in last 30 days)
  const [totalClients, recentClientsCount] = await Promise.all([
    Client.countDocuments({ owner: userId }),
    Client.countDocuments({ owner: userId, createdAt: { $gte: thirtyDaysAgo } })
  ]);

  // 2. Project Status & Financial Aggregation Pipeline
  const projectAggregates = await Project.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $facet: {
        financials: [
          {
            $group: {
              _id: null,
              totalProjects: { $sum: 1 },
              totalBudget: { $sum: '$budget' },
              averageBudget: { $avg: '$budget' },
              completedBudget: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Completed'] }, '$budget', 0]
                }
              },
              inProgressBudget: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'In Progress'] }, '$budget', 0]
                }
              },
              planningBudget: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Planning'] }, '$budget', 0]
                }
              },
              reviewBudget: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Review'] }, '$budget', 0]
                }
              },
              onHoldBudget: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'On Hold'] }, '$budget', 0]
                }
              }
            }
          }
        ],
        statusCounts: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ],
        deadlineMetrics: [
          {
            $group: {
              _id: null,
              completed: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
                }
              },
              overdue: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $ne: ['$status', 'Completed'] },
                        { $lt: ['$deadline', now] }
                      ]
                    },
                    1,
                    0
                  ]
                }
              },
              dueSoon: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $ne: ['$status', 'Completed'] },
                        { $gte: ['$deadline', now] },
                        { $lte: ['$deadline', sevenDaysFromNow] }
                      ]
                    },
                    1,
                    0
                  ]
                }
              }
            }
          }
        ]
      }
    }
  ]);

  const facetResult = projectAggregates[0] || {};
  const financialData = (facetResult.financials && facetResult.financials[0]) || {
    totalProjects: 0,
    totalBudget: 0,
    averageBudget: 0,
    completedBudget: 0,
    inProgressBudget: 0,
    planningBudget: 0,
    reviewBudget: 0,
    onHoldBudget: 0
  };

  // Map status counts with fallback to 0
  const statusMap = {
    Planning: 0,
    'In Progress': 0,
    Review: 0,
    Completed: 0,
    'On Hold': 0
  };

  if (facetResult.statusCounts) {
    facetResult.statusCounts.forEach((item) => {
      if (statusMap[item._id] !== undefined) {
        statusMap[item._id] = item.count;
      }
    });
  }

  const deadlineData = (facetResult.deadlineMetrics && facetResult.deadlineMetrics[0]) || {
    completed: 0,
    overdue: 0,
    dueSoon: 0
  };

  // 3. Fetch latest 5 recent projects
  const recentProjects = await Project.find({ owner: userId })
    .populate('client', 'name company email phone')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    dashboard: {
      statistics: {
        totalClients,
        recentClientsCount,
        totalProjects: financialData.totalProjects || 0,
        totalBudget: financialData.totalBudget || 0,
        completedBudget: financialData.completedBudget || 0,
        inProgressBudget: financialData.inProgressBudget || 0,
        averageBudget: financialData.averageBudget
          ? Number(financialData.averageBudget.toFixed(2))
          : 0
      },
      projectStatus: statusMap,
      deadlineStats: {
        dueSoon: deadlineData.dueSoon || 0,
        overdue: deadlineData.overdue || 0,
        completed: deadlineData.completed || 0
      },
      recentProjects
    }
  });
});

/**
 * @desc    Get monthly project creation counts for authenticated freelancer
 * @route   GET /api/dashboard/projects/monthly
 * @access  Private (Freelancer only)
 */
export const getMonthlyProjectStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const monthlyStats = await Project.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        month: '$_id',
        count: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: monthlyStats
  });
});

/**
 * @desc    Get project counts grouped by status for authenticated freelancer
 * @route   GET /api/dashboard/projects/status
 * @access  Private (Freelancer only)
 */
export const getProjectStatusStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const statusAgg = await Project.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const allStatuses = ['Planning', 'In Progress', 'Review', 'Completed', 'On Hold'];
  const aggMap = {};
  statusAgg.forEach((item) => {
    aggMap[item._id] = item.count;
  });

  const formattedData = allStatuses.map((status) => ({
    status,
    count: aggMap[status] || 0
  }));

  res.status(200).json({
    success: true,
    data: formattedData
  });
});

/**
 * @desc    Get detailed financial statistics for authenticated freelancer
 * @route   GET /api/dashboard/financials
 * @access  Private (Freelancer only)
 */
export const getFinancialStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const financialAgg = await Project.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalBudget: { $sum: '$budget' },
        averageBudget: { $avg: '$budget' },
        completedBudget: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Completed'] }, '$budget', 0]
          }
        },
        inProgressBudget: {
          $sum: {
            $cond: [{ $eq: ['$status', 'In Progress'] }, '$budget', 0]
          }
        },
        planningBudget: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Planning'] }, '$budget', 0]
          }
        },
        reviewBudget: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Review'] }, '$budget', 0]
          }
        },
        onHoldBudget: {
          $sum: {
            $cond: [{ $eq: ['$status', 'On Hold'] }, '$budget', 0]
          }
        }
      }
    }
  ]);

  const rawData = financialAgg[0] || {
    totalBudget: 0,
    completedBudget: 0,
    inProgressBudget: 0,
    planningBudget: 0,
    reviewBudget: 0,
    onHoldBudget: 0,
    averageBudget: 0
  };

  res.status(200).json({
    success: true,
    data: {
      totalBudget: rawData.totalBudget || 0,
      completedBudget: rawData.completedBudget || 0,
      inProgressBudget: rawData.inProgressBudget || 0,
      planningBudget: rawData.planningBudget || 0,
      reviewBudget: rawData.reviewBudget || 0,
      onHoldBudget: rawData.onHoldBudget || 0,
      averageBudget: rawData.averageBudget
        ? Number(rawData.averageBudget.toFixed(2))
        : 0
    }
  });
});
