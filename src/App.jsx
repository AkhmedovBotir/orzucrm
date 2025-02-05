import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminsPage from './pages/admins/AdminsPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ProductsPage from './pages/products/ProductsPage';
import AppLayout from './components/layout/AppLayout'; 
import StoresPage from './pages/stores/StoresPage';
import AgentsPage from './pages/agents/AgentsPage';
import WholesaleOrderPage from './pages/orders/WholesaleOrderPage';
import RetailOrderPage from './pages/orders/RetailOrderPage';
import OrdersPage from './pages/orders/OrdersPage';
import ClientsPage from './pages/clients/ClientsPage';
import AccountingPage from './pages/accounting/AccountingPage';

// TODO: Keyingi sahifalar uchun importlar

export default function App() {
  // TODO: Authentication logikasi
  const isAuthenticated = true;

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse/categories"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CategoriesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse/products"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProductsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <StoresPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AgentsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/wholesale"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WholesaleOrderPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/retail"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <RetailOrderPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <OrdersPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ClientsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AccountingPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
