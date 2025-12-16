// Mock react-query to capture mutation configs and provide a controllable queryClient
jest.mock('@tanstack/react-query', () => {
  const __queryClientMock = {
    invalidateQueries: jest.fn(),
    removeQueries: jest.fn(),
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
    // export internals for assertions
    __queryClientMock,
  }
})

// Mock toast
jest.mock('@heroui/toast', () => {
  const addToast = jest.fn()
  return { addToast }
})

// Mock ApiClient used by dashboardApi
jest.mock('@/lib/apiClient', () => ({
  ApiClient: { request: jest.fn(() => Promise.resolve({ success: true })) },
  queryKeys: { dashboard: { summary: () => ['dashboard','summary'], notifications: (l?: number) => ['dashboard','notifications', l] } }
}))

import { useMarkNotificationRead, useMarkAllNotificationsRead, useGenerateDeadlineReminders, useDeleteAllNotifications, useDashboardSummary, useDashboardNotifications, useDeleteNotification } from '../hooks/queries/useDashboardQueries'
const rq = require('@tanstack/react-query')
const { addToast } = require('@heroui/toast')
const api = require('@/lib/apiClient')

describe('useDashboardQueries mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('useMarkNotificationRead onSuccess invalidates queries', () => {
    // call the hook to register the mutation
    useMarkNotificationRead()

    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = lastCall[0]

    // simulate success
    config.onSuccess()

    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
  })

  test('useMarkAllNotificationsRead success shows toast and invalidates', () => {
    useMarkAllNotificationsRead()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = lastCall[0]

    config.onSuccess()

    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success' }))
  })

  test('useGenerateDeadlineReminders success shows toast with message', () => {
    useGenerateDeadlineReminders()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = lastCall[0]

    const response = { message: 'Reminders generated' }
    config.onSuccess(response)

    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success', description: 'Reminders generated' }))
  })

  test('useDeleteAllNotifications success shows success toast', () => {
    useDeleteAllNotifications()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = lastCall[0]

    config.onSuccess()

    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success' }))
  })

  test('mutation onError handlers show danger toasts', () => {
    // mark notification read
    useMarkNotificationRead()
    let lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let config = lastCall[0]
    config.onError(new Error('mark fail'))
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ color: 'danger' }))

    // mark all notifications read
    useMarkAllNotificationsRead()
    lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    config = lastCall[0]
    config.onError(new Error('mark all fail'))
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ color: 'danger' }))

    // generate reminders
    useGenerateDeadlineReminders()
    lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    config = lastCall[0]
    config.onError(new Error('gen fail'))
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ color: 'danger' }))

    // delete all
    useDeleteAllNotifications()
    lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    config = lastCall[0]
    config.onError(new Error('delete fail'))
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ color: 'danger' }))
  })

  test('mutationFns call ApiClient.request with correct endpoints and methods', async () => {
    jest.clearAllMocks()

    // mark notification read
    useMarkNotificationRead()
    let lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let config = lastCall[0]
    api.ApiClient.request.mockResolvedValueOnce({ success: true })
    await config.mutationFn('n123')
    expect(api.ApiClient.request).toHaveBeenCalledWith('/dashboard/notifications/n123/read', { method: 'PUT' })

    // mark all notifications read
    useMarkAllNotificationsRead()
    lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    config = lastCall[0]
    api.ApiClient.request.mockResolvedValueOnce({ success: true })
    await config.mutationFn()
    expect(api.ApiClient.request).toHaveBeenCalledWith('/dashboard/notifications/read-all', { method: 'PUT' })

    // delete notification
    useDeleteNotification()
    lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    config = lastCall[0]
    api.ApiClient.request.mockResolvedValueOnce({ success: true })
    await config.mutationFn('n_del')
    expect(api.ApiClient.request).toHaveBeenCalledWith('/dashboard/notifications/n_del', { method: 'DELETE' })

    // delete all
    useDeleteAllNotifications()
    lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    config = lastCall[0]
    api.ApiClient.request.mockResolvedValueOnce({ success: true })
    await config.mutationFn()
    expect(api.ApiClient.request).toHaveBeenCalledWith('/dashboard/notifications', { method: 'DELETE' })

    // generate reminders
    useGenerateDeadlineReminders()
    lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    config = lastCall[0]
    api.ApiClient.request.mockResolvedValueOnce({ success: true, message: 'ok' })
    await config.mutationFn()
    expect(api.ApiClient.request).toHaveBeenCalledWith('/dashboard/reminders/generate', { method: 'POST' })
  })

  test('useDashboardSummary returns query result and called with queryKey', () => {
    const sample = { totalJobs: 5 }
    rq.useQuery.mockImplementationOnce(() => ({ data: sample, isLoading: false }))
    const result = useDashboardSummary()
    expect(result.data).toBe(sample)
    const lastCall = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    expect(lastCall[0].queryKey).toBeDefined()
  })

  test('useDashboardNotifications returns data and uses provided limit', () => {
    const notes = [{ id: 'n1' }]
    rq.useQuery.mockImplementationOnce(() => ({ data: notes, isLoading: false }))
    const result = useDashboardNotifications(3)
    expect(result.data).toBe(notes)
    const lastCall = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    expect(lastCall[0].queryKey).toBeDefined()
  })

  test('generate reminders mutationFn rejects and onError shows danger toast', async () => {
    // register hook to capture config
    useGenerateDeadlineReminders()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = lastCall[0]

    // make ApiClient.request reject when called by mutationFn
    api.ApiClient.request.mockRejectedValueOnce(new Error('service down'))

    await expect(config.mutationFn()).rejects.toThrow()

    // simulate react-query calling onError after failure
    config.onError && config.onError(new Error('service down'))
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ color: 'danger' }))
  })

  test('useDashboardNotifications handles limit 0 without crashing', () => {
    rq.useQuery.mockImplementationOnce(() => ({ data: [], isLoading: false }))
    const res = useDashboardNotifications(0)
    expect(Array.isArray(res.data)).toBe(true)
    const lastCall = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    expect(lastCall[0].queryKey).toBeDefined()
  })

  test('useDashboardNotifications handles large notification lists', () => {
    const big = Array.from({ length: 500 }).map((_, i) => ({ id: `n${i}`, message: `m${i}` }))
    rq.useQuery.mockImplementationOnce(() => ({ data: big, isLoading: false }))
    const res = useDashboardNotifications(50)
    expect(res.data!.length).toBe(500)
  })

  test('useDashboardNotifications tolerates null fields in notifications', () => {
    const notes = [{ id: null, message: null }]
    rq.useQuery.mockImplementationOnce(() => ({ data: notes, isLoading: false }))
    const res = useDashboardNotifications(5)
    expect(res.data).toBeDefined()
    expect(res.data!.length).toBe(1)
  })
})
