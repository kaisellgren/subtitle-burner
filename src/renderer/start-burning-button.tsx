import React, { ReactElement, useCallback, useState } from 'react'
import { Alert, Button, Snackbar, Tooltip } from '@mui/material'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import { Store } from './store'
import { useSnapshot } from 'valtio/react'
import { ApiClient } from './api-client'

interface StartBurningButtonProps {
  store: Store
  apiClient: ApiClient
}

export function StartBurningButton({ apiClient, store }: StartBurningButtonProps): ReactElement {
  const [isBurningStartedMessageShown, setIsBurningStartedMessageShown] = useState(false)
  const snap = useSnapshot(store)

  const hasVideosToBurn = snap.videos.some((x) => x.burnStartedAt == null && x.burnSettings.subtitleId != null)

  const burnSubtitles = useCallback(async () => {
    setIsBurningStartedMessageShown(true)
    for (const video of store.videos) {
      if (video.burnSettings.subtitleId == null || video.burnStartedAt != null) {
        continue
      }
      void apiClient.burnSubtitle(video)
    }
  }, [])

  return (
    <>
      <Tooltip title="Start burning every video">
        <Button
          variant="contained"
          color="primary"
          startIcon={<WhatshotIcon />}
          onClick={burnSubtitles}
          disabled={!hasVideosToBurn}
        >
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
