import React from 'react'
import { User, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface ForgotPasswordModalProps {
  open: boolean
  onClose: () => void
  forgotPassword: {
    userName: string
    setUserName: (userName: string) => void
    showAlert: boolean
    matchNotFoundInDB: boolean
    mailSentSuccessfully: boolean
    submitUserName: () => void
    isLoading: boolean
  }
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  onClose,
  forgotPassword,
}) => {
  const { toast } = useToast()

  const handleSubmit = () => {
    if (!forgotPassword.userName.trim()) {
      toast({
        title: 'Username Required',
        description: 'Please enter your username',
        variant: 'destructive',
      })
      return
    }
    forgotPassword.submitUserName()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Forgot Password
          </DialogTitle>
          <DialogDescription>
            Enter your username to receive a password reset link via email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!forgotPassword.showAlert && (
            <>
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={forgotPassword.userName}
                    onChange={(e) => forgotPassword.setUserName(e.target.value)}
                    className="pl-10"
                    disabled={forgotPassword.isLoading}
                  />
                </div>

                {forgotPassword.matchNotFoundInDB && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Username not found in our database. Please contact admin.</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={forgotPassword.isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={forgotPassword.isLoading || !forgotPassword.userName.trim()}
                >
                  {forgotPassword.isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </>
          )}

          {forgotPassword.showAlert && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              
              {forgotPassword.mailSentSuccessfully ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-700">
                    Email Sent Successfully!
                  </h3>
                  <p className="text-sm text-gray-600">
                    A password reset link has been sent to your registered email address.
                    Please check your inbox and follow the instructions.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-700">
                    Email Not Found
                  </h3>
                  <p className="text-sm text-gray-600">
                    No email address found for this username. Please contact admin for assistance.
                  </p>
                </div>
              )}

              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordModal