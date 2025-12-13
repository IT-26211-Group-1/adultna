import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CTA } from '../app/(public)/(home)/_components/CTA'

describe('CTA component', () => {
  test.each([
    ['renders heading', 'Start your journey'],
    ['renders Learn more', 'Learn more'],
    ['renders Get Started', 'Get Started']
  ])('%s', (_, text) => {
    const html = renderToStaticMarkup(<CTA />)
    expect(html).toContain(text)
  })

  test('matches snapshot', () => {
    const html = renderToStaticMarkup(<CTA />)
    expect(html).toMatchSnapshot()
  })

  test('has one h2 element', () => {
    const html = renderToStaticMarkup(<CTA />)
    const matches = html.match(/<h2>/g) || []
    expect(matches.length).toBe(1)
  })

  test('Learn more is an anchor element', () => {
    const html = renderToStaticMarkup(<CTA />)
    expect(html).toContain('<a href="/learn-more">Learn more</a>')
  })
})
