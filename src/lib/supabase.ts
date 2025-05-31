import { createClient } from '@supabase/supabase-js'
import { validateEnv } from './env'

const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = validateEnv()

export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token',
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null
        const value = document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${key}=`))
          ?.split('=')[1]
        return value ? JSON.parse(decodeURIComponent(value)) : null
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return
        const cookieValue = encodeURIComponent(JSON.stringify(value))
        document.cookie = `${key}=${cookieValue}; path=/; max-age=3600; SameSite=Lax`
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return
        document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`
      }
    }
  }
}) 