import styled from 'styled-components'

interface Props {
  $gap?: number
}

export const Flex = styled.div<Props>`
  display: flex;
  justify-content: space-between;
  gap: ${(p) => p.$gap ?? 0}rem;
`
