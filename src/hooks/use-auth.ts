import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '@/services/auth.service'
import { LoginCredentials, AuthResponse, User } from '@/types/auth'

export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Store auth data
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.userName)
      sessionStorage.setItem('firstName', data.firstName)
      sessionStorage.setItem('empId', data.id)
      sessionStorage.setItem('designation', data.contactName || '')
      sessionStorage.setItem('externalReportingHeadMail', data.contactNumber || '')
      
      const roles = data.roles || []
      sessionStorage.setItem('role', roles[0] || '')

      // Navigate based on role
      const role = roles[0]
      if (role === 'ROLE_SUPER_ADMIN') {
        navigate('/select-company')
      } else if (role === 'ROLE_CANDIDATE') {
        if (data.company) {
          sessionStorage.setItem('companyId', data.company.companyId)
          sessionStorage.setItem('companyName', data.company.companyName)
        }
        navigate('/employee-onboarding/onboarding-employee')
      } else {
        if (data.company) {
          sessionStorage.setItem('companyId', data.company.companyId)
          sessionStorage.setItem('companyName', data.company.companyName)
        }
        sessionStorage.setItem('Edit-employeeId', data.id)
        sessionStorage.setItem('Edit-employee-role', role)
        navigate(`/master/view-employee/${data.id}`)
      }

      // Invalidate and refetch auth queries
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear()
      navigate('/login')
    },
  })

  // Get current user from session
  const getCurrentUser = (): User | null => {
    const token = localStorage.getItem('token')
    const userName = localStorage.getItem('userName')
    const firstName = sessionStorage.getItem('firstName')
    const empId = sessionStorage.getItem('empId')
    const role = sessionStorage.getItem('role')

    if (!token || !userName || !firstName || !empId || !role) {
      return null
    }

    return {
      id: empId,
      userName,
      firstName,
      roles: [role],
      contactName: sessionStorage.getItem('designation') || undefined,
      contactNumber: sessionStorage.getItem('externalReportingHeadMail') || undefined,
      company: sessionStorage.getItem('companyId') ? {
        companyId: sessionStorage.getItem('companyId')!,
        companyName: sessionStorage.getItem('companyName')!,
      } : undefined,
    }
  }

  const isAuthenticated = () => {
    const token = localStorage.getItem('token')
    return !!(token && token !== ' ')
  }

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,
    getCurrentUser,
    isAuthenticated: isAuthenticated(),
  }
}