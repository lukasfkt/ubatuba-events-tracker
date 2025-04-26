'use client'

import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useRouter } from 'next/navigation'

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
          message: 'Usuário ou senha incorretos',
        })
        setError('password', {
          message: 'Usuário ou senha incorretos',
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

  const handleChangeForm = useCallback(() => {
    setIsLogin(!isLogin)
    reset()
  }, [isLogin, reset])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-md">
        <h1 className="mb-6 text-center font-sans text-3xl font-extrabold text-gray-800">
          {isLogin ? 'Login' : 'Cadastro'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Usuário
            </label>
            <input
              type="text"
              {...register('username')}
              className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="Seu nome de usuário"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              {...register('password')}
              className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="Sua senha"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleChangeForm}
            disabled={isSubmitting}
            className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
          >
            {isLogin
              ? 'Não tem conta? Cadastre-se'
              : 'Já tem conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  )
}
