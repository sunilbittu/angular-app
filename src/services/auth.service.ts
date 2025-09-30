import { api } from './api'
import { LoginCredentials, AuthResponse } from '@/types/auth'

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }

  static async validateUser(userName: string): Promise<{ data: boolean }> {
    const response = await api.get(`/user/validate?userName=${userName}`)
    return response.data
  }

  static async sendResetEmail(userName: string): Promise<{ data: boolean }> {
    const response = await api.get(`/user/sendEmail?userName=${userName}`)
    return response.data
  }

  static async refreshToken(): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh')
    return response.data
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      // Always clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      sessionStorage.clear()
    }
  }
}