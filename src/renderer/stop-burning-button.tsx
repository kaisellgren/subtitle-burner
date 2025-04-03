import React, { ReactElement, useCallback, useState } from 'react'
import { Alert, Button, Snackbar, Tooltip } from '@mui/material'
import { Store } from './store'
import { useSnapshot } from 'valtio/react'
import { isBurning } from './video/video'
import InfoIcon from '@mui/icons-material/Info'
import StopIcon from '@mui/icons-material/Stop'
import { ApiClient } from './client'

interface StartBurningButtonProps {
  apiClient: ApiClient
  store: Store
}

export function StopBurningButton({ apiClient, store }: StartBurningButtonProps): ReactElement {
  const [isNotificationShown, setIsNotificationShown] = useState(false)
  const snap = useSnapshot(store)

  const isBurningVideos = snap.videos.some(isBurning)

  const stopBurning = useCallback(async () => {
    setIsNotificationShown(true)
    for (const video of store.videos) {
      if (isBurning(video)) {
        await apiClient.stopBurningSubtitle(video)
      }
    }
  }, [])

  return (
    <>
      <Tooltip title="Stop burning subtitles onto videos">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<StopIcon />}
          onClick={stopBurning}
          disabled={!isBurningVideos}
        >
          Stop burning
        </Button>
      </Tooltip>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={isNotificationShown}
        autoHideDuration={3000}
        onClose={() => setIsNotificationShown(false)}
      >
        <Alert severity="info" variant="filled" sx={{ width: '100%' }} icon={<InfoIcon />}>
          Subtitle burning has stopped.
        </Alert>
      </Snackbar>
    </>
  )
}
