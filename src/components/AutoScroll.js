import React, { useState, useEffect, useRef } from 'react'
import Scrollbar from './Scrollbar'

export function AutoScroll({className, maxHeight, children}) {
  const [height, setHeight] = useState(0)
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const clientHeight = scrollContainerRef.current.scrollHeight
    if (height !== clientHeight) {
      setHeight(clientHeight)
    }
  })

  const content = <div style={{ maxHeight }} ref={scrollContainerRef}>{children}</div>
  if (height > maxHeight) {
    return <Scrollbar track={'#e8e8e8'} style={{ height: maxHeight }}>
      {content}
    </Scrollbar>
  }
  return content
}
