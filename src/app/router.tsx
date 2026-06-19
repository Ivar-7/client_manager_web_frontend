import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import AppShell from './layout/AppShell'
import DashboardLayout from './layout/DashboardLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { GuestOnlyRoute } from './routes/GuestOnlyRoute'

const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'))
const OverviewPage = lazy(() => import('../features/overview/pages/OverviewPage'))
const ClientsPage = lazy(() => import('../features/clients/pages/ClientsPage'))
const ClientDetailPage = lazy(() => import('../features/clients/pages/ClientDetailPage'))
const TasksPage = lazy(() => import('../features/tasks/pages/TasksPage'))
const WorkflowPage = lazy(() => import('../features/workflow/pages/WorkflowPage'))
const InfrastructurePage = lazy(() => import('../features/infrastructure/pages/InfrastructurePage'))
const MeetingsPage = lazy(() => import('../features/meetings/pages/MeetingsPage'))
const ActivityPage = lazy(() => import('../features/activity/pages/ActivityPage'))
const AnalyticsPage = lazy(() => import('../features/admin/pages/AnalyticsPage'))
const AutomationsPage = lazy(() => import('../features/admin/pages/AutomationsPage'))
const BillingPage = lazy(() => import('../features/admin/pages/BillingPage'))
const TeamPerformancePage = lazy(() => import('../features/admin/pages/TeamPerformancePage'))
const AuditLogPage = lazy(() => import('../features/admin/pages/AuditLogPage'))

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        element: <GuestOnlyRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/', element: <Navigate to="/overview" replace /> },
              { path: '/overview', element: <OverviewPage /> },
              { path: '/clients', element: <ClientsPage /> },
              { path: '/clients/:clientId', element: <ClientDetailPage /> },
              { path: '/tasks', element: <TasksPage /> },
              { path: '/workflow', element: <WorkflowPage /> },
              { path: '/infrastructure', element: <InfrastructurePage /> },
              { path: '/meetings', element: <MeetingsPage /> },
              { path: '/activity', element: <ActivityPage /> },
              { path: '/admin/analytics', element: <AnalyticsPage /> },
              { path: '/admin/automations', element: <AutomationsPage /> },
              { path: '/admin/billing', element: <BillingPage /> },
              { path: '/admin/team-performance', element: <TeamPerformancePage /> },
              { path: '/admin/audit-log', element: <AuditLogPage /> },
              { path: '*', element: <Navigate to="/overview" replace /> },
            ],
          },
        ],
      },
    ],
  },
])
