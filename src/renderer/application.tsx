import React from 'react'
import { Button, Paper, Typography } from '@mui/material'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem;
`

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const Description = styled.div`
  padding: 1rem;
`

export function Application() {
  return (
    <Container>
      <Header>
        <Typography variant="h2" component="h2">
          Burn subtitles
        </Typography>
        <HeaderButtons>
          <Button variant="contained">Add files...</Button>
          <Button variant="contained">Add folder...</Button>
        </HeaderButtons>
      </Header>

      <Paper elevation={0}>
        <Description>
          This tool lets you burn subtitles straight onto your video files. Start by adding files. Note: drag and drop
          is supported.
        </Description>
      </Paper>
    </Container>
  )
}
