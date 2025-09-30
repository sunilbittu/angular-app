import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'
import { Toaster } from '@/components/ui/toaster'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import LoginPage from '@/pages/auth/login-page'
import DashboardPage from '@/pages/dashboard/dashboard-page'
import SelectCompanyPage from '@/pages/company/select-company-page'
import RegisterOrgPage from '@/pages/auth/register-org-page'
import ProtectedRoute from '@/components/auth/protected-route'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <LoadingSpinner />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-org" element={<RegisterOrgPage />} />
            
            {/* Protected routes */}
            <Route path="/select-company" element={
              <ProtectedRoute>
                <SelectCompanyPage />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Catch all redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App