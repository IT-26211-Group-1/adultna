// Tests for the email verification hooks exported from useAuthQueries
// They verify onSuccess flows: removing secure token, invalidating/refetching, and routing

// Mock react-query to capture mutation configs and provide a controllable queryClient
jest.mock('@tanstack/react-query', () => {
  const __queryClientMock = {
    invalidateQueries: jest.fn(),
    refetchQueries: jest.fn(),
    getQueryData: jest.fn(),
    setQueryData: jest.fn(),
  }

  const useQuery = jest.fn(() => ({ data: null, isLoading: false }))
  const useMutation = jest.fn((config) => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    error: null,
    data: null,
    __config: config,
  }))
  const useQueryClient = jest.fn(() => __queryClientMock)

  return {
    useQuery,
    useMutation,
    useQueryClient,
    __queryClientMock,
  }
})

// Mock secure storage
const mockSetSecureItem = jest.fn()
const mockRemoveSecureItem = jest.fn()
jest.mock('@/hooks/useSecureStorage', () => ({ useSecureStorage: () => ({ setSecureItem: mockSetSecureItem, removeSecureItem: mockRemoveSecureItem }) }))

// Mock router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

import { useEmailVerification } from '../hooks/queries/useAuthQueries'
const rq = require('@tanstack/react-query')

describe('useEmailVerification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('verifyEmail onSuccess removes secure item, invalidates, refetches and routes to /dashboard when onboarding completed', async () => {
    // call hook to register mutations
    useEmailVerification()

    // capture verify mutation config
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 2]
    const verifyCfg = lastCall[0]

    // prepare queryClient.getQueryData to return completed onboarding
    rq.__queryClientMock.getQueryData.mockReturnValueOnce({ onboardingStatus: 'completed' })

    // simulate success
    await verifyCfg.onSuccess({ success: true })

    expect(mockRemoveSecureItem).toHaveBeenCalledWith('verification_token')
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
    expect(rq.__queryClientMock.refetchQueries).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('verifyEmail onSuccess routes to onboarding when onboarding not completed', async () => {
    useEmailVerification()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 2]
    const verifyCfg = lastCall[0]

    rq.__queryClientMock.getQueryData.mockReturnValueOnce({ onboardingStatus: 'not_started' })

    await verifyCfg.onSuccess({ success: true })

    expect(mockRemoveSecureItem).toHaveBeenCalledWith('verification_token')
    expect(mockPush).toHaveBeenCalledWith('/auth/onboarding')
  })

  it('resendOtp onSuccess stores verification token when provided', async () => {
    useEmailVerification()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const resendCfg = lastCall[0]

    // simulate success with verificationToken
    const response = { verificationToken: 'vtok' }
    await resendCfg.onSuccess(response)

    expect(mockSetSecureItem).toHaveBeenCalledWith('verification_token', 'vtok', 60)
  })

  it('verifyEmail onSuccess with success=false does not remove token or navigate', async () => {
    useEmailVerification()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 2]
    const verifyCfg = lastCall[0]

    // simulate non-successful response
    await verifyCfg.onSuccess({ success: false })

    expect(mockRemoveSecureItem).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('verifyEmail onSuccess routes to onboarding when query data is undefined', async () => {
    useEmailVerification()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 2]
    const verifyCfg = lastCall[0]

    // simulate missing onboarding data
    rq.__queryClientMock.getQueryData.mockReturnValueOnce(undefined)

    await verifyCfg.onSuccess({ success: true })

    expect(mockRemoveSecureItem).toHaveBeenCalledWith('verification_token')
    expect(mockPush).toHaveBeenCalledWith('/auth/onboarding')
  })

  it('resendOtp onSuccess with no verificationToken does not store anything', async () => {
    useEmailVerification()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const resendCfg = lastCall[0]

    // simulate success without token
    await resendCfg.onSuccess({})

    expect(mockSetSecureItem).not.toHaveBeenCalled()
  })
})
