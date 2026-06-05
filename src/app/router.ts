import { createElement, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import AppShell from './layout/AppShell'

const DashboardLayout = lazy(() => import('../features/dashboard/layout/DashboardLayout'))
const OverviewPage = lazy(() => import('../features/dashboard/pages/OverviewPage'))
const ClientsPage = lazy(() => import('../features/dashboard/pages/ClientsPage'))
const WorkflowPage = lazy(() => import('../features/dashboard/pages/WorkflowPage'))
const InfrastructurePage = lazy(() => import('../features/dashboard/pages/InfrastructurePage'))
const MeetingsPage = lazy(() => import('../features/dashboard/pages/MeetingsPage'))

export const router = createBrowserRouter([
  {
    element: createElement(AppShell),
    children: [
      {
        element: createElement(DashboardLayout),
        children: [
          {
            path: '/',
            element: createElement(Navigate, { to: '/overview', replace: true }),
          },
          {
            path: '/overview',
            element: createElement(OverviewPage),
          },
          {
            path: '/clients',
            element: createElement(ClientsPage),
          },
          {
            path: '/workflow',
            element: createElement(WorkflowPage),
          },
          {
            path: '/infrastructure',
            element: createElement(InfrastructurePage),
          },
          {
            path: '/meetings',
            element: createElement(MeetingsPage),
          },
        ],
      },
      {
        path: '*',
        element: createElement(Navigate, { to: '/overview', replace: true }),
      },
    ],
  },
])
