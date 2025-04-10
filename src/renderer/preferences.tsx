import { Store } from './store'
import { ApiClient } from './api-client'
import React, { ReactElement, useCallback, useState } from 'react'
import { Autocomplete, Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import { useSnapshot } from 'valtio/react'
import styled from 'styled-components'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { LANGUAGE_CODES } from '../common/language-codes'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const BottomToolbar = styled.div`
  display: flex;
  justify-content: end;
  background: ${(p) => p.theme.palette.background.paper};
  width: 100%;
  padding: 1rem;
  box-shadow: 0 -0.5rem 1rem 0 rgba(0, 0, 0, 0.2);
`

const Content = styled.div`
  padding: 2rem;
  flex: 1;
  height: 100%;
  overflow-y: auto;
`

export function Preferences({ store, apiClient }: { store: Store; apiClient: ApiClient }): ReactElement {
  const snap = useSnapshot(store)
  const [language, setLanguage] = useState<string | null>(null)

  document.title = 'Preferences'

  const addLanguage = useCallback(() => {
    if (language != null) {
      store.settings.preferredLanguages.push(language)
      setLanguage(null)
    }
  }, [language])

  const onSave = useCallback(async () => {
    await apiClient.saveSettings(store.settings)
    window.close()
  }, [])

  return (
    <Container>
      <Content>
        <Typography variant="h4" component="h4" mb={1}>
          Subtitles
        </Typography>
        <Typography variant="body1" component="p">
          Specify the languages you want to use. Place the most preferred languages at the top.
        </Typography>
        <Stack spacing={1} mt={2}>
          {snap.settings.preferredLanguages.map((lang, i) => (
            <Box key={lang} display="flex" alignItems="center" gap={1}>
              <Box display="flex" gap={1}>
                <IconButton
                  disabled={i == 0}
                  sx={{ padding: 0 }}
                  onClick={() => {
                    store.settings.preferredLanguages.splice(i, 1)
                    store.settings.preferredLanguages.splice(i - 1, 0, lang)
                  }}
                >
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  disabled={i == snap.settings.preferredLanguages.length - 1}
                  sx={{ padding: 0 }}
                  onClick={() => {
                    store.settings.preferredLanguages.splice(i, 1)
                    store.settings.preferredLanguages.splice(i + 1, 0, lang)
                  }}
                >
                  <ArrowDownwardIcon />
                </IconButton>
              </Box>
              <TextField value={LANGUAGE_CODES[lang]} disabled />
              <IconButton onClick={() => store.settings.preferredLanguages.splice(i, 1)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
        <Box display="flex" gap={1} mt={2}>
          <Autocomplete
            value={language}
            onChange={(_, value) => setLanguage(value)}
            disablePortal
            options={Object.keys(LANGUAGE_CODES).filter((x) => !snap.settings.preferredLanguages.includes(x))}
            getOptionLabel={(x) => LANGUAGE_CODES[x] ?? 'Unknown'}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Language" />}
          />
          <Button startIcon={<AddIcon />} variant="outlined" onClick={addLanguage}>
            Add language
          </Button>
        </Box>
      </Content>
      <BottomToolbar>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </BottomToolbar>
    </Container>
  )
}
