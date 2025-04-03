import React, { ReactElement, useCallback, useState } from 'react'
import { BurnSubtitleRequest } from '../common/burn-subtitle-request'
import { Alert, Button, Snackbar, Tooltip } from '@mui/material'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import { Store } from './store'

interface StartBurningButtonProps {
  store: Store
}

export function StartBurningButton({ store }: StartBurningButtonProps): ReactElement {
  const [isBurningStartedMessageShown, setIsBurningStartedMessageShown] = useState(false)

  const burnSubtitles = useCallback(async () => {
    setIsBurningStartedMessageShown(true)
    for (const video of store.videos) {
      if (video.burnSettings.subtitleId == null) {
        continue
      }
      const request: BurnSubtitleRequest = {
        fullPath: video.fullPath,
        subtitleId: video.burnSettings.subtitleId,
        duration: video.durationInSeconds,
      }
      void window.electron.invoke('burnSubtitle', request)
      video.burnStartedAt = new Date()
      video.burnFinishedAt = null
      video.burnFailedAt = null
    }
  }, [])

  return (
    <>
      <Tooltip title="Start burning every video">
        <Button variant="contained" color="primary" startIcon={<WhatshotIcon />} onClick={burnSubtitles}>
          Start burning
        </Button>
      </Tooltip>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={isBurningStartedMessageShown}
        autoHideDuration={3000}
        onClose={() => setIsBurningStartedMessageShown(false)}
      >
        <Alert severity="info" variant="filled" sx={{ width: '100%' }} icon={<WhatshotIcon />}>
          Subtitle burning has started!
        </Alert>
      </Snackbar>
    </>
  )
}
