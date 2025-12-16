import React from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'

jest.useFakeTimers()

import { useIdleTimeout } from '../hooks/useIdleTimeout'

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
]

function Harness({ onIdle, onWarning, enabled, warningTime }: any) {
  const { resetIdleTimer } = useIdleTimeout({ onIdle, onWarning, warningTime, enabled }, enabled)

  return (
    <div>
      <button id="reset" onClick={() => resetIdleTimer()} />
    </div>
  )
}

describe('useIdleTimeout', () => {
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

  it('adds activity event listeners when enabled and removes on unmount', async () => {
    const addSpy = jest.spyOn(window, 'addEventListener')
    const removeSpy = jest.spyOn(window, 'removeEventListener')

    let root: any = null

    await act(async () => {
      root = createRoot(container)
      root.render(<Harness onIdle={() => {}} onWarning={() => {}} enabled={true} warningTime={1000} />)
    })

    expect(addSpy).toHaveBeenCalled()
    // should register for all activity events
    ACTIVITY_EVENTS.forEach((ev) => expect(addSpy).toHaveBeenCalledWith(ev, expect.any(Function), { passive: true }))

    // unmount and expect removals
    await act(async () => {
      root.unmount()
    })

    expect(removeSpy).toHaveBeenCalled()
    ACTIVITY_EVENTS.forEach((ev) => expect(removeSpy).toHaveBeenCalledWith(ev, expect.any(Function)))
  })

  it('calls onWarning before idle and onIdle after timeout', async () => {
    const onWarning = jest.fn()
    const onIdle = jest.fn()

    // render harness
    await act(async () => {
      const root = createRoot(container)
      root.render(<Harness onIdle={onIdle} onWarning={onWarning} enabled={true} warningTime={2000} />)
    })

    // default IDLE_TIMEOUT = 900000, WARNING default 120000, but we passed warningTime=2000
    // advance to just after warning trigger
    const IDLE = 15 * 60 * 1000
    const warnTime = 2000
    const timeUntilWarning = IDLE - warnTime

    await act(async () => {
      jest.advanceTimersByTime(timeUntilWarning + 10)
    })

    expect(onWarning).toHaveBeenCalled()

    // advance to idle
    await act(async () => {
      jest.advanceTimersByTime(warnTime + 10)
    })

    expect(onIdle).toHaveBeenCalled()
  })

  it('does nothing when disabled', async () => {
    const addSpy = jest.spyOn(window, 'addEventListener')
    const onIdle = jest.fn()

    await act(async () => {
      const root = createRoot(container)
      root.render(<Harness onIdle={onIdle} onWarning={() => {}} enabled={false} warningTime={1000} />)
    })

    expect(addSpy).not.toHaveBeenCalled()
  })

  it('resetIdleTimer schedules a new warning after being called', async () => {
    const onWarning = jest.fn()
    const onIdle = jest.fn()

    await act(async () => {
      const root = createRoot(container)
      root.render(<Harness onIdle={onIdle} onWarning={onWarning} enabled={true} warningTime={2000} />)
    })

    // call reset immediately to ensure timers are (re)scheduled
    const btn = container.querySelector('#reset') as HTMLButtonElement
    await act(async () => {
      btn.click()
    })

    // advance to the computed time until warning and ensure it fires
    const IDLE = 15 * 60 * 1000
    const warnTime = 2000
    const timeUntilWarning = IDLE - warnTime

    await act(async () => {
      jest.advanceTimersByTime(timeUntilWarning + 10)
    })

    expect(onWarning).toHaveBeenCalled()
  })

  it('activity events reset timers so warning is delayed', async () => {
    const onWarning = jest.fn()
    const onIdle = jest.fn()

    await act(async () => {
      const root = createRoot(container)
      root.render(<Harness onIdle={onIdle} onWarning={onWarning} enabled={true} warningTime={2000} />)
    })

    const IDLE = 15 * 60 * 1000
    const warnTime = 2000
    const timeUntilWarning = IDLE - warnTime

    // advance to just before warning
    await act(async () => {
      jest.advanceTimersByTime(timeUntilWarning - 50)
    })

    // simulate activity event which should reset timers
    await act(async () => {
      window.dispatchEvent(new Event('mousemove'))
    })

    // advance past original warning time - should NOT trigger warning yet
    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    expect(onWarning).not.toHaveBeenCalled()

    // advance full interval now, warning should trigger
    await act(async () => {
      jest.advanceTimersByTime(timeUntilWarning + 10)
    })

    expect(onWarning).toHaveBeenCalled()
  })
})
