import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const RegisterOrgPage: React.FC = () => {
  const navigate = useNavigate()

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Building className="h-8 w-8" />
            Register Organization
          </CardTitle>
          <CardDescription className="text-gray-600">
            Organization registration functionality will be implemented here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              This page will contain the organization registration form with all necessary fields
              and validation based on the original Angular component.
            </p>
            
            <Button
              variant="outline"
              onClick={handleBackToLogin}
              className="w-full flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterOrgPage