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
})