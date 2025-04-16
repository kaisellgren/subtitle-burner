import { Autocomplete, Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { LANGUAGE_CODES } from '../../common/language-codes'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import React, { useCallback, useState } from 'react'
import { Store } from '../store'
import { useSnapshot } from 'valtio/react'

interface SubtitlePreferencesProps {
  store: Store
}

export function SubtitlePreferences({ store }: SubtitlePreferencesProps) {
  const snap = useSnapshot(store)
  const [language, setLanguage] = useState<string | null>(null)

  const addLanguage = useCallback(() => {
    if (language != null) {
      store.settings.preferredLanguages.push(language)
      setLanguage(null)
    }
  }, [language])

  return (
    <>
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
    </>
  )
}
