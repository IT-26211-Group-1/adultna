import React from 'react'
import { act } from 'react-dom/test-utils'
import { createRoot } from 'react-dom/client'

// Mock the cover letter query hooks used inside the hook
jest.mock('../hooks/queries/useCoverLetterQueries', () => ({
  useGenerateUploadUrl: () => ({
    mutateAsync: async () => ({ uploadUrl: 'https://upload.example', fileKey: 'file-key-123' }),
    isPending: false,
  }),
  useUploadFile: () => ({
    mutateAsync: async () => undefined,
    isPending: false,
  }),
  useImportResume: () => ({
    mutateAsync: async () => ({ id: 'coverletter-abc' }),
    isPending: false,
  }),
  useExportCoverLetter: () => ({
    mutateAsync: async () => undefined,
    isPending: false,
  }),
  useChangeTone: () => ({
    mutateAsync: async () => ({ sectionId: 's1', content: 'changed' }),
    isPending: false,
  }),
}))

// Mock toast so we can assert it was called
jest.mock('@heroui/toast', () => ({ addToast: jest.fn() }))

// Mock logger alias used by the hook (avoid path-alias resolution issues)
jest.mock('@/lib/logger', () => ({ logger: { error: jest.fn() } }))

import { useCoverLetterEditor } from '../hooks/useCoverLetterEditor'

