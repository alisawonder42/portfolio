import type { AnchorHTMLAttributes, MouseEvent } from 'react'

import { navigate } from './routing'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/**
 * A real anchor that routes in-app on a plain click. Modified clicks, middle
 * clicks and external hrefs fall through to the browser, so opening a project
 * in a new tab still works.
 */
export function Link({ href, onClick, children, ...rest }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    if (/^[a-z]+:/i.test(href) && !href.startsWith(window.location.origin)) return

    event.preventDefault()
    navigate(href)
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
