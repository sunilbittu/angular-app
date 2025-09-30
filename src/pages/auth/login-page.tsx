import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { useForgotPassword } from '@/hooks/use-forgot-password'
import { useToast } from '@/hooks/use-toast'
import { LoginCredentials } from '@/types/auth'
import ForgotPasswordModal from '@/components/auth/forgot-password-modal'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login, isLoginLoading, loginError } = useAuth()
  const forgotPassword = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    const credentials: LoginCredentials = {
      username: data.username,
      password: data.password,
    }

    login(credentials, {
      onError: (error) => {
        toast({
          title: 'Login Failed',
          description: error instanceof Error ? error.message : 'An error occurred during login',
          variant: 'destructive',
        })
      },
      onSuccess: () => {
        toast({
          title: 'Login Successful',
          description: 'Welcome to HRMS!',
        })
      },
    })
  }

  const handleForgotPassword = () => {
    forgotPassword.resetState()
    setShowForgotModal(true)
  }

  const handleRegister = () => {
    navigate('/register-org')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">HRMS Login</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register('username')}
                  type="text"
                  placeholder="Username"
                  className="pl-10"
                  disabled={isLoginLoading}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="pl-10 pr-10"
                  disabled={isLoginLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoginLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {loginError && (
              <div className="text-sm text-red-600 text-center">
                Login failed. Please check your credentials.
              </div>
            )}
          </form>

          <div className="space-y-3">
            <div className="text-center">
              <Button
                variant="link"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot Password?
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to HRMS?</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleRegister}
              className="w-full"
            >
              Register Organization
            </Button>
          </div>
        </CardContent>
      </Card>

      <ForgotPasswordModal
        open={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        forgotPassword={forgotPassword}
      />
    </div>
  )
}

export default LoginPage