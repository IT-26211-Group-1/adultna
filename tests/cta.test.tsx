import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CTA } from '../app/(public)/(home)/_components/CTA'

describe('CTA component', () => {
  it('renders heading and buttons', () => {
    const html = renderToStaticMarkup(<CTA />)
    expect(html).toContain('Start your journey')
    expect(html).toContain('Learn more')
    expect(html).toContain('Get Started')
  })
})
