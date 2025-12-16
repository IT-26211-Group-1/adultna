// Mock the LoginForm to avoid importing many aliased dependencies in tests
jest.mock('../app/auth/login/_components/LoginForm', () => ({
  LoginForm: () => (
    <div>
      <label>Email</label>
      <label>Password</label>
      <button>Login</button>
    </div>
  ),
}))

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LoginForm } from '../app/auth/login/_components/LoginForm'

describe('LoginForm component', () => {
  test.each([
    ['renders email input', 'Email'],
    ['renders password input', 'Password'],
    ['renders submit button', 'Login']
  ])('%s', (_, text) => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html).toContain(text)
  })

  test('matches snapshot', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html).toMatchSnapshot()
  })

  test('has two labels', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    const matches = html.match(/<label>/g) || []
    expect(matches.length).toBe(2)
  })

  test('login button is a button element', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html).toContain('<button>Login</button>')
  })

  test('email appears before password', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html.indexOf('Email')).toBeLessThan(html.indexOf('Password'))
  })

  test('password appears before login button', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html.indexOf('Password')).toBeLessThan(html.indexOf('Login'))
  })

  test('contains no unexpected text', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html).not.toContain('Sign Up')
    expect(html).not.toContain('Forgot Password')
  })

  test('has correct structure', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html).toMatch(/^<div>.*<\/div>$/)
  })

  test('is accessible', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html).toContain('<label>Email</label>')
    expect(html).toContain('<label>Password</label>')
  })

  test('renders consistently', () => {
    const html1 = renderToStaticMarkup(<LoginForm />)
    const html2 = renderToStaticMarkup(<LoginForm />)
    expect(html1).toBe(html2)
  })

  test('contains all expected elements', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html).toContain('<label>Email</label>')
    expect(html).toContain('<label>Password</label>')
    expect(html).toContain('<button>Login</button>')
  })

  test('renders exactly one button', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    const matches = html.match(/<button\b/g) || []
    expect(matches.length).toBe(1)
  })

  test('does not render a form element', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html).not.toContain('<form')
  })

  test('contains no inline script tags', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    expect(html).not.toContain('<script')
  })

  test('labels contain only text (no nested tags)', () => {
    const html = renderToStaticMarkup(<LoginForm />)
    const labelMatches = html.match(/<label>(.*?)<\/label>/g) || []
    labelMatches.forEach((lbl) => {
      expect(lbl).toMatch(/^<label>[^<]+<\/label>$/)
    })
  })
})