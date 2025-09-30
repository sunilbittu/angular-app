export interface LoginCredentials {
  username: string
  password: string
}

export interface User {
  id: string
  userName: string
  firstName: string
  lastName?: string
  contactName?: string
  contactNumber?: string
  roles: string[]
  company?: {
    companyId: string
    companyName: string
  }
}

export interface AuthResponse {
  token: string
  userName: string
  firstName: string
  id: string
  contactName?: string
  contactNumber?: string
  roles: string[]
  company?: {
    companyId: string
    companyName: string
  }
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}