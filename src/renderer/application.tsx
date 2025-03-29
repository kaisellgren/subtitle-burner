import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, LinearProgress, Paper, Snackbar, Tooltip, Typography } from '@mui/material'
import styled from 'styled-components'
import { DragAndDrop } from './components/drag-and-drop'
import { VideoInfo } from '../common/video-info'
import { Videos } from './videos'
import { Store } from './store'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import FolderIcon from '@mui/icons-material/Folder'
import { BurnSubtitleRequest } from '../common/burn-subtitle-request'
import { expectNotNull } from '../common/objects'
import { toVideo } from './video/video'
import { VideoBurnedEvent } from '../common/video-burned-event'
import { VideoBurnProgressEvent } from '../common/video-burn-progress-event'
import { VideoBurnFailedEvent } from '../common/video-burn-failed-event'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  height: 100vh;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const Description = styled.div`
  padding: 1rem;
`

const ScrollContainer = styled.div`
  flex: 1;
  height: 150px;
  min-height: 0;
  overflow: auto;
`

export function Application({ store }: { store: Store }) {
  const [isAddingFiles, setIsAddingFiles] = useState(false)
  const [isBurningStartedMessageShown, setIsBurningStartedMessageShown] = useState(false)

  useEffect(() => {
    window.electron.onCustomEvent('video-burned', (event: VideoBurnedEvent) => {
      const video = store.videos.find((x) => x.id == event.id)
      if (video) {
        video.burnProgressRate = 1
        video.burnFinishedAt = new Date()
      }
    })

    window.electron.onCustomEvent('video-burn-failed', (event: VideoBurnFailedEvent) => {
      const video = store.videos.find((x) => x.id == event.id)
      if (video) {
        video.burnProgressRate = 0
        video.burnFailedAt = new Date()
        video.burnError = event.error
      }
    })

    window.electron.onCustomEvent('video-burn-progress', (event: VideoBurnProgressEvent) => {
      const video = store.videos.find((x) => x.id == event.id)
      if (video) {
        video.burnProgressRate = event.progressRate
      }
    })
  }, [])

  const burnSubtitles = useCallback(async () => {
    setIsBurningStartedMessageShown(true)
    for (const video of store.videos) {
      const burnConfig = expectNotNull(
        store.burnConfigs.find((x) => x.videoId == video.id),
        `Expected burn config for video ${video.id}`,
      )
      if (burnConfig.subtitleId == null) {
        continue
      }
      const request: BurnSubtitleRequest = {
        fullPath: video.fullPath,
        subtitleId: burnConfig.subtitleId,
        duration: video.durationInSeconds,
      }
      void window.electron.invoke('burnSubtitle', request)
      video.burnStartedAt = new Date()
      video.burnFinishedAt = null
      video.burnFailedAt = null
    }
  }, [])

  const addFiles = useCallback(async (filePaths) => {
    setIsAddingFiles(true)
    const videos: VideoInfo[] = await Promise.all(
      filePaths.map((x) => window.electron.invoke<VideoInfo>('getVideoInfo', x)),
    )
    store.videos.push(...videos.map(toVideo))
    store.burnConfigs.push(
      ...videos.map((x) => {
        let subtitleId: string | null = null
        for (const lang of store.settings.preferredLanguages) {
          if (subtitleId) {
            break
          }
          subtitleId = x.subtitles.find((s) => s.language == lang)?.id ?? null
        }
        return {
          videoId: x.id,
          subtitleId,
        }
      }),
    )
    setIsAddingFiles(false)
  }, [])

  const onDropFiles = useCallback(async (files) => {
    const filePaths = files.map(window.electron.getFilePath)
    await addFiles(filePaths)
  }, [])

  return (
    <Container>
      <DragAndDrop onDropFiles={onDropFiles} />

      <Header>
        <Typography variant="h2" component="h2">
          Burn subtitles
        </Typography>
        <HeaderButtons>
          <Tooltip title="Add movies and TV shows">
            <Button variant="outlined" color="secondary" startIcon={<AttachFileIcon />}>
              Add files...
            </Button>
          </Tooltip>
          <Tooltip title="Add folder to search for movies and TV shows">
            <Button variant="outlined" color="secondary" startIcon={<FolderIcon />}>
              Add folder...
            </Button>
          </Tooltip>
        </HeaderButtons>
      </Header>

      <Paper elevation={0}>
        <Description>
          This tool lets you burn subtitles straight onto your video files. Start by adding files. Note: drag and drop
          is supported.
        </Description>
      </Paper>

      {isAddingFiles && <LinearProgress />}

      <ScrollContainer>
        <Videos store={store} />
      </ScrollContainer>

      <Footer>
        <Tooltip title="Start burning every video">
          <Button variant="contained" color="primary" startIcon={<WhatshotIcon />} onClick={burnSubtitles}>
            Start burning
          </Button>
        </Tooltip>
      </Footer>

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
    </Container>
  )
}
