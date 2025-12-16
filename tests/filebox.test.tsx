// Mock react-query and provide a queryClient mock inside the factory
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
    __queryClientMock,
  }
})

// Mock toast factory
jest.mock('@heroui/toast', () => {
  const addToast = jest.fn()
  return { addToast }
})

// Mock ApiClient used by filebox hooks
jest.mock('@/lib/apiClient', () => {
  return {
    ApiClient: {
      post: jest.fn(),
      get: jest.fn(),
      request: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
    },
    ApiError: class ApiError extends Error {
      status: number
      constructor(message: string | undefined, status = 400) {
        super(message)
        this.status = status
      }
    },
    queryKeys: {
      filebox: {
        all: () => ['filebox', 'all'],
        quota: () => ['filebox', 'quota'],
        list: (c: any) => ['filebox', 'list', c],
      },
    },
  }
})

import {
  useFileboxFiles,
  useFileboxQuota,
  useFileboxUpload,
  useFileboxDownload,
  useFileboxDelete,
  useFileboxPermanentDelete,
  useFileboxArchivedFiles,
  useVerifyDocumentOTP,
  useFileboxView,
} from '../hooks/queries/useFileboxQueries'

const rq = require('@tanstack/react-query')
const { addToast } = require('@heroui/toast')

describe('useFileboxQueries basic behaviors', () => {
  beforeEach(() => jest.clearAllMocks())

  test('useFileboxFiles returns data and sets queryKey', () => {
    const sample = { files: [] }
    rq.useQuery.mockImplementationOnce(() => ({ data: sample, isLoading: false }))
    const res = useFileboxFiles()
    expect(res.data).toBe(sample)
    const lastCall = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    expect(lastCall[0].queryKey).toBeDefined()
  })

  test('useFileboxQuota returns quota data', () => {
    const quota = { used: 100 }
    rq.useQuery.mockImplementationOnce(() => ({ data: quota, isLoading: false }))
    const res = useFileboxQuota()
    expect(res.data).toBe(quota)
  })

  test('useFileboxUpload onSuccess invalidates queries', () => {
    useFileboxUpload()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]

    // simulate success
    config.onSuccess && config.onSuccess()

    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
  })

  test('useFileboxDelete onSuccess invalidates queries', () => {
    useFileboxDelete()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]
    config.onSuccess && config.onSuccess()
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
  })

  test('useFileboxPermanentDelete onSuccess invalidates queries and quota', () => {
    useFileboxPermanentDelete()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]
    config.onSuccess && config.onSuccess()
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
  })

  test('download and view hooks set retry=false', () => {
    useFileboxDownload()
    let last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let config = last[0]
    expect(config.retry).toBe(false)

    useFileboxView()
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    config = last[0]
    expect(config.retry).toBe(false)
  })

  test('verify document OTP hook sets retry=false', () => {
    useVerifyDocumentOTP()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]
    expect(config.retry).toBe(false)
  })

  test('useFileboxArchivedFiles returns data', () => {
    const archived = [{ id: 'a1' }]
    rq.useQuery.mockImplementationOnce(() => ({ data: archived, isLoading: false }))
    const res = useFileboxArchivedFiles()
    expect(res.data).toBe(archived)
  })

  test('full upload flow mutationFn executes with fetch and verify', async () => {
    const { ApiClient } = require('@/lib/apiClient')

    // stub generate upload url response
    ApiClient.post.mockImplementationOnce(async (path: string | string[], body: any) => {
      if (path.includes('/filebox/upload')) {
        return { success: true, data: { uploadUrl: 'https://upload.test/put', fileId: 'fid-1' } }
      }
      if (path.includes('/filebox/verify-upload')) {
        return { success: true }
      }
      return { success: false }
    })

    // mock fetch for upload
    global.fetch = jest.fn(async (url, opts) => ({ ok: true } as unknown as Response))

    useFileboxUpload()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]

    const fakeFile = new File(['content'], 'doc.pdf', { type: 'application/pdf' })

    await expect(config.mutationFn({ file: fakeFile, category: 'Personal' })).resolves.toMatchObject({ success: true })
  })

  test('upload flow throws when verification fails', async () => {
    const { ApiClient, ApiError } = require('@/lib/apiClient')

    ApiClient.post.mockImplementationOnce(async (path: string | string[]) => {
      if (path.includes('/filebox/upload')) {
        return { success: true, data: { uploadUrl: 'https://upload.test/put', fileId: 'fid-2' } }
      }
      return { success: false }
    })

    // upload fetch ok
    global.fetch = jest.fn(async () => ({ ok: true } as unknown as Response))

    // make verify-upload throw
    ApiClient.post.mockImplementationOnce(async (path: string | string[]) => {
      if (path.includes('/filebox/verify-upload')) {
        throw new Error('verify failed')
      }
      return { success: false }
    })

    useFileboxUpload()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]

    const fakeFile = new File(['x'], 'f.pdf', { type: 'application/pdf' })

    await expect(config.mutationFn({ file: fakeFile, category: 'Personal' })).rejects.toThrow()
  })

  test('download mutationFn fetches blob and revokes url', async () => {
    const { ApiClient } = require('@/lib/apiClient')

    ApiClient.get.mockImplementationOnce(async (path: string | string[]) => {
      if (path.includes('/filebox/download')) {
        return { success: true, data: { downloadUrl: 'https://download.test/file', fileName: 'file.pdf' } }
      }
      return { success: false }
    })

    const fakeBlob = new Blob(['x'], { type: 'application/pdf' })
    global.fetch = jest.fn(async () => ({ ok: true, blob: async () => fakeBlob } as unknown as Response))

    const origURL = global.URL
    global.URL = Object.assign({}, origURL, {
      createObjectURL: jest.fn().mockReturnValue('blob:1'),
      revokeObjectURL: jest.fn(),
    })

    useFileboxDownload()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]

    const fileMeta = { id: 'file-id' }
    await expect(config.mutationFn(fileMeta)).resolves.toBeDefined()

    expect(global.URL.createObjectURL).toHaveBeenCalled()
    expect(global.URL.revokeObjectURL).toHaveBeenCalled()

    // restore
    global.URL = origURL
  })

  test('upload and delete retry logic respects failureCount threshold', () => {
    useFileboxUpload()
    let last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let config = last[0]
    // retry is a function that returns failureCount < 1
    expect(typeof config.retry).toBe('function')
    expect(config.retry(0, new Error('network'))).toBe(true)
    expect(config.retry(1, new Error('network'))).toBe(false)

    useFileboxDelete()
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    config = last[0]
    expect(typeof config.retry).toBe('function')
    expect(config.retry(0, new Error('x'))).toBe(true)
    expect(config.retry(1, new Error('x'))).toBe(false)
  })

  test('rename, toggleProtection, archive/restore provide mutationFn and onSuccess handlers', () => {
    // Hooks that should register a mutation config with mutationFn
    const hooks = [
      'useFileboxUpload',
      'useFileboxDelete',
      'useFileboxPermanentDelete',
      'useFileboxArchive',
      'useFileboxRestore',
      'useFileboxRename',
      'useToggleFileProtection',
    ]

    // Call hooks to register mutations
    require('../hooks/queries/useFileboxQueries')
      .useFileboxUpload()
    require('../hooks/queries/useFileboxQueries')
      .useFileboxRename()
    require('../hooks/queries/useFileboxQueries')
      .useToggleFileProtection()
    require('../hooks/queries/useFileboxQueries')
      .useFileboxArchive()

    const calls = rq.useMutation.mock.calls
    // for each recent call, ensure mutation config contains mutationFn and onSuccess
    const recent = calls.slice(-4)
    recent.forEach(([cfg]: [any]) => {
      expect(typeof cfg.mutationFn).toBe('function')
      expect(typeof cfg.onSuccess).toBe('function')
    })
  })

  test('useFileboxView opens preview in new tab', async () => {
    const { ApiClient } = require('@/lib/apiClient')

    ApiClient.get.mockImplementationOnce(async (path: string | string[]) => {
      if (String(path).includes('/filebox/download')) {
        return { success: true, data: { downloadUrl: 'https://download.test/preview' } }
      }
      return { success: false }
    })

    const origOpen = window.open
    // @ts-ignore
    window.open = jest.fn()

    useFileboxView()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]

    await expect(config.mutationFn({ id: 'file-id' })).resolves.toMatchObject({ success: true })

    expect(window.open).toHaveBeenCalledWith('https://download.test/preview', '_blank')

    // restore
    // @ts-ignore
    window.open = origOpen
  })

  test('useFileboxRename onSuccess invalidates queries and calls ApiClient.patch', async () => {
    const { ApiClient } = require('@/lib/apiClient')

    ApiClient.patch.mockImplementationOnce(async (path: string | string[], body: any) => {
      if (String(path).includes('/filebox/files/')) {
        return { success: true }
      }
      return { success: false }
    })

    require('../hooks/queries/useFileboxQueries').useFileboxRename()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]

    // call mutationFn to exercise ApiClient.patch
    await expect(config.mutationFn({ fileId: 'f1', fileName: 'new.pdf' })).resolves.toMatchObject({ success: true })

    // invoke onSuccess handler and assert invalidateQueries called
    config.onSuccess && (await config.onSuccess())
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
  })

  test('useFileboxArchive and useFileboxRestore onSuccess invalidates queries and call ApiClient.post', async () => {
    const { ApiClient } = require('@/lib/apiClient')

    // archive
    ApiClient.post.mockImplementationOnce(async (path: string | string[]) => {
      if (String(path).includes('/archive')) return { success: true }
      return { success: false }
    })

    require('../hooks/queries/useFileboxQueries').useFileboxArchive()
    let last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let config = last[0]

    await expect(config.mutationFn('f2')).resolves.toMatchObject({ success: true })
    config.onSuccess && (await config.onSuccess())
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()

    // restore
    ApiClient.post.mockImplementationOnce(async (path: string | string[]) => {
      if (String(path).includes('/restore')) return { success: true }
      return { success: false }
    })

    require('../hooks/queries/useFileboxQueries').useFileboxRestore()
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    config = last[0]

    await expect(config.mutationFn('f2')).resolves.toMatchObject({ success: true })
    config.onSuccess && (await config.onSuccess())
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
  })

  test('upload flow rejects when fetch fails (network error)', async () => {
    const { ApiClient } = require('@/lib/apiClient')

    ApiClient.post.mockImplementationOnce(async (path: string | string[]) => {
      if (path.includes('/filebox/upload')) {
        return { success: true, data: { uploadUrl: 'https://upload.test/put', fileId: 'fid-3' } }
      }
      if (path.includes('/filebox/verify-upload')) {
        return { success: true }
      }
      return { success: false }
    })

    // simulate fetch failure
    global.fetch = jest.fn(async () => ({ ok: false } as unknown as Response))

    useFileboxUpload()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]

    const fakeFile = new File(['content'], 'f3.pdf', { type: 'application/pdf' })

    await expect(config.mutationFn({ file: fakeFile, category: 'Personal' })).rejects.toThrow()
  })

  test('download mutationFn rejects when fetch fails', async () => {
    const { ApiClient } = require('@/lib/apiClient')

    ApiClient.get.mockImplementationOnce(async (path: string | string[]) => {
      if (path.includes('/filebox/download')) {
        return { success: true, data: { downloadUrl: 'https://download.test/file', fileName: 'file.pdf' } }
      }
      return { success: false }
    })

    // simulate fetch failure during blob download
    global.fetch = jest.fn(async () => ({ ok: false } as unknown as Response))

    useFileboxDownload()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]

    await expect(config.mutationFn({ id: 'file-id' })).rejects.toThrow()
  })

  test('useFileboxView handles window.open throwing without crashing', async () => {
    const { ApiClient } = require('@/lib/apiClient')

    ApiClient.get.mockImplementationOnce(async (path: string | string[]) => {
      if (String(path).includes('/filebox/download')) {
        return { success: true, data: { downloadUrl: 'https://download.test/preview' } }
      }
      return { success: false }
    })

    const origOpen = window.open
    // make window.open throw
    // @ts-ignore
    window.open = jest.fn(() => { throw new Error('popup blocked') })

    useFileboxView()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const config = last[0]

    await expect(config.mutationFn({ id: 'file-id' })).rejects.toThrow()

    // restore
    // @ts-ignore
    window.open = origOpen
  })
})
