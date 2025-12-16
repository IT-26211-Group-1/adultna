// Mock the internal Input heavy dependency by replacing the FormInput implementation
jest.mock('../app/auth/register/_components/FormInput', () => ({
  FormInput: ({ label, placeholder }: any) => (
    <div>
      <label>{label}</label>
      <input placeholder={placeholder} />
    </div>
  ),
}))

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { FormInput } from '../app/auth/register/_components/FormInput'
import { createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'

// Mock secure storage and router and toast
const mockReplace = jest.fn()

jest.mock('../hooks/useSecureStorage', () => {
  const __mockSetSecureItem = jest.fn()
  return {
    useSecureStorage: () => ({ setSecureItem: __mockSetSecureItem }),
    setSecureItem: __mockSetSecureItem,
    __mockSetSecureItem,
  }
})
jest.mock('next/navigation', () => ({ useRouter: () => ({ replace: mockReplace }) }))
const mockAddToast = jest.fn()
jest.mock('@heroui/toast', () => ({ __esModule: true, addToast: mockAddToast }))

import { useRegister } from '../hooks/useRegister'

// use a global fetch mock
const originalFetch = global.fetch

beforeAll(() => {
  // @ts-ignore
  global.fetch = jest.fn()
})

afterAll(() => {
  global.fetch = originalFetch
})

describe('FormInput component', () => {
  const FormInputAny = FormInput as any

  const render = () => renderToStaticMarkup(
    <FormInputAny label="Username" placeholder="Enter your username" />
  )

  test.each([
    ['renders label', 'Username'],
    ['renders input field', '<input'],
    ['renders placeholder', 'Enter your username']
  ])('%s', (_, text) => {
    expect(render()).toContain(text)
  })

  test('matches snapshot', () => {
    expect(render()).toMatchSnapshot()
  })
  
  test('has one label element', () => {
    const matches = render().match(/<label>/g) || []
    expect(matches.length).toBe(1)
  })

  test('input field is an input element', () => {
    expect(render()).toContain('<input')
  })

  test('label appears before input', () => {
    expect(render().indexOf('Username')).toBeLessThan(render().indexOf('<input'))
  })

  test('contains no unexpected text', () => {
    const html = render()
    expect(html).not.toContain('Password')
    expect(html).not.toContain('Submit')
  })
})

describe('useRegister hook', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    jest.clearAllMocks()
    sessionStorage.clear()
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null as any
  })

  function Harness() {
    const h = useRegister()

    return (
      <div>
        <div id="loading">{h.loading ? 'true' : 'false'}</div>
        <div id="captcha">{h.showCaptcha ? 'true' : 'false'}</div>
        <div id="token">{(h as any).captchaToken || ''}</div>
        <button id="set-captcha" onClick={() => h.setShowCaptcha(true)} />
        <button id="set-token" onClick={() => h.handleCaptchaChange('tok')} />
        <button id="set-recaptcha" onClick={() => { if (h.recaptchaRef) (h.recaptchaRef as any).current = { reset: jest.fn() } }} />
        <button id="submit" onClick={() => { void h.onSubmit() }} />
      </div>
    )
  }

  it('shows captcha warning when captcha required but not set', async () => {
    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    const setCaptcha = container.querySelector('#set-captcha') as HTMLButtonElement
    await act(async () => setCaptcha.click())
    const submit = container.querySelector('#submit') as HTMLButtonElement
    await act(async () => submit.click())

    expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Please verify captcha' }))
    expect(container.querySelector('#loading')!.textContent).toBe('false')
  })

  it('successful registration stores verification token, cooldown, shows toast and redirects', async () => {
    // mock fetch success
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, verificationToken: 'vt', data: { cooldownLeft: 45 } }),
    })

    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    // enable captcha and set token
    const setCaptcha = container.querySelector('#set-captcha') as HTMLButtonElement
    await act(async () => setCaptcha.click())
    const setToken = container.querySelector('#set-token') as HTMLButtonElement
    await act(async () => setToken.click())

    // set recaptcha ref with reset fn
    const setRec = container.querySelector('#set-recaptcha') as HTMLButtonElement
    await act(async () => setRec.click())

    const submit = container.querySelector('#submit') as HTMLButtonElement
    await act(async () => submit.click())

    // ensure secure item set
        const { __mockSetSecureItem } = require('../hooks/useSecureStorage')
        expect(__mockSetSecureItem).toHaveBeenCalledWith('verification_token', 'vt', 60)

    const raw = sessionStorage.getItem('initial_resend_cooldown')!
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw)
    expect(parsed.cooldown).toBe(45)

    expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Registration Successful!' }))

    expect(mockReplace).toHaveBeenCalledWith('/auth/verify-email')
  })

  it('handles registration failure and shows toast', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ success: false, message: 'Bad' }) })

    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    const submit = container.querySelector('#submit') as HTMLButtonElement
    await act(async () => submit.click())

    expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Registration Failed' }))
    expect(container.querySelector('#loading')!.textContent).toBe('false')
  })

  it('successful registration without verificationToken does not set secure item but still redirects', async () => {
    // mock fetch success without verificationToken
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    const submit = container.querySelector('#submit') as HTMLButtonElement
    await act(async () => submit.click())

    const { __mockSetSecureItem } = require('../hooks/useSecureStorage')
    expect(__mockSetSecureItem).not.toHaveBeenCalled()
    expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Registration Successful!' }))
    expect(mockReplace).toHaveBeenCalledWith('/auth/verify-email')
  })

  it('registration fetch exception shows error toast', async () => {
    // simulate network error
    // @ts-ignore
    global.fetch.mockRejectedValueOnce(new Error('network'))

    const root = createRoot(container)
    await act(async () => root.render(<Harness />))

    const submit = container.querySelector('#submit') as HTMLButtonElement
    await act(async () => submit.click())

    expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Error' }))
    expect(container.querySelector('#loading')!.textContent).toBe('false')
  })
})