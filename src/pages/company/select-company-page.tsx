import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

const SelectCompanyPage: React.FC = () => {
  const navigate = useNavigate()
  const { logout, getCurrentUser } = useAuth()
  
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
  }

  const handleCompanySelect = () => {
    // This would typically navigate to dashboard after company selection
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">HRMS</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || 'Admin'}
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center p-4 mt-20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Building2 className="h-8 w-8" />
              Select Company
            </CardTitle>
            <CardDescription className="text-gray-600">
              Choose a company to manage or access its HRMS data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Company selection functionality will be implemented here based on the 
                original Angular component. This will show available companies for 
                super admin users.
              </p>
              
              <div className="space-y-2">
                <Button
                  onClick={handleCompanySelect}
                  className="w-full"
                >
                  Select Company & Continue
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SelectCompanyPage