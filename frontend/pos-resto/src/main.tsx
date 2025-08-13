// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import RoleGate from './roles/RoleGate';
import ManagerPage from './roles/ManagerPage';
import CashierPage from './roles/CashierPage';
import ServerPage from './roles/ServerPage';
import StaffRulesPage from './roles/StaffRulesPage';
import ManagerSelectStationPage from './roles/ManagerSelectStationPage';

const router = createBrowserRouter([
  // Accueil
  { path: '/', element: <App /> },

  // Espace Manager
  {
    path: '/manager',
    element: (
      <RoleGate allow="manager">
        <ManagerPage />
      </RoleGate>
    ),
  },
  {
    path: '/manager/staff',
    element: (
      <RoleGate allow="manager">
        <StaffRulesPage />
      </RoleGate>
    ),
  },
  {
    path: '/manager/select-station',
    element: (
      <RoleGate allow="manager">
        <ManagerSelectStationPage />
      </RoleGate>
    ),
  },

  // Caisse : accessible au caissier ET au manager (après code station)
  {
    path: '/cashier',
    element: (
      <RoleGate allow={['cashier', 'manager']}>
        <CashierPage />
      </RoleGate>
    ),
  },

  // Espace Serveur
  {
    path: '/server',
    element: (
      <RoleGate allow="server">
        <ServerPage />
      </RoleGate>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
