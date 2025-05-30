'use client'

import { z } from 'zod'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthentication } from '@/hooks/useAuthentication'

import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const authSchema = z.object({
  username: z.string().min(6, 'Usuário deve ter pelo menos 6 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type AuthSchema = z.infer<typeof authSchema>

export default function AuthPage() {
  const { login, registerUser } = useAuthentication()
  const [isLogin, setIsLogin] = useState(true)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  })

  const onSubmit = useCallback(
    async (data: AuthSchema) => {
      if (isLogin) {
        const response = await login(data.username, data.password)
        if (response) {
          router.push('/events')
          reset()
          return
        }
        setError('username', {
          message: ' ',
        })
        setError('password', {
          message: ' ',
        })
      } else {
        const response = await registerUser(data.username, data.password)
        if (response) {
          router.push('/events')
          reset()
          return
        }
      }
    },
    [isLogin, login, registerUser, reset, router, setError],
  )

  useEffect(() => {
    clearErrors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isLogin ? 'Welcome!' : 'Create an account'}
          </CardTitle>
          <CardDescription className="text-sm">
            Fill the informations below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                type="text"
                {...register('username')}
                placeholder="Type your username..."
                error={errors.username?.message}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Senha
              </label>
              <Input
                type="password"
                {...register('password')}
                placeholder="Type your password..."
                error={errors.password?.message}
              />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              disabled={isSubmitting}
              className="text-sm hover:underline disabled:opacity-50"
            >
              {isLogin
                ? 'Don’t have an account? Register'
                : 'Already have an account? Login'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
