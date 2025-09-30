import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  Settings, 
  LogOut,
  Building2,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

const DashboardPage: React.FC = () => {
  const { logout, getCurrentUser } = useAuth()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
  }

  const dashboardCards = [
    {
      title: 'Employee Management',
      description: 'Manage employee records, profiles, and information',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Leave & Attendance',
      description: 'Track attendance, manage leaves and time-off requests',
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Payroll Management',
      description: 'Process salaries, manage payroll and compensation',
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Reports & Analytics',
      description: 'Generate reports and view analytics dashboard',
      icon: BarChart3,
      color: 'bg-purple-500',
    },
    {
      title: 'Document Management',
      description: 'Manage employee documents and company policies',
      icon: FileText,
      color: 'bg-red-500',
    },
    {
      title: 'System Configuration',
      description: 'Configure system settings and preferences',
      icon: Settings,
      color: 'bg-gray-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HRMS Dashboard</h1>
                {user?.company && (
                  <p className="text-sm text-gray-600">{user.company.companyName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || 'User'}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HRMS</h2>
          <p className="text-gray-600">
            Manage your human resources efficiently with our comprehensive management system.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className={`p-2 rounded-md ${card.color} text-white mr-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-600">Total Employees</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-600">Active Leaves</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">0</p>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600">Recent Activities</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage