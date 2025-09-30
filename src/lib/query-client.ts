import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (except 408, 429)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number
          if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false
          }
        }
        return failureCount < 3
      },
    },
    mutations: {
      retry: 1,
    },
  },
})