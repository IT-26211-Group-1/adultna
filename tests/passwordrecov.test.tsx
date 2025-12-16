// Mock react-query's useMutation to capture configs
jest.mock('@tanstack/react-query', () => {
  const useMutation = jest.fn((config) => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    error: null,
    data: null,
    __config: config,
  }))

  return { useMutation }
})

// Mock secure storage and toast utilities
// Shared mock storage so the hook and tests reference the same spies
const mockStorage = {
  setSecureItem: jest.fn(),
  getSecureItem: jest.fn(),
  removeSecureItem: jest.fn(),
}

jest.mock('@/hooks/useSecureStorage', () => ({
  useSecureStorage: () => mockStorage,
}))

jest.mock('@heroui/toast', () => ({ addToast: jest.fn() }))

import { useForgotPasswordFlow } from '../hooks/queries/useForgotPasswordQueries'
const rq = require('@tanstack/react-query')
const { useSecureStorage } = require('@/hooks/useSecureStorage')
const { addToast } = require('@heroui/toast')

describe('useForgotPasswordFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('sendOtp onSuccess stores email, step and token and shows toast', () => {
    useForgotPasswordFlow()

    // sendOtp is first useMutation call
    const sendCfg = rq.useMutation.mock.calls[0][0]

    const data = { success: true, verificationToken: 'vtok' }
    const variables = { email: 'a@b.com' }

    sendCfg.onSuccess(data, variables)

    const storage = useSecureStorage()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'OTP sent to your email' }))
    expect(storage.setSecureItem).toHaveBeenCalledWith('forgotPasswordEmail', 'a@b.com', 60)
    expect(storage.setSecureItem).toHaveBeenCalledWith('forgotPasswordStep', 'otp', 60)
    expect(storage.setSecureItem).toHaveBeenCalledWith('forgotPasswordToken', 'vtok', 60)
  })

  test('sendOtp onError shows danger toast', () => {
    useForgotPasswordFlow()
    const sendCfg = rq.useMutation.mock.calls[0][0]

    sendCfg.onError({ message: 'failed' })

    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ color: 'danger' }))
  })

  test('verifyOtp onSuccess moves to reset step and shows toast', () => {
    useForgotPasswordFlow()
    const verifyCfg = rq.useMutation.mock.calls[1][0]

    verifyCfg.onSuccess({ success: true })

    const storage = useSecureStorage()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'OTP verified successfully' }))
    expect(storage.setSecureItem).toHaveBeenCalledWith('forgotPasswordStep', 'reset', 60)
  })

  test('verifyOtp onError with max attempts clears storage and navigates after timeout', () => {
    jest.useFakeTimers()

    // stub window.location
    const orig = global.window.location
    // @ts-ignore
    delete global.window.location
    // @ts-ignore
    global.window.location = { href: '' }

    useForgotPasswordFlow()
    const verifyCfg = rq.useMutation.mock.calls[1][0]

    verifyCfg.onError({ message: 'Maximum OTP attempts exceeded' })

    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ color: 'danger' }))

    // advance timers to trigger redirect cleanup
    jest.advanceTimersByTime(2000)

    const storage = useSecureStorage()
    expect(storage.removeSecureItem).toHaveBeenCalledWith('forgotPasswordToken')
    expect(storage.removeSecureItem).toHaveBeenCalledWith('forgotPasswordEmail')
    expect(storage.removeSecureItem).toHaveBeenCalledWith('forgotPasswordStep')
    expect((global.window as any).location.href).toBe('/auth/login');

    (global.window as any).location = orig
    jest.useRealTimers()
  })

  test('resetPassword onSuccess clears stored data', () => {
    useForgotPasswordFlow()
    const resetCfg = rq.useMutation.mock.calls[2][0]

    resetCfg.onSuccess({ success: true })

    const storage = useSecureStorage()
    expect(storage.removeSecureItem).toHaveBeenCalledWith('forgotPasswordToken')
    expect(storage.removeSecureItem).toHaveBeenCalledWith('forgotPasswordEmail')
    expect(storage.removeSecureItem).toHaveBeenCalledWith('forgotPasswordStep')
  })

  test('resendOtp mutationFn throws when no stored email', async () => {
    // make getSecureItem return null
    const storage = useSecureStorage()
    storage.getSecureItem.mockReturnValue(null)

    useForgotPasswordFlow()
    const resendCfg = rq.useMutation.mock.calls[3][0]

    await expect(resendCfg.mutationFn()).rejects.toThrow()
  })

  test('sendOtp onSuccess without verificationToken stores placeholder token', () => {
    useForgotPasswordFlow()
    const sendCfg = rq.useMutation.mock.calls[0][0]

    const data = { success: true }
    const variables = { email: 'b@c.com' }

    sendCfg.onSuccess(data, variables)

    const storage = useSecureStorage()
    expect(storage.setSecureItem).toHaveBeenCalledWith('forgotPasswordEmail', 'b@c.com', 60)
    expect(storage.setSecureItem).toHaveBeenCalledWith('forgotPasswordStep', 'otp', 60)
    expect(storage.setSecureItem).toHaveBeenCalledWith('forgotPasswordToken', 'placeholder', 60)
  })

  test('verifyOtp onSuccess with success=false does not change step', () => {
    useForgotPasswordFlow()
    const verifyCfg = rq.useMutation.mock.calls[1][0]

    // pre-set some step
    const storage = useSecureStorage()
    storage.setSecureItem('forgotPasswordStep', 'otp', 60)

    verifyCfg.onSuccess({ success: false })

    // step should remain as previously set
    expect(storage.setSecureItem).toHaveBeenCalledWith('forgotPasswordStep', 'otp', 60)
  })

  test('resendOtp onSuccess without verificationToken does not set token', () => {
    useForgotPasswordFlow()
    const resendCfg = rq.useMutation.mock.calls[3][0]

    // simulate prior stored email
    const storage = useSecureStorage()
    storage.getSecureItem.mockReturnValue('a@b.com')

    // call onSuccess with no verificationToken
    resendCfg.onSuccess({ success: true })

    expect(storage.setSecureItem).not.toHaveBeenCalledWith('forgotPasswordToken', expect.anything(), 60)
  })
})