describe('useCoverLetterEditor (integration smoke)', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null as any
    jest.clearAllMocks()
  })

  function TestHarness() {
    const hook = useCoverLetterEditor()

    return (
      <div>
        <div data-testid="uploaded">{hook.uploadedFile?.name || ''}</div>
        <div data-testid="coverId">{hook.currentCoverLetterId || ''}</div>
        <div data-testid="processing">{hook.isProcessing ? '1' : '0'}</div>

        <button id="btn-upload" onClick={() => hook.handleFileUpload(new File(['a'], 'resume.pdf', { type: 'application/pdf' }))}>
          upload
        </button>
        <button id="btn-generate" onClick={() => hook.handleGenerateCoverLetter()}>
          generate
        </button>
        <button id="btn-download" onClick={() => hook.handleDownloadPDF()}>
          download
        </button>
        <button id="btn-change" onClick={() => hook.handleChangeTone({ sectionId: 's1', currentContent: 'x', targetTone: 'formal' })}>
          change
        </button>
      </div>
    )
  }

  it('uploads file and generates a cover letter, then downloads and changes tone', async () => {
    const root = createRoot(container)

    await act(async () => {
      root.render(<TestHarness />)
    })

    const uploadBtn = container.querySelector('#btn-upload') as HTMLButtonElement
    const genBtn = container.querySelector('#btn-generate') as HTMLButtonElement
    const downloadBtn = container.querySelector('#btn-download') as HTMLButtonElement
    const changeBtn = container.querySelector('#btn-change') as HTMLButtonElement

    // click upload -> uploadedFile should show
    await act(async () => {
      uploadBtn.click()
    })

    expect(container.querySelector('[data-testid="uploaded"]')!.textContent).toBe('resume.pdf')

    // click generate -> async chain should set cover id
    await act(async () => {
      genBtn.click()
      // allow async mutate chains to resolve
      await new Promise((r) => setTimeout(r, 0))
      await new Promise((r) => setTimeout(r, 0))
    })

    expect(container.querySelector('[data-testid="coverId"]')!.textContent).toBe('coverletter-abc')

    // click download (should not throw)
    await act(async () => {
      downloadBtn.click()
      await new Promise((r) => setTimeout(r, 0))
    })

    // click change tone and ensure it resolves
    await act(async () => {
      changeBtn.click()
      await new Promise((r) => setTimeout(r, 0))
    })

    // validate basic UI state values rendered
    expect(container.querySelector('[data-testid="processing"]')!.textContent).toBe('0')
  })

  it('handles generate-upload-url rejection gracefully', async () => {
    await jest.isolateModulesAsync(async () => {
      // override hooks to simulate generate upload url failure
      jest.mock('../hooks/queries/useCoverLetterQueries', () => ({
        useGenerateUploadUrl: () => ({
          mutateAsync: async () => { throw new Error('upload url error') },
          isPending: false,
        }),
        useUploadFile: () => ({ mutateAsync: async () => undefined, isPending: false }),
        useImportResume: () => ({ mutateAsync: async () => ({ id: 'x' }), isPending: false }),
        useExportCoverLetter: () => ({ mutateAsync: async () => undefined, isPending: false }),
        useChangeTone: () => ({ mutateAsync: async () => ({ sectionId: 's1', content: 'changed' }), isPending: false }),
      }))

      const { useCoverLetterEditor } = require('../hooks/useCoverLetterEditor')

      const container2 = document.createElement('div')
      document.body.appendChild(container2)
      const root = createRoot(container2)

      function LocalHarness() {
        const hook = useCoverLetterEditor()
        return <button id="btn" onClick={() => hook.handleFileUpload(new File(['a'], 'f.pdf'))}>u</button>
      }

      await act(async () => root.render(<LocalHarness />))
      const btn = container2.querySelector('#btn') as HTMLButtonElement

      await act(async () => {
        btn.click()
        await new Promise((r) => setTimeout(r, 0))
      })

      // should log error
      const { logger } = require('@/lib/logger')
      expect(logger.error).toHaveBeenCalled()

      document.body.removeChild(container2)
    })
  })

  it('handles upload fetch failure', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.mock('../hooks/queries/useCoverLetterQueries', () => ({
        useGenerateUploadUrl: () => ({ mutateAsync: async () => ({ uploadUrl: 'https://u', fileKey: 'k' }), isPending: false }),
        useUploadFile: () => ({ mutateAsync: async () => undefined, isPending: false }),
        useImportResume: () => ({ mutateAsync: async () => ({ id: 'x' }), isPending: false }),
        useExportCoverLetter: () => ({ mutateAsync: async () => undefined, isPending: false }),
        useChangeTone: () => ({ mutateAsync: async () => ({ sectionId: 's1', content: 'changed' }), isPending: false }),
      }))

      const { useCoverLetterEditor } = require('../hooks/useCoverLetterEditor')

      // simulate fetch failing
      const origFetch = global.fetch
      // @ts-ignore
      global.fetch = jest.fn(async () => ({ ok: false } as unknown as Response))

      const container2 = document.createElement('div')
      document.body.appendChild(container2)
      const root = createRoot(container2)

      function LocalHarness() {
        const hook = useCoverLetterEditor()
        return <button id="btn" onClick={() => hook.handleFileUpload(new File(['a'], 'f.pdf'))}>u</button>
      }

      await act(async () => root.render(<LocalHarness />))
      const btn = container2.querySelector('#btn') as HTMLButtonElement

      await act(async () => {
        btn.click()
        await new Promise((r) => setTimeout(r, 0))
      })

      const { logger } = require('@/lib/logger')
      expect(logger.error).toHaveBeenCalled()

      // restore
      // @ts-ignore
      global.fetch = origFetch
      document.body.removeChild(container2)
    })
  })

  it('handles import resume failure during generate', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.mock('../hooks/queries/useCoverLetterQueries', () => ({
        useGenerateUploadUrl: () => ({ mutateAsync: async () => ({ uploadUrl: 'https://u', fileKey: 'k' }), isPending: false }),
        useUploadFile: () => ({ mutateAsync: async () => undefined, isPending: false }),
        useImportResume: () => ({ mutateAsync: async () => { throw new Error('import fail') }, isPending: false }),
        useExportCoverLetter: () => ({ mutateAsync: async () => undefined, isPending: false }),
        useChangeTone: () => ({ mutateAsync: async () => ({ sectionId: 's1', content: 'changed' }), isPending: false }),
      }))

      const { useCoverLetterEditor } = require('../hooks/useCoverLetterEditor')

      const container2 = document.createElement('div')
      document.body.appendChild(container2)
      const root = createRoot(container2)

      function LocalHarness() {
        const hook = useCoverLetterEditor()
        return <button id="btn" onClick={() => hook.handleGenerateCoverLetter()}>g</button>
      }

      await act(async () => root.render(<LocalHarness />))
      const btn = container2.querySelector('#btn') as HTMLButtonElement

      await act(async () => {
        btn.click()
        await new Promise((r) => setTimeout(r, 0))
      })

      const { logger } = require('@/lib/logger')
      expect(logger.error).toHaveBeenCalled()

      document.body.removeChild(container2)
    })
  })

  it('handles change tone failure without crashing', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.mock('../hooks/queries/useCoverLetterQueries', () => ({
        useGenerateUploadUrl: () => ({ mutateAsync: async () => ({ uploadUrl: 'https://u', fileKey: 'k' }), isPending: false }),
        useUploadFile: () => ({ mutateAsync: async () => undefined, isPending: false }),
        useImportResume: () => ({ mutateAsync: async () => ({ id: 'x' }), isPending: false }),
        useExportCoverLetter: () => ({ mutateAsync: async () => undefined, isPending: false }),
        useChangeTone: () => ({ mutateAsync: async () => { throw new Error('tone fail') }, isPending: false }),
      }))

      const { useCoverLetterEditor } = require('../hooks/useCoverLetterEditor')

      const container2 = document.createElement('div')
      document.body.appendChild(container2)
      const root = createRoot(container2)

      function LocalHarness() {
        const hook = useCoverLetterEditor()
        return <button id="btn" onClick={() => hook.handleChangeTone({ sectionId: 's1', currentContent: 'x', targetTone: 'formal' })}>c</button>
      }

      await act(async () => root.render(<LocalHarness />))
      const btn = container2.querySelector('#btn') as HTMLButtonElement

      await act(async () => {
        btn.click()
        await new Promise((r) => setTimeout(r, 0))
      })

      const { logger } = require('@/lib/logger')
      expect(logger.error).toHaveBeenCalled()

      document.body.removeChild(container2)
    })
  })

  it('handles export/download window.open throwing', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.mock('../hooks/queries/useCoverLetterQueries', () => ({
        useGenerateUploadUrl: () => ({ mutateAsync: async () => ({ uploadUrl: 'https://u', fileKey: 'k' }), isPending: false }),
        useUploadFile: () => ({ mutateAsync: async () => undefined, isPending: false }),
        useImportResume: () => ({ mutateAsync: async () => ({ id: 'x' }), isPending: false }),
        useExportCoverLetter: () => ({ mutateAsync: async () => ({ downloadUrl: 'https://d' }), isPending: false }),
        useChangeTone: () => ({ mutateAsync: async () => ({ sectionId: 's1', content: 'changed' }), isPending: false }),
      }))

      const { useCoverLetterEditor } = require('../hooks/useCoverLetterEditor')

      const origOpen = window.open
      // @ts-ignore
      window.open = jest.fn(() => { throw new Error('popup blocked') })

      const container2 = document.createElement('div')
      document.body.appendChild(container2)
      const root = createRoot(container2)

      function LocalHarness() {
        const hook = useCoverLetterEditor()
        return <button id="btn" onClick={() => hook.handleDownloadPDF()}>d</button>
      }

      await act(async () => root.render(<LocalHarness />))
      const btn = container2.querySelector('#btn') as HTMLButtonElement

      await act(async () => {
        btn.click()
        await new Promise((r) => setTimeout(r, 0))
      })

      const { logger } = require('@/lib/logger')
      expect(logger.error).toHaveBeenCalled()

      // restore
      // @ts-ignore
      window.open = origOpen
      document.body.removeChild(container2)
    })
  })
})
