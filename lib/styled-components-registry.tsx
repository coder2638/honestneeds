'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import isPropValid from '@emotion/is-prop-valid'

/**
 * Styled Components Registry for Next.js App Router
 * - Collects styles during SSR via ServerStyleSheet and injects them into <head>
 * - Uses shouldForwardProp to prevent custom props (image, highlight, etc.) from
 *   leaking to the DOM and triggering React warnings
 */
export function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') {
    // On the client, we still need StyleSheetManager for shouldForwardProp
    return (
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        {children}
      </StyleSheetManager>
    )
  }

  return (
    <StyleSheetManager
      sheet={styledComponentsStyleSheet.instance}
      shouldForwardProp={shouldForwardProp}
    >
      {children}
    </StyleSheetManager>
  )
}

/**
 * Filter props passed to DOM elements.
 * Only forward props that are valid HTML attributes.
 * This prevents styled-components custom props like `highlight`, `image`,
 * `featured`, `disabled` (on non-form elements), etc. from reaching the DOM.
 */
function shouldForwardProp(propName: string, target: unknown): boolean {
  if (typeof target === 'string') {
    // For HTML elements, only forward valid HTML attributes
    return isPropValid(propName)
  }
  // For custom components, forward everything
  return true
}
