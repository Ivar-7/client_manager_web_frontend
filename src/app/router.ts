import { createElement, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import AppShell from './layout/AppShell'

const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'))

export const router = createBrowserRouter([
  {
    element: createElement(AppShell),
    children: [
      {
        path: '/',
        element: createElement(DashboardPage),
      },
      {
        path: '*',
        element: createElement(Navigate, { to: '/', replace: true }),
      },
    ],
  },
])
