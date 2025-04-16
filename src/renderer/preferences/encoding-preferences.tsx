import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import React from 'react'
import { Store } from '../store'
import { useSnapshot } from 'valtio/react'

interface Props {
  store: Store
}

export function EncodingPreferences({ store }: Props) {
  const snap = useSnapshot(store)

  return (
    <Stack spacing={2}>
      <FormControl>
        <TextField
          id="outlined-number"
          label="Maximum bitrate"
          type="number"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            input: {
              endAdornment: <InputAdornment position="start">bytes/s</InputAdornment>,
            },
          }}
          value={snap.settings.maximumBitrate}
          onChange={(e) => {
            store.settings.maximumBitrate = Number(e.target.value)
          }}
        />
        <FormHelperText>
          Higher bitrate means higher quality, but could cause buffering. Default is 5 000 000.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Encoding preset</FormLabel>
        <ToggleButtonGroup value={snap.settings.encodingPreset}>
          {encodingPresets.map((preset, i) => (
            <ToggleButton
              value={preset}
              key={i}
              selected={preset == snap.settings.encodingPreset}
              onClick={() => (store.settings.encodingPreset = preset)}
            >
              {preset}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <FormHelperText>
          Defines the speed of encoding. Faster encoding yields larger file sizes but saves time.
        </FormHelperText>
      </FormControl>
    </Stack>
  )
}

const encodingPresets = ['ultrafast', 'veryfast', 'fast', 'medium', 'slow', 'slower', 'veryslow']
