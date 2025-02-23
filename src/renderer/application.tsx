import React, { useCallback, useEffect, useState } from 'react'
import { Button, LinearProgress, Paper, Typography } from '@mui/material'
import styled from 'styled-components'
import { DragAndDrop } from './components/drag-and-drop'
import { VideoInfo } from '../common/video-info'
import { Videos } from './videos'
import { Store } from './store'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import FolderIcon from '@mui/icons-material/Folder'

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

  const addFiles = useCallback(async (filePaths) => {
    setIsAddingFiles(true)
    const videos: VideoInfo[] = await Promise.all(
      filePaths.map((x) => window.electron.invoke<VideoInfo>('getVideoInfo', x)),
    )
    store.videos.push(...videos)
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
          <Button variant="outlined" color="secondary" startIcon={<AttachFileIcon />}>
            Add files...
          </Button>
          <Button variant="outlined" color="secondary" startIcon={<FolderIcon />}>
            Add folder...
          </Button>
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

      <div>Footer</div>
    </Container>
  )
}
