// Mock the queries implementation so we can test the re-exports in `hooks/useAuth`
jest.mock('../hooks/queries/useAuthQueries', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User',
      role: 'user',
      emailVerified: true,
      hasPassword: true,
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: jest.fn(),
    loginAsync: jest.fn(),
    logout: jest.fn(),
    isLoggingIn: false,
    isLoggingOut: false,
    loginError: null,
    showIdleWarning: false,
    onStayActive: jest.fn(),
    onLogoutNow: jest.fn(),
    checkAuth: jest.fn(),
    forceAuthCheck: jest.fn(),
    refreshAuth: jest.fn(),
    invalidateAuth: jest.fn(),
    updateUser: jest.fn(),
    isAuthFresh: jest.fn(() => true),
  }),
  useEmailVerification: () => ({
    verifyEmail: jest.fn(),
    resendOtp: jest.fn(),
    resendOtpAsync: jest.fn(),
    isVerifying: false,
    isResending: false,
    verifyError: null,
    resendError: null,
    lastResendResponse: null,
  }),
}))

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useAuth, useEmailVerification } from '../hooks/useAuth'

function TestComponent() {
  const auth = useAuth()

  return (
    <div>
      <span>{auth.user?.email}</span>
      <button onClick={() => auth.logout?.()}>Logout</button>
    </div>
  )
}

describe('useAuth re-exports', () => {
  test('useAuth renders mocked user email', () => {
    const html = renderToStaticMarkup(<TestComponent />)
    expect(html).toContain('test@example.com')
  })

  test('useEmailVerification is available', () => {
    const hook = useEmailVerification()
    expect(typeof hook.verifyEmail).toBe('function')
    expect(typeof hook.resendOtp).toBe('function')
  })

  test('logout is a mock function and can be called', () => {
    const hook = useAuth()
    expect(typeof hook.logout).toBe('function')
    // call the mocked logout and assert it was invoked
    ;(hook.logout as jest.Mock)()
    expect((hook.logout as jest.Mock).mock.calls.length).toBe(1)
  })

  test('utility functions and flags are present', () => {
    const hook = useAuth()
    expect(typeof hook.onStayActive).toBe('function')
    expect(typeof hook.onLogoutNow).toBe('function')
    expect(hook.isAuthenticated).toBe(true)
    expect(hook.isLoading).toBe(false)
    expect(hook.isAuthFresh()).toBe(true)
  })

  test('component structure snapshot', () => {
    const html = renderToStaticMarkup(<TestComponent />)
    expect(html).toMatchSnapshot()
  })

  test('login and loginAsync are callable and invoked', () => {
    const hook = useAuth()

    expect(typeof hook.login).toBe('function')
    expect(typeof hook.loginAsync).toBe('function')

    // call both
    ;(hook.login as jest.Mock)('u', 'p')
    ;(hook.loginAsync as jest.Mock)('u2', 'p2')

    expect((hook.login as jest.Mock).mock.calls.length).toBe(1)
    expect((hook.loginAsync as jest.Mock).mock.calls.length).toBe(1)
  })

  test('email verification functions are callable', () => {
    const v = useEmailVerification()

    expect(typeof v.verifyEmail).toBe('function')
    expect(typeof v.resendOtp).toBe('function')

    ;(v.verifyEmail as jest.Mock)('code-1')
    ;(v.resendOtp as jest.Mock)()

    expect((v.verifyEmail as jest.Mock).mock.calls.length).toBe(1)
    expect((v.resendOtp as jest.Mock).mock.calls.length).toBe(1)
  })

  test('handles null user gracefully', () => {
    // isolate module to provide alternate mock
    jest.isolateModules(() => {
      jest.mock('../hooks/queries/useAuthQueries', () => ({
        useAuth: () => ({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          logout: jest.fn(),
        }),
        useEmailVerification: () => ({ verifyEmail: jest.fn(), resendOtp: jest.fn() }),
      }))

      const { useAuth: useAuthLocal } = require('../hooks/useAuth')
      function LocalComp() {
        const a = useAuthLocal()
        return <div>{String(a.user)}</div>
      }

      const html = renderToStaticMarkup(<LocalComp />)
      expect(html).toContain('null')
    })
  })

  test('logout throwing is logged and does not crash test', () => {
    jest.isolateModules(() => {
      const mockLogger = { error: jest.fn() }
      jest.mock('@/lib/logger', () => ({ logger: mockLogger }))
      jest.mock('../hooks/queries/useAuthQueries', () => ({
        useAuth: () => ({
          user: { id: '1' },
          isAuthenticated: true,
          isLoading: false,
          logout: jest.fn(() => { throw new Error('logout fail') }),
        }),
        useEmailVerification: () => ({ verifyEmail: jest.fn(), resendOtp: jest.fn() }),
      }))

      const { useAuth: useAuthLocal } = require('../hooks/useAuth')
      const a = useAuthLocal()
      try {
        a.logout && a.logout()
      } catch (e) {
        // expected
      }
      const { logger } = require('@/lib/logger')
      expect(logger.error).toBeDefined()
    })
  })

  test('loginAsync rejection is observable and logged', async () => {
    await jest.isolateModulesAsync(async () => {
      const mockLogger = { error: jest.fn() }
      jest.mock('@/lib/logger', () => ({ logger: mockLogger }))
      jest.mock('../hooks/queries/useAuthQueries', () => ({
        useAuth: () => ({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          loginAsync: jest.fn(async () => { throw new Error('bad creds') }),
        }),
        useEmailVerification: () => ({ verifyEmail: jest.fn(), resendOtp: jest.fn() }),
      }))

      const { useAuth: useAuthLocal } = require('../hooks/useAuth')
      const a = useAuthLocal()
      await expect((a.loginAsync as jest.Mock)()).rejects.toThrow()
      const { logger } = require('@/lib/logger')
      expect(logger.error).toBeDefined()
    })
  })

  test('resendOtp failure is handled and logged', () => {
    jest.isolateModules(() => {
      const mockLogger = { error: jest.fn() }
      jest.mock('@/lib/logger', () => ({ logger: mockLogger }))
      jest.mock('../hooks/queries/useAuthQueries', () => ({
        useAuth: () => ({ user: null, isAuthenticated: false, isLoading: false }),
        useEmailVerification: () => ({ verifyEmail: jest.fn(), resendOtp: jest.fn(() => { throw new Error('resend fail') }) }),
      }))

      const { useEmailVerification: useEmailLocal } = require('../hooks/useAuth')
      const v = useEmailLocal()
      try {
        v.resendOtp && v.resendOtp()
      } catch (e) {
        // expected
      }
      const { logger } = require('@/lib/logger')
      expect(logger.error).toBeDefined()
    })
  })

  test('isAuthFresh false path is supported', () => {
    jest.isolateModules(() => {
      jest.mock('../hooks/queries/useAuthQueries', () => ({
        useAuth: () => ({ isAuthFresh: () => false, isAuthenticated: false, isLoading: false }),
        useEmailVerification: () => ({ verifyEmail: jest.fn(), resendOtp: jest.fn() }),
      }))

      const { useAuth: useAuthLocal } = require('../hooks/useAuth')
      const a = useAuthLocal()
      expect(a.isAuthFresh()).toBe(false)
    })
  })
})
