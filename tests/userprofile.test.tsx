// Tests for useProfileQueries hooks

// Mock react-query with a controllable queryClient
jest.mock('@tanstack/react-query', () => {
  const __queryClientMock = {
    invalidateQueries: jest.fn(),
    refetchQueries: jest.fn(),
    getQueryData: jest.fn(),
    setQueryData: jest.fn(),
    clear: jest.fn(),
  }

  const useMutation = jest.fn((config) => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    error: null,
    data: null,
    __config: config,
  }))

  const useQueryClient = jest.fn(() => __queryClientMock)

  return { useMutation, useQueryClient, __queryClientMock }
})

// Mock ApiClient and toast/logger
const mockApi = {
  patch: jest.fn(),
  delete: jest.fn(),
  post: jest.fn(),
}

jest.mock('@/lib/apiClient', () => ({ ApiClient: mockApi, queryKeys: { auth: { me: () => ['auth','me'] } } }))
jest.mock('@heroui/toast', () => ({ addToast: jest.fn() }))
jest.mock('@/lib/logger', () => ({ logger: { error: jest.fn() } }))

// Mock global fetch for upload
const originalFetch = global.fetch
beforeAll(() => {
  // @ts-ignore
  global.fetch = jest.fn()
})
afterAll(() => {
  global.fetch = originalFetch
})

import { useUpdateProfile, useUpdatePassword, useDeleteAccount, useUploadProfilePicture } from '../hooks/queries/useProfileQueries'
const rq = require('@tanstack/react-query')
const { addToast } = require('@heroui/toast')
const { ApiClient } = require('@/lib/apiClient')

describe('useProfileQueries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('useUpdateProfile onSuccess shows toast, updates user and invalidates', async () => {
    useUpdateProfile()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = lastCall[0]

    const resp = {
      message: 'Updated',
      data: { firstName: 'A', lastName: 'B', displayName: null, profilePictureUrl: 'https://p' },
    }

    await cfg.onSuccess(resp)

    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated' }))
    expect(rq.__queryClientMock.setQueryData).toHaveBeenCalled()
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
  })

  it('useUpdatePassword onSuccess shows success toast', async () => {
    useUpdatePassword()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = lastCall[0]

    await cfg.onSuccess({ message: 'Pwd changed' })

    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Pwd changed' }))
  })

  it('useDeleteAccount onSuccess calls logout, clears storage and redirects', async () => {
    useDeleteAccount()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = lastCall[0]

    // mock ApiClient.post for logout
    ApiClient.post.mockResolvedValueOnce({ success: true })

    // set pathname to non-admin scenario
    Object.defineProperty(window, 'location', {
      value: { pathname: '/some/path', href: '' },
      writable: true,
    })

    await cfg.onSuccess({ message: 'Deactivated' })

    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Deactivated' }))
    expect(ApiClient.post).toHaveBeenCalledWith('/auth/logout')
    expect(rq.__queryClientMock.clear).toHaveBeenCalled()
    expect(window.location.href).toBe('/auth/login')

    // admin path redirects to /admin/login
    Object.defineProperty(window, 'location', {
      value: { pathname: '/admin/dashboard', href: '' },
      writable: true,
    })

    await cfg.onSuccess({ message: 'Deactivated' })
    expect(window.location.href).toBe('/admin/login')
  })

  it('useUploadProfilePicture mutationFn uploads via fetch and onSuccess updates user', async () => {
    useUploadProfilePicture()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = lastCall[0]

    const file = new File(['abc'], 'avatar.png', { type: 'image/png' })
    ApiClient.post.mockResolvedValueOnce({ success: true, data: { uploadUrl: 'https://upload', publicUrl: 'https://public' } })
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({ ok: true })

    const publicUrl = await cfg.mutationFn({ fileExtension: 'png', file })

    expect(ApiClient.post).toHaveBeenCalledWith('/profile/picture/upload', { fileExtension: 'png' })
    expect(global.fetch).toHaveBeenCalledWith('https://upload', expect.objectContaining({ method: 'PUT', body: file, headers: expect.objectContaining({ 'Content-Type': 'image/png' }) }))
    expect(publicUrl).toBe('https://public')

    // simulate onSuccess side effects
    await cfg.onSuccess('https://public')
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Profile picture uploaded successfully' }))
    expect(rq.__queryClientMock.setQueryData).toHaveBeenCalled()
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
  })

  it('onError handlers show danger toast', async () => {
    // updateProfile error
    useUpdateProfile()
    let lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let cfg = lastCall[0]
    await cfg.onError({ message: 'bad' })
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ color: 'danger' }))

    // uploadProfilePicture error
    useUploadProfilePicture()
    lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = lastCall[0]
    await cfg.onError({ message: 'bad' })
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ color: 'danger' }))
  })

  it('useUpdateProfile onSuccess with null data still shows toast and does not throw', async () => {
    useUpdateProfile()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = lastCall[0]

    const resp = {
      message: 'Updated',
      data: null,
    }

    await expect(cfg.onSuccess(resp)).resolves.not.toThrow()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated' }))
  })

  it('useUploadProfilePicture mutationFn throws when fetch returns not ok', async () => {
    useUploadProfilePicture()
    const lastCall = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = lastCall[0]

    const file = new File(['abc'], 'avatar.png', { type: 'image/png' })
    ApiClient.post.mockResolvedValueOnce({ success: true, data: { uploadUrl: 'https://upload', publicUrl: 'https://public' } })
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({ ok: false })

    await expect(cfg.mutationFn({ fileExtension: 'png', file })).rejects.toThrow()
    // ensure ApiClient.post was still called to obtain upload url
    expect(ApiClient.post).toHaveBeenCalledWith('/profile/picture/upload', { fileExtension: 'png' })
  })
})
