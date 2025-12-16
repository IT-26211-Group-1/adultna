// Tests for useOnboardingQueries

// Mock react-query and provide a controllable queryClient
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

  return { useQuery, useMutation, useQueryClient, __queryClientMock }
})

// Mock secure storage
const mockRemoveSecureItem = jest.fn()
jest.mock('@/hooks/useSecureStorage', () => ({ useSecureStorage: () => ({ removeSecureItem: mockRemoveSecureItem }) }))

// Mock router
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ replace: mockReplace }) }))

// Mock ApiClient/queryKeys used in hook
jest.mock('@/lib/apiClient', () => ({ ApiClient: { get: jest.fn(), post: jest.fn() }, queryKeys: { auth: { me: () => ['auth','me'] }, onboarding: { questions: () => ['onboarding','questions'], all: ['onboarding','all'] }, roadmap: { milestones: () => ['roadmap','milestones'] } } }))

// We'll mock useAuth imported by the module under test (relative path)
jest.mock('../hooks/queries/useAuthQueries', () => ({ useAuth: () => ({ isAuthenticated: false, user: null }) }))

import { useOnboardingQuestions, useOnboardingSubmit, useQuestionByCategory, useLifeStageQuestion, usePrioritiesQuestion } from '../hooks/queries/useOnboardingQueries'
const rq = require('@tanstack/react-query')

describe('useOnboardingQueries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('useOnboardingQuestions enabled=false when not authenticated', () => {
    // call hook
    useOnboardingQuestions()

    const lastCall = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    const cfg = lastCall[0]
    expect(cfg.enabled).toBe(false)
  })

  it('useOnboardingQuestions enabled=true when authenticated and onboarding not_started', () => {
    // replace useAuth mock to return authenticated
    jest.doMock('../hooks/queries/useAuthQueries', () => ({ useAuth: () => ({ isAuthenticated: true, user: { onboardingStatus: 'not_started' } }) }))
    // Re-require module function under test to pick up new mock
    const mod = require('../hooks/queries/useOnboardingQueries')
    mod.useOnboardingQuestions()

    const lastCall = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    const cfg = lastCall[0]
    expect(cfg.enabled).toBe(true)
  })

  it('useOnboardingSubmit mutationFn throws when onboarding already completed', async () => {
    // mock auth user completed
    jest.doMock('../hooks/queries/useAuthQueries', () => ({ useAuth: () => ({ user: { onboardingStatus: 'completed' } }) }))
    const mod = require('../hooks/queries/useOnboardingQueries')
    const hook = mod.useOnboardingSubmit()

    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = lastCall[0]

    await expect(cfg.mutationFn({})).rejects.toThrow('Onboarding already completed')
  })

  it('useOnboardingSubmit onSuccess clears secure storage, invalidates/refetches and redirects to dashboard when message contains Personalized Roadmap', async () => {
    // mock auth user in progress
    jest.doMock('../hooks/queries/useAuthQueries', () => ({ useAuth: () => ({ user: { onboardingStatus: 'in_progress' } }) }))
    const mod = require('../hooks/queries/useOnboardingQueries')
    mod.useOnboardingSubmit()

    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = lastCall[0]

    // simulate onSuccess response
    jest.useFakeTimers()
    await cfg.onSuccess({ success: true, message: 'Personalized Roadmap created' })

    // removeSecureItem called for keys
    expect(mockRemoveSecureItem).toHaveBeenCalledWith('onboarding-currentStep')
    expect(mockRemoveSecureItem).toHaveBeenCalledWith('onboarding-displayName')
    expect(mockRemoveSecureItem).toHaveBeenCalledWith('onboarding-lifeStage')
    expect(mockRemoveSecureItem).toHaveBeenCalledWith('onboarding-priorities')

    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
    expect(rq.__queryClientMock.refetchQueries).toHaveBeenCalled()

    // advance timers to trigger router.replace
    jest.advanceTimersByTime(150)
    expect(mockReplace).toHaveBeenCalledWith('/dashboard')
    jest.useRealTimers()
  })

  it('useOnboardingSubmit onError routes to login when isUnauthorized, or dashboard when 400 already completed', async () => {
    const mod = require('../hooks/queries/useOnboardingQueries')
    mod.useOnboardingSubmit()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = lastCall[0]

    // unauthorized error
    await cfg.onError({ isUnauthorized: true })
    expect(mockReplace).toHaveBeenCalledWith('/auth/login')

    // already completed
    await cfg.onError({ status: 400, data: { message: 'already completed' } })
    expect(mockReplace).toHaveBeenCalledWith('/dashboard')
  })

  it('useQuestionByCategory returns null question when no data', () => {
    // mock useOnboardingQuestions to return no data
    jest.doMock('../hooks/queries/useOnboardingQueries', () => ({ useOnboardingQuestions: () => ({ data: null }) }))
    const mod = require('../hooks/queries/useOnboardingQueries')
    const res = mod.useQuestionByCategory('life_stage')
    expect(res.question).toBeNull()
  })

  it('useOnboardingSubmit onSuccess without Personalized Roadmap clears storage but does not redirect', async () => {
    // mock auth user in progress
    jest.doMock('../hooks/queries/useAuthQueries', () => ({ useAuth: () => ({ user: { onboardingStatus: 'in_progress' } }) }))
    const mod = require('../hooks/queries/useOnboardingQueries')
    mod.useOnboardingSubmit()

    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = lastCall[0]

    await cfg.onSuccess({ success: true, message: 'Thank you for submitting' })

    // should clear storage and invalidate/refetch but not redirect to dashboard
    expect(mockRemoveSecureItem).toHaveBeenCalled()
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
    expect(rq.__queryClientMock.refetchQueries).toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('useQuestionByCategory returns matching question when data exists', () => {
    jest.doMock('../hooks/queries/useOnboardingQueries', () => ({ useOnboardingQuestions: () => ({ data: { questions: [{ id: 'q1', category: 'life_stage', question: 'Who are you?' }] } }) }))
    const mod = require('../hooks/queries/useOnboardingQueries')
    const res = mod.useQuestionByCategory('life_stage')
    expect(res.question).not.toBeNull()
    expect(res.question?.category).toBe('life_stage')
  })

  it('useLifeStageQuestion returns a question when available', () => {
    jest.doMock('../hooks/queries/useOnboardingQueries', () => ({ useOnboardingQuestions: () => ({ data: { questions: [{ id: 'q2', category: 'life_stage', question: 'Stage?' }] } }) }))
    const mod = require('../hooks/queries/useOnboardingQueries')
    const res = mod.useLifeStageQuestion()
    expect(res.question).not.toBeNull()
    expect(res.question?.id).toBe('q2')
  })

  it('useOnboardingQuestions enabled=false when authenticated but onboarding completed', () => {
    jest.doMock('../hooks/queries/useAuthQueries', () => ({ useAuth: () => ({ isAuthenticated: true, user: { onboardingStatus: 'completed' } }) }))
    const mod = require('../hooks/queries/useOnboardingQueries')
    mod.useOnboardingQuestions()

    const lastCall = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    const cfg = lastCall[0]
    expect(cfg.enabled).toBe(false)
  })
})
