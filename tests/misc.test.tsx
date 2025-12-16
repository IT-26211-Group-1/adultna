import React from 'react'
import { act } from 'react-dom/test-utils'
import { createRoot } from 'react-dom/client'

// Provide minimal mocks for react-query used by these hooks
jest.mock('@tanstack/react-query', () => {
  const __queryClientMock = { invalidateQueries: jest.fn() }
  return {
    useMutation: jest.fn((cfg) => ({ __config: cfg })),
    useQuery: jest.fn(() => ({ data: null, isLoading: false })),
    useQueryClient: jest.fn(() => __queryClientMock),
    useQueries: jest.fn(() => []),
    __queryClientMock,
  }
})

const rq = require('@tanstack/react-query')

// Mock ApiClient
jest.mock('@/lib/apiClient', () => ({
  ApiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}))

// Mock toast
jest.mock('@heroui/toast', () => ({ addToast: jest.fn() }))

afterEach(() => {
  jest.clearAllMocks()
  // keep module registry stable between tests to preserve our mocked functions
})

describe('misc queries edge cases', () => {
  it('AI suggestion hooks call ApiClient.post and return suggestions', async () => {
    const { ApiClient } = require('@/lib/apiClient')
    ApiClient.post.mockResolvedValueOnce({ suggestions: ['one'] })

    const mod = require('../hooks/queries/useAIQueries')
    // call hook to register mutation
    mod.useGenerateWorkDescriptionSuggestions('r1')
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = last[0]

    const out = await cfg.mutationFn({ sectionId: 's' })
    expect(ApiClient.post).toHaveBeenCalled()
    expect(out).toEqual(['one'])
  })

  it('useSubmitAnswerToQueue invalidation onSuccess', () => {
    const mod = require('../hooks/queries/useInterviewAnswers')
    mod.useSubmitAnswerToQueue()
    const callCount = rq.useMutation.mock.calls.length
    expect(callCount).toBeGreaterThan(0)
    const last = rq.useMutation.mock.calls[callCount - 1]
    const cfg = last[0]

    // call onSuccess and expect invalidateQueries
    if (cfg && typeof cfg.onSuccess === 'function') {
      cfg.onSuccess()
    } else {
      throw new Error('useMutation config or onSuccess not found')
    }
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
  })

  it('pollMultipleAnswersUntilComplete returns results when answers already completed', async () => {
    const { ApiClient } = require('@/lib/apiClient')
    // simulate getAnswerById returning completed answers
    ApiClient.get.mockImplementation(async (path: string) => ({ data: { id: 'a', status: 'completed', totalScore: 10 } }))
    ApiClient.post.mockResolvedValueOnce([{ id: 'a', status: 'completed', totalScore: 10 }])

    const { pollMultipleAnswersUntilComplete } = require('../hooks/queries/useInterviewAnswers')

    const progress = jest.fn()
    const res = await pollMultipleAnswersUntilComplete(['a'], progress)
    expect(Array.isArray(res)).toBe(true)
    expect(progress).toHaveBeenCalledWith(1, 1)
  })

  it('useGetAnswersByIds disables query when empty ids', () => {
    // ensure useQuery is captured
    const mod = require('../hooks/queries/useInterviewAnswers')
    mod.useGetAnswersByIds([])
    const last = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    // config is first arg
    expect(last[0].enabled).toBe(false)
  })

  it('useDownloadGuidePdf mutationFn throws on non-ok response with JSON error', async () => {
    // ensure fresh modules so hook reads our fetch mock
    jest.isolateModules(() => {})
    // mock fetch non-ok with JSON
    // @ts-ignore
    global.fetch = jest.fn(async () => ({ ok: false, status: 500, json: async () => ({ message: 'err' }) }))

    const mod = require('../hooks/queries/useDownloadGuidePdf')
    mod.useDownloadGuidePdf()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = last[0]

    await expect(cfg.mutationFn({ slug: 's', language: 'en' })).rejects.toThrow('err')
  })

  it('useDownloadGuidePdf mutationFn throws on wrong content-type', async () => {
    // @ts-ignore
    global.fetch = jest.fn(async () => ({ ok: true, headers: { get: () => 'text/html' }, blob: async () => new Blob(['x']) }))

    const mod = require('../hooks/queries/useDownloadGuidePdf')
    mod.useDownloadGuidePdf()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = last[0]

    await expect(cfg.mutationFn({ slug: 's', language: 'en' })).rejects.toThrow(/Invalid response format/)
  })

  it('useDownloadGuidePdf mutationFn throws on empty blob', async () => {
    // @ts-ignore
    global.fetch = jest.fn(async () => ({ ok: true, headers: { get: () => 'application/pdf' }, blob: async () => new Blob([]) }))

    const mod = require('../hooks/queries/useDownloadGuidePdf')
    mod.useDownloadGuidePdf()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = last[0]

    await expect(cfg.mutationFn({ slug: 's', language: 'en' })).rejects.toThrow(/PDF file is empty/)
  })

  it('useDownloadGuidePdf onSuccess creates object URL and toasts', async () => {
    const blob = new Blob(['x'], { type: 'application/pdf' })
    const filename = 'a-en.pdf'

    const { addToast } = require('@heroui/toast')
    const origURL = global.URL
    global.URL = Object.assign({}, origURL, { createObjectURL: jest.fn().mockReturnValue('blob:1'), revokeObjectURL: jest.fn() })

    const mod = require('../hooks/queries/useDownloadGuidePdf')
    mod.useDownloadGuidePdf()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = last[0]

    // call onSuccess directly
    cfg.onSuccess!({ blob, filename })

    expect(global.URL.createObjectURL).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'PDF downloaded successfully' }))

    // restore
    global.URL = origURL
  })

  it('useTranslatedGuides returns translationsMap and flags correctly', () => {
    // mock useQueries to simulate one loaded and one loading
    const useQueries = require('@tanstack/react-query').useQueries
    useQueries.mockReturnValueOnce([
      { data: { title: 'T1' }, isLoading: false, isError: false },
      { data: undefined, isLoading: true, isError: false },
    ])

    const { useTranslatedGuides } = require('../hooks/queries/useTranslatedGuides')
    const res = useTranslatedGuides(['a', 'b'], 'fil', true)

    expect(res.translationsMap.get('a')).toBeDefined()
    expect(res.isLoading).toBe(true)
    expect(res.hasErrors).toBe(false)
  })
})
