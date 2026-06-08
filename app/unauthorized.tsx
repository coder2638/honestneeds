import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Lock, Home, LogIn } from 'lucide-react'

export const metadata = {
  title: 'Access Denied',
  description: 'You do not have permission to access this resource.',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-bg to-bg/50">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Access Denied Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-secondary/10 p-6">
            <Lock className="w-12 h-12 text-secondary" />
          </div>
        </div>

        {/* Error Message */}
        <div>
          <h1 className="text-3xl font-bold text-text">Access Denied</h1>
          <p className="mt-2 text-muted">
            You do not have permission to access this resource. Please check your account role or
            permissions.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="primary"
            as="link"
            href="/"
            className="flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Go Home
          </Button>
          <Button
            variant="outline"
            as="link"
            href="/login"
            className="flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Sign In
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-4 text-sm text-muted">
          <p>
            Contact our support team if you believe this is an error:{' '}
            <a href="mailto:support@honestneed.com" className="text-primary hover:underline">
              support@honestneed.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
