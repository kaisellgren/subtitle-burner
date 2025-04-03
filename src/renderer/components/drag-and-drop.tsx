import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

interface DragOverlayProps {
  $isDragging: boolean
}

const DragOverlay = styled.div<DragOverlayProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(p) => p.theme.palette.primary.main};
  opacity: 0.5;
  z-index: 1000000;
  border: 0.4rem dashed white;
`

interface Props {
  onDropFiles: (files: File[]) => void
}

export function DragAndDrop({ onDropFiles }: Props) {
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    window.addEventListener('dragover', (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy'
      }

      if (!isDragging) {
        setIsDragging(true)
      }
    })

    window.addEventListener('dragleave', (event) => {
      if (event.relatedTarget == null) {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)
      }
    })

    window.addEventListener('drop', async (event) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)

      if (event.dataTransfer) {
        onDropFiles(Array.from(event.dataTransfer.files))
      }
    })
  }, [])

  return isDragging ? <DragOverlay $isDragging={isDragging} /> : <></>
}
