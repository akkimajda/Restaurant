import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import RoleGate from './roles/RoleGate';
import ManagerPage from './roles/ManagerPage';
import CashierPage from './roles/CashierPage';
import ServerPage from './roles/ServerPage';
import StaffRulesPage from './roles/StaffRulesPage'; // ✅ nouvel import

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/manager', element: <RoleGate allow="manager"><ManagerPage /></RoleGate> },
  { path: '/manager/staff', element: <RoleGate allow="manager"><StaffRulesPage /></RoleGate> }, // ✅ nouvelle route
  { path: '/cashier', element: <RoleGate allow="cashier"><CashierPage /></RoleGate> },
  { path: '/server', element: <RoleGate allow="server"><ServerPage /></RoleGate> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
