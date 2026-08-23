import React from 'react'

export default function Card({ children, className = '', hover = false, padding = 'p-5', as: Comp = 'div', ...rest }) {
  return (
    <Comp
      className={`bg-white rounded-2xl border border-ink-100 shadow-soft ${padding} ${hover ? 'card-hover' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  )
}
