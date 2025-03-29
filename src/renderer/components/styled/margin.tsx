import styled from 'styled-components'

interface Props {
  $top?: number
}

export const Margin = styled.div<Props>`
  margin-top: ${(p) => p.$top ?? 0}rem;
`
