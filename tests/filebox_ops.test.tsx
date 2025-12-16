import React from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'

// Mock dependencies before importing the hook
const mockFilesResponse = {
  success: true,
  data: {
    files: [
      {
        id: 'f1',
        fileName: 'doc1.pdf',
        category: 'other',
        fileSize: 1024,
        uploadDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        contentType: 'application/pdf',
        isSecure: false,
      },
      {
        id: 'f2',
        fileName: 'secure.docx',
        category: 'other',
        fileSize: 2048,
        uploadDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        isSecure: true,
      },
    ],
  },
}

const downloadMutateAsync = jest.fn().mockResolvedValue(undefined)
const archiveMutateAsync = jest.fn().mockResolvedValue(undefined)
const restoreMutateAsync = jest.fn().mockResolvedValue(undefined)
const permDeleteMutateAsync = jest.fn().mockResolvedValue(undefined)

jest.mock('@/hooks/queries/useFileboxQueries', () => ({
  useFileboxFiles: (cat?: string) => ({ data: mockFilesResponse, isLoading: false }),
  useFileboxDownload: () => ({ mutateAsync: downloadMutateAsync }),
  useFileboxArchive: () => ({ mutateAsync: archiveMutateAsync }),
  useFileboxRestore: () => ({ mutateAsync: restoreMutateAsync }),
  useFileboxPermanentDelete: () => ({ mutateAsync: permDeleteMutateAsync }),
}))

jest.mock('@/lib/apiClient', () => ({ ApiClient: { get: jest.fn() } }))
jest.mock('@heroui/toast', () => ({ addToast: jest.fn() }))
jest.mock('@/lib/logger', () => ({ logger: { error: jest.fn() } }))

import { useFileboxOperations } from '../hooks/useFileboxOperations'
const { ApiClient } = require('@/lib/apiClient')
const { addToast } = require('@heroui/toast')

describe('useFileboxOperations', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    jest.clearAllMocks()
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null as any
  })

  function Harness() {
    const ops = useFileboxOperations()

    return (
      <div>
        <div id="files-count">{ops.files.length}</div>
        <div id="selected">{ops.selectedFile?.name || ''}</div>
        <div id="preview">{ops.showPreview ? ops.previewUrl : ''}</div>
        <div id="secure">{ops.showSecureAccess ? ops.secureAction : ''}</div>

        <button id="click-file" onClick={() => ops.handleFileClick(ops.files[0])}>click</button>
        <button id="my-file" onClick={() => ops.handleMyFileClick(ops.files[0])}>my</button>
        <button id="recent-file" onClick={() => ops.handleRecentFileClick(ops.files[0])}>recent</button>
        <button id="double-nonsecure" onClick={() => ops.handleFileDoubleClick(ops.files[0])}>double</button>
        <button id="double-secure" onClick={() => ops.handleFileDoubleClick(ops.files[1])}>double-secure</button>
        <button id="download" onClick={() => ops.handleDownload()}>download</button>
        <button id="archive" onClick={() => ops.handleArchiveFile('f1')}>archive</button>
        <button id="restore" onClick={() => ops.handleRestoreFile('f1')}>restore</button>
        <button id="perm-delete" onClick={() => ops.handlePermanentDelete('f1')}>perm</button>
        <button id="show-details" onClick={() => ops.handleShowDetails(ops.files[0])}>details</button>
      </div>
    )
  }

  it('lists files and selection handlers work', async () => {
    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    expect(container.querySelector('#files-count')!.textContent).toBe('2')

    const click = container.querySelector('#click-file') as HTMLButtonElement
    await act(async () => click.click())
    expect(container.querySelector('#selected')!.textContent).toBe('doc1.pdf')

    const my = container.querySelector('#my-file') as HTMLButtonElement
    await act(async () => my.click())
    expect(container.querySelector('#selected')!.textContent).toBe('doc1.pdf')

    const recent = container.querySelector('#recent-file') as HTMLButtonElement
    await act(async () => recent.click())
    expect(container.querySelector('#selected')!.textContent).toBe('doc1.pdf')
  })

  it('double click non-secure opens preview via ApiClient.get', async () => {
    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    ApiClient.get.mockResolvedValueOnce({ success: true, data: { downloadUrl: 'https://x' } })

    const btn = container.querySelector('#double-nonsecure') as HTMLButtonElement
    await act(async () => btn.click())

    expect(container.querySelector('#preview')!.textContent).toBe('https://x')
  })

  it('double click secure shows secure access', async () => {
    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    const btn = container.querySelector('#double-secure') as HTMLButtonElement
    await act(async () => btn.click())

    expect(container.querySelector('#secure')!.textContent).toBe('preview')
  })

  it('download triggers mutateAsync and shows toast', async () => {
    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    // first select file
    const click = container.querySelector('#click-file') as HTMLButtonElement
    await act(async () => click.click())

    const dl = container.querySelector('#download') as HTMLButtonElement
    await act(async () => dl.click())

    expect(downloadMutateAsync).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Download started' }))
  })

  it('archive/restore/perm delete call mutateAsync and show toasts', async () => {
    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    const arc = container.querySelector('#archive') as HTMLButtonElement
    await act(async () => arc.click())
    expect(archiveMutateAsync).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'File archived successfully' }))

    const res = container.querySelector('#restore') as HTMLButtonElement
    await act(async () => res.click())
    expect(restoreMutateAsync).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'File restored successfully' }))

    const perm = container.querySelector('#perm-delete') as HTMLButtonElement
    await act(async () => perm.click())
    expect(permDeleteMutateAsync).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'File permanently deleted' }))
  })

  it('double click non-secure handles ApiClient.get rejection gracefully', async () => {
    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    // make get fail
    ApiClient.get.mockRejectedValueOnce(new Error('network'))

    const btn = container.querySelector('#double-nonsecure') as HTMLButtonElement
    await act(async () => btn.click())

    // preview should remain empty and toast should be shown
    expect(container.querySelector('#preview')!.textContent).toBe('')
    expect(addToast).toHaveBeenCalled()
  })

  it('download shows error toast when mutateAsync rejects', async () => {
    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    // make download mutate reject
    downloadMutateAsync.mockRejectedValueOnce(new Error('dl fail'))

    const click = container.querySelector('#click-file') as HTMLButtonElement
    await act(async () => click.click())

    const dl = container.querySelector('#download') as HTMLButtonElement
    await act(async () => dl.click())

    expect(downloadMutateAsync).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalled()
  })

  it('archive mutation rejection shows toast and does not crash', async () => {
    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    archiveMutateAsync.mockRejectedValueOnce(new Error('arc fail'))

    const arc = container.querySelector('#archive') as HTMLButtonElement
    await act(async () => arc.click())

    expect(archiveMutateAsync).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalled()
  })
})
