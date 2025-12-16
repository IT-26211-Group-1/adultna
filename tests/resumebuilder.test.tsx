// Tests for resume-related query hooks

// Mock react-query
jest.mock('@tanstack/react-query', () => {
  const __queryClientMock = {
    invalidateQueries: jest.fn(),
    refetchQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryState: jest.fn(),
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

// Mock ApiClient and queryKeys
const ApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}

jest.mock('@/lib/apiClient', () => ({
  ApiClient,
  queryKeys: {
    resumes: {
      list: () => ['resumes','list'],
      detail: (id?: string) => ['resumes','detail', id],
      contactInfo: (id?: string) => ['resumes','contact', id],
    },
  },
}))

const rq = require('@tanstack/react-query')
const resume = require('../hooks/queries/useResumeQueries')

describe('resume queries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('useResumes returns data and calls useQuery with a queryKey', () => {
    const sample = [{ id: 'r1' }]
    rq.useQuery.mockImplementationOnce(() => ({ data: sample, isLoading: false }))

    const res = resume.useResumes()
    expect(res.data).toBe(sample)
    const lastCall = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    expect(lastCall[0].queryKey).toBeDefined()
  })

  it('useResume enabled flag depends on resumeId', () => {
    // undefined id -> enabled false
    resume.useResume(undefined)
    let lastCall = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    expect(lastCall[0].enabled).toBe(false)

    // with id -> enabled true
    resume.useResume('res123')
    lastCall = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    expect(lastCall[0].enabled).toBe(true)
  })

  it('create/update/delete mutationFns call ApiClient with correct endpoints', async () => {
    // create
    resume.useCreateResume()
    let last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let cfg = last[0]
    ApiClient.post.mockResolvedValueOnce({ resume: { id: 'new' } })
    await cfg.mutationFn({ title: 'x' })
    expect(ApiClient.post).toHaveBeenCalledWith('/resumes', { title: 'x' })

    // update
    resume.useUpdateResume('rid')
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.patch.mockResolvedValueOnce({ resume: { id: 'rid' } })
    await cfg.mutationFn({ title: 'u' })
    expect(ApiClient.patch).toHaveBeenCalledWith('/resumes/rid', { title: 'u' })

    // delete
    resume.useDeleteResume()
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.delete.mockResolvedValueOnce({})
    await cfg.mutationFn('rid')
    expect(ApiClient.delete).toHaveBeenCalledWith('/resumes/rid')
  })

  it('useExportResume performs fetch and triggers download', async () => {
    // prepare env
    process.env.NEXT_PUBLIC_API = 'https://api'

    // mock fetch response
    const blob = new Blob(['pdf content'], { type: 'application/pdf' })
    const headers = new Map([['Content-Disposition', 'attachment; filename="cv.pdf"']])

    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      blob: async () => blob,
      headers: { get: (k: string) => headers.get(k) },
    })

    const createObj = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:1')
    const revokeObj = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const clickSpy = jest.fn()
    const appendSpy = jest.spyOn(document.body, 'appendChild')

    // stub createElement to return an anchor with click
    const originalCreate = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return { href: '', download: '', click: clickSpy, remove: () => {} } as any
      return originalCreate(tag)
    })

    resume.useExportResume()
    const last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    const cfg = last[0]

    await cfg.mutationFn('resX')

    expect(global.fetch).toHaveBeenCalledWith('https://api/resumes/resX/export', { method: 'GET', credentials: 'include' })
    expect(createObj).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    expect(revokeObj).toHaveBeenCalled()
  })

  it('work/education/certification/skill mutationFns call correct endpoints', async () => {
    // add work
    const resumeId = 'r1'
    const workData = { jobTitle: 'Dev' }
    resume.useAddWorkExperience(resumeId)
    let last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let cfg = last[0]
    // (cfg already set above)
    ApiClient.post.mockResolvedValueOnce({ success: true, data: { id: 'w1' } })
    await cfg.mutationFn(workData)
    expect(ApiClient.post).toHaveBeenCalledWith(`/resumes/${resumeId}/work-experiences`, workData)

    // update work
    resume.useUpdateWorkExperience(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.put.mockResolvedValueOnce({ success: true, data: {} })
    await cfg.mutationFn({ id: 'w1', data: { jobTitle: 'X' } })
    expect(ApiClient.put).toHaveBeenCalledWith(`/resumes/${resumeId}/work-experiences/w1`, { jobTitle: 'X' })

    // delete work
    resume.useDeleteWorkExperience(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.delete.mockResolvedValueOnce({})
    await cfg.mutationFn('w1')
    expect(ApiClient.delete).toHaveBeenCalledWith(`/resumes/${resumeId}/work-experiences/w1`)

    // education
    resume.useAddEducation(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.post.mockResolvedValueOnce({ success: true, data: {} })
    await cfg.mutationFn({ degree: 'BSc' })
    expect(ApiClient.post).toHaveBeenCalledWith(`/resumes/${resumeId}/education`, { degree: 'BSc' })

    resume.useUpdateEducation(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.put.mockResolvedValueOnce({ success: true, data: {} })
    await cfg.mutationFn({ id: 'e1', data: { degree: 'MSc' } })
    expect(ApiClient.put).toHaveBeenCalledWith(`/resumes/${resumeId}/education/e1`, { degree: 'MSc' })

    resume.useDeleteEducation(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.delete.mockResolvedValueOnce({})
    await cfg.mutationFn('e1')
    expect(ApiClient.delete).toHaveBeenCalledWith(`/resumes/${resumeId}/education/e1`)

    // certification
    resume.useAddCertification(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.post.mockResolvedValueOnce({ success: true, data: {} })
    await cfg.mutationFn({ certificate: 'Cert' })
    expect(ApiClient.post).toHaveBeenCalledWith(`/resumes/${resumeId}/certifications`, { certificate: 'Cert' })

    resume.useUpdateCertification(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.put.mockResolvedValueOnce({ success: true, data: {} })
    await cfg.mutationFn({ id: 'c1', data: { certificate: 'C2' } })
    expect(ApiClient.put).toHaveBeenCalledWith(`/resumes/${resumeId}/certifications/c1`, { certificate: 'C2' })

    resume.useDeleteCertification(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.delete.mockResolvedValueOnce({})
    await cfg.mutationFn('c1')
    expect(ApiClient.delete).toHaveBeenCalledWith(`/resumes/${resumeId}/certifications/c1`)

    // skills
    resume.useAddSkill(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.post.mockResolvedValueOnce({ success: true, data: {} })
    await cfg.mutationFn({ skill: 'JS' })
    expect(ApiClient.post).toHaveBeenCalledWith(`/resumes/${resumeId}/skills`, { skill: 'JS' })

    resume.useUpdateSkill(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.put.mockResolvedValueOnce({ success: true, data: {} })
    await cfg.mutationFn({ id: 's1', data: { skill: 'TS' } })
    expect(ApiClient.put).toHaveBeenCalledWith(`/resumes/${resumeId}/skills/s1`, { skill: 'TS' })

    resume.useDeleteSkill(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.delete.mockResolvedValueOnce({})
    await cfg.mutationFn('s1')
    expect(ApiClient.delete).toHaveBeenCalledWith(`/resumes/${resumeId}/skills/s1`)
  })

  it('contact info and summary endpoints and invalidations', async () => {
    const resumeId = 'r2'

    // get contact info enabled
    const getContact = resume.useGetContactInfo
    getContact(undefined)
    let last = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    expect(last[0].enabled).toBe(false)

    getContact(resumeId)
    last = rq.useQuery.mock.calls[rq.useQuery.mock.calls.length - 1]
    expect(last[0].enabled).toBe(true)

    // create contact info
    resume.useCreateContactInfo(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let cfg = last[0]
    ApiClient.post.mockResolvedValueOnce({ success: true, data: {} })
    await cfg.mutationFn({ phone: '123' })
    expect(ApiClient.post).toHaveBeenCalledWith(`/resumes/${resumeId}/contact-info`, { phone: '123' })
    // onSuccess should invalidate detail and contactInfo
    await cfg.onSuccess()
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()

    // update contact info
    resume.useUpdateContactInfo(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.put.mockResolvedValueOnce({ success: true, data: {} })
    await cfg.mutationFn({ phone: '456' })
    expect(ApiClient.put).toHaveBeenCalledWith(`/resumes/${resumeId}/contact-info`, { phone: '456' })
  })

  it('update summary, import, createFromImport, grade, and saveToFilebox behaviors', async () => {
    const resumeId = 'r3'

    // update summary
    resume.useUpdateSummary(resumeId)
    let last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let cfg = last[0]
    ApiClient.put.mockResolvedValueOnce({ success: true, data: {} })
    await cfg.mutationFn('new summary')
    expect(ApiClient.put).toHaveBeenCalledWith(`/resumes/${resumeId}/summary`, { summary: 'new summary' })

    // import resume success and failure
    resume.useImportResume()
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.post.mockResolvedValueOnce({ success: true, data: { extractedData: { firstName: 'A', workExperiences: [], educationItems: [], skills: [], certifications: [] } } })
    const res = await cfg.mutationFn({ fileKey: 'k', fileName: 'f' })
    expect(ApiClient.post).toHaveBeenCalledWith('/resumes/import', { fileKey: 'k', fileName: 'f' })
    expect(res.firstName).toBe('A')

    ApiClient.post.mockResolvedValueOnce({ success: false, message: 'bad' })
    await expect(cfg.mutationFn({ fileKey: 'k', fileName: 'f' })).rejects.toThrow()

    // create from import should post to /resumes and invalidate list
    resume.useCreateResumeFromImport()
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.post.mockResolvedValueOnce({ resume: { id: 'newr' } })
    await cfg.mutationFn({ templateId: 't1', extractedData: { firstName: 'A', workExperiences: [], educationItems: [], skills: [], certifications: [] } })
    expect(ApiClient.post).toHaveBeenCalledWith('/resumes', expect.any(Object))

    // grade
    resume.useGradeResume()
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.post.mockResolvedValueOnce({ success: true, data: { gradingResult: { overallScore: 90, maxPossibleScore: 100, hasJobDescription: false, categoryScores: { keywordOptimization: { score: 1, maxScore: 1, issues: [], strengths: [] }, formatCompatibility: { score: 1, maxScore: 1, issues: [], strengths: [] }, sectionCompleteness: { score: 1, maxScore: 1, issues: [], strengths: [] }, contentQuality: { score: 1, maxScore: 1, issues: [], strengths: [] } }, recommendations: [], summary: '', passRate: 'good' } } })
    const grade = await cfg.mutationFn({ resumeId })
    expect(ApiClient.post).toHaveBeenCalledWith('/resumes/grade', { resumeId })
    expect(grade.overallScore).toBe(90)

    // save to filebox
    resume.useSaveToFilebox(resumeId)
    last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    cfg = last[0]
    ApiClient.post.mockResolvedValueOnce({ success: true, data: { fileId: 'f1', fileKey: 'k1' } })
    const data = await cfg.mutationFn()
    expect(ApiClient.post).toHaveBeenCalledWith(`/resumes/${resumeId}/save-to-filebox`, {})
    expect(data.fileId).toBe('f1')
    // onSuccess invalidates filebox quota
    await cfg.onSuccess()
    expect(rq.__queryClientMock.invalidateQueries).toHaveBeenCalled()
  })

  it('createFromImport handles empty extracted data gracefully', async () => {
    resume.useCreateResumeFromImport()
    let last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let cfg = last[0]

    const extracted = {
      firstName: '',
      lastName: '',
      workExperiences: [],
      educationItems: [],
      skills: [],
      certifications: [],
    }

    ApiClient.post.mockResolvedValueOnce({ resume: { id: 'r-empty' } })

    const res = await cfg.mutationFn({ templateId: 't1', extractedData: extracted })
    expect(ApiClient.post).toHaveBeenCalledWith('/resumes', expect.any(Object))
    expect(res.id).toBe('r-empty')
  })

  it('createFromImport preserves malformed dates in work experiences', async () => {
    resume.useCreateResumeFromImport()
    let last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let cfg = last[0]

    const extracted = {
      firstName: 'A',
      lastName: 'B',
      jobPosition: 'Dev',
      workExperiences: [
        { jobTitle: 'X', employer: 'Y', startDate: 'not-a-date', endDate: 'tomorrow', currentlyWorking: false },
      ],
      educationItems: [],
      skills: [],
      certifications: [],
    }

    ApiClient.post.mockResolvedValueOnce({ resume: { id: 'r2' } })

    await cfg.mutationFn({ templateId: 't2', extractedData: extracted })

    expect(ApiClient.post).toHaveBeenCalledWith('/resumes', expect.objectContaining({ workExperiences: expect.arrayContaining([expect.objectContaining({ startDate: 'not-a-date', endDate: 'tomorrow' })]) }))
  })

  it('createFromImport rejects when API returns an error (missing required fields)', async () => {
    resume.useCreateResumeFromImport()
    let last = rq.useMutation.mock.calls[rq.useMutation.mock.calls.length - 1]
    let cfg = last[0]

    const extracted = {
      firstName: null,
      lastName: null,
      workExperiences: [],
      educationItems: [],
      skills: [],
      certifications: [],
    }

    ApiClient.post.mockRejectedValueOnce(new Error('validation'))

    await expect(cfg.mutationFn({ templateId: 't3', extractedData: extracted })).rejects.toThrow()
  })
})
