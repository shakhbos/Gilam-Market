import React from 'react'

export default function Container({className,children}) {
  return (
    <div className={`w-full max-w-[1880px] px-[20px] mx-auto ${className && className} `}>
      {children}
    </div>
  )
}
