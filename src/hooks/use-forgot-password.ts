import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AuthService } from '@/services/auth.service'

export const useForgotPassword = () => {
  const [userName, setUserName] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [matchNotFoundInDB, setMatchNotFoundInDB] = useState(false)
  const [mailSentSuccessfully, setMailSentSuccessfully] = useState(false)

  // Validate user mutation
  const validateUserMutation = useMutation({
    mutationFn: (userName: string) => AuthService.validateUser(userName),
    onSuccess: (data) => {
      const userExists = !data.data
      setMatchNotFoundInDB(data.data)
      if (userExists) {
        sendEmailMutation.mutate(userName)
      }
    },
    onError: (error) => {
      console.error('User validation failed:', error)
    },
  })

  // Send reset email mutation
  const sendEmailMutation = useMutation({
    mutationFn: (userName: string) => AuthService.sendResetEmail(userName),
    onSuccess: (data) => {
      setMailSentSuccessfully(data.data)
      if (data.data) {
        setShowAlert(true)
      }
    },
    onError: (error) => {
      console.error('Email sending failed:', error)
    },
  })

  const submitUserName = () => {
    if (userName.trim()) {
      setMatchNotFoundInDB(false)
      validateUserMutation.mutate(userName)
    }
  }

  const changeUserName = (newUserName: string) => {
    setUserName(newUserName)
    setMatchNotFoundInDB(false)
  }

  const resetState = () => {
    setUserName('')
    setShowAlert(false)
    setMatchNotFoundInDB(false)
    setMailSentSuccessfully(false)
  }

  return {
    userName,
    setUserName: changeUserName,
    showAlert,
    setShowAlert,
    matchNotFoundInDB,
    mailSentSuccessfully,
    submitUserName,
    resetState,
    isValidating: validateUserMutation.isPending,
    isSendingEmail: sendEmailMutation.isPending,
    isLoading: validateUserMutation.isPending || sendEmailMutation.isPending,
  }
}