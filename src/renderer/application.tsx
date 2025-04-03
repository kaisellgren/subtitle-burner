import React, { useCallback, useState } from 'react'
import { Button, LinearProgress, Paper, Tooltip, Typography } from '@mui/material'
import styled from 'styled-components'
import { DragAndDrop } from './components/drag-and-drop'
import { VideoInfo } from '../common/video-info'
import { Videos } from './videos'
import { Store } from './store'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import FolderIcon from '@mui/icons-material/Folder'
import { toVideo } from './video/video'
import { StartBurningButton } from './start-burning-button'
import { StopBurningButton } from './stop-burning-button'
import { Flex } from './components/styled/flex'
import { ApiClient } from './client'

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

export function Application({ store, apiClient }: { store: Store; apiClient: ApiClient }) {
  const [isAddingFiles, setIsAddingFiles] = useState(false)

  const addFiles = useCallback(async (filePaths) => {
    setIsAddingFiles(true)

    const videoInfos: VideoInfo[] = await Promise.all(
      filePaths.map((x) => window.electron.invoke<VideoInfo>('getVideoInfo', x)),
    )

    for (const videoInfo of videoInfos) {
      const video = toVideo(videoInfo)

      let subtitleId: string | null = null
      for (const lang of store.settings.preferredLanguages) {
        if (subtitleId == null) {
          subtitleId = videoInfo.subtitles.find((s) => s.language == lang)?.id ?? null
        }
      }
      video.burnSettings.subtitleId = subtitleId

      store.videos.push(video)
    }

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
          Subtitle Burner
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
        <Videos apiClient={apiClient} store={store} />
      </ScrollContainer>

      <Footer>
        <Flex $gap={1}>
          <StopBurningButton apiClient={apiClient} store={store} />
          <StartBurningButton store={store} />
        </Flex>
      </Footer>
    </Container>
  )
}
