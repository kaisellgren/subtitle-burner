import { Store } from '../store'
import { ApiClient } from '../api-client'
import React, { ReactElement, useCallback, useState } from 'react'
import { Button, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import styled from 'styled-components'
import SubtitlesIcon from '@mui/icons-material/Subtitles'
import VideoSettingsIcon from '@mui/icons-material/VideoSettings'
import { SubtitlePreferences } from './subtitle-preferences'
import { EncodingPreferences } from './encoding-preferences'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const NavAndContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  gap: 2rem;
`

const BottomToolbar = styled.div`
  display: flex;
  justify-content: end;
  background: ${(p) => p.theme.palette.background.paper};
  width: 100%;
  padding: 1rem;
  box-shadow: 0 -0.5rem 1rem 0 rgba(0, 0, 0, 0.2);
`

const Nav = styled.div`
  border-right: 0.1rem solid ${(p) => p.theme.palette.divider};
  min-width: 20rem;
`

const Content = styled.div`
  padding: 2rem;
  flex: 1;
  height: 100%;
  overflow-y: auto;
`

export function Preferences({ store, apiClient }: { store: Store; apiClient: ApiClient }): ReactElement {
  const [page, setPage] = useState('encoding')

  document.title = 'Preferences'

  const onSave = useCallback(async () => {
    await apiClient.saveSettings(store.settings)
    window.close()
  }, [])

  return (
    <Container>
      <NavAndContent>
        <Nav>
          <List>
            <ListItemButton selected={page == 'encoding'} onClick={() => setPage('encoding')}>
              <ListItemIcon>
                <VideoSettingsIcon />
              </ListItemIcon>
              <ListItemText>Encoding</ListItemText>
            </ListItemButton>
            <ListItemButton selected={page == 'subtitles'} onClick={() => setPage('subtitles')}>
              <ListItemIcon>
                <SubtitlesIcon />
              </ListItemIcon>
              <ListItemText>Subtitles</ListItemText>
            </ListItemButton>
          </List>
        </Nav>
        <Content>
          {page == 'subtitles' && <SubtitlePreferences store={store} />}
          {page == 'encoding' && <EncodingPreferences store={store} />}
        </Content>
      </NavAndContent>
      <BottomToolbar>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </BottomToolbar>
    </Container>
  )
}
