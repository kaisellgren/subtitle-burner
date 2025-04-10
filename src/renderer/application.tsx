import React, { useCallback, useState } from 'react'
import { Button, LinearProgress, Paper, Tooltip, Typography } from '@mui/material'
import styled from 'styled-components'
import { DragAndDrop } from './components/drag-and-drop'
import { VideoInfo } from '../common/video-info'
import { VideoList } from './video-list'
import { Store } from './store'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import FolderIcon from '@mui/icons-material/Folder'
import { toVideo } from './video/video'
import { StartBurningButton } from './start-burning-button'
import { StopBurningButton } from './stop-burning-button'
import { Flex } from './components/styled/flex'
import { ApiClient } from './api-client'
import { isSupportedFileType } from '../common/video'

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

  const addFiles = useCallback(async (filePaths: string[]) => {
    if (filePaths.length == 0) {
      return
    }

    setIsAddingFiles(true)

    const videoInfos: VideoInfo[] = await Promise.all(
      filePaths.filter(isSupportedFileType).map((x) => apiClient.getVideoInfo(x)),
    )

    for (const videoInfo of videoInfos) {
      if (store.videos.some((x) => x.fullPath == videoInfo.fullPath)) {
        continue
      }

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

  const addDirectories = useCallback(async (paths: string[]) => {
    for (const path of paths) {
      await addFiles(await apiClient.findVideoFiles(path))
    }
  }, [])

  const onDropFiles = useCallback(async (files: File[]) => {
    const paths = files.map((x) => apiClient.getFilePath(x))
    const filePaths = paths.filter(isSupportedFileType)
    const directoryPaths = paths.filter((x) => !isSupportedFileType(x))

    await addDirectories(directoryPaths)
    await addFiles(filePaths)
  }, [])

  const onSelectFiles = useCallback(async () => {
    await addFiles(await apiClient.selectFiles())
  }, [])

  const onSelectDirectories = useCallback(async () => {
    await addDirectories(await apiClient.selectDirectories())
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
            <Button variant="outlined" color="secondary" startIcon={<AttachFileIcon />} onClick={onSelectFiles}>
              Add files...
            </Button>
          </Tooltip>
          <Tooltip title="Add folder to search for movies and TV shows">
            <Button variant="outlined" color="secondary" startIcon={<FolderIcon />} onClick={onSelectDirectories}>
              Add folders...
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
        <VideoList apiClient={apiClient} store={store} />
      </ScrollContainer>

      <Footer>
        <Flex $gap={1}>
          <StopBurningButton apiClient={apiClient} store={store} />
          <StartBurningButton apiClient={apiClient} store={store} />
        </Flex>
      </Footer>
    </Container>
  )
}
