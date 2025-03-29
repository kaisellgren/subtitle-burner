import {
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { formatBitRate, formatBytes, formatDateTime, formatDuration, formatTimeRemaining } from './util/format'
import { Store } from './store'
import { useSnapshot } from 'valtio/react'
import { expectNotNull } from '../common/objects'
import { Video } from './video/video'
import { Margin } from './components/styled/margin'

interface Props {
  store: Store
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const VideoContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: start;
`

const Summary = styled.div`
  display: table;
  align-self: start;
`

const Details = styled.div`
  display: table-row;

  > div {
    display: table-cell;
  }
`

const Label = styled.div`
  padding-right: 4rem;
`

const Value = styled.div``

const Thumbnail = styled.div`
  align-self: center;

  > img {
    width: 320px;
    box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
  }
`

export function Videos({ store }: Props) {
  const snap = useSnapshot(store)

  return (
    <Container>
      {snap.videos.map((x) => {
        return (
          <Paper elevation={0} key={x.id} sx={{ padding: 2 }}>
            <VideoBlock video={x} store={store} />
          </Paper>
        )
      })}
    </Container>
  )
}

interface VideoBlockProps {
  video: Video
  store: Store
}

function VideoBlock({ video: x, store }: VideoBlockProps): ReactElement {
  return (
    <>
      <Typography variant="h6" component="h6" sx={{ mb: 1 }}>
        {x.filename} ({formatBytes(x.sizeInBytes)})
      </Typography>
      {x.burnFailedAt != null && (
        <>
          <Alert severity="error">
            <AlertTitle>Failed to burn subtitle onto video</AlertTitle>
            <details>
              <pre>{x.burnError}</pre>
            </details>
          </Alert>
        </>
      )}
      {x.burnStartedAt != null && x.burnFailedAt == null && (
        <>
          {x.burnFinishedAt == null && (
            <>
              <Details>
                <Label>Time remaining:</Label>
                <Value>
                  {x.burnProgressRate == 0
                    ? 'Estimating...'
                    : x.burnProgressRate == 1
                      ? 'Finished'
                      : formatTimeRemaining(x.burnStartedAt, x.burnProgressRate)}
                </Value>
              </Details>
              <Margin $top={1} />
            </>
          )}
          <LinearProgress variant="determinate" value={x.burnProgressRate * 100} />
        </>
      )}
      {x.burnStartedAt == null && (
        <VideoContainer>
          {x.thumbnail && (
            <Thumbnail>
              <img src={x.thumbnail} alt="" />
            </Thumbnail>
          )}
          <Summary>
            <Details>
              <Label>Format (codec):</Label>
              <Value>
                {x.formatName} ({x.videoCodec})
              </Value>
            </Details>
            <Details>
              <Label>Duration:</Label>
              <Value>{formatDuration(x.durationInSeconds)}</Value>
            </Details>
            <Details>
              <Label>Frame rate:</Label>
              <Value>{x.frameRate} fps</Value>
            </Details>
            <Details>
              <Label>Bit rate:</Label>
              <Value>{formatBitRate(x.bitRate)}</Value>
            </Details>
            <Details>
              <Label>Resolution:</Label>
              <Value>
                {x.width}x{x.height} ({x.aspectRatio})
              </Value>
            </Details>
            <Details>
              <Label>Created at:</Label>
              <Value>{formatDateTime(x.createdAt)}</Value>
            </Details>
          </Summary>
          <div>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id={`${x.id}-subtitle`}>Subtitle</InputLabel>
              <Select
                labelId={`${x.id}-subtitle`}
                value={x.burnSettings.subtitleId ?? ''}
                label="Subtitle"
                onChange={(e: SelectChangeEvent) => {
                  const storeBurnSettings = expectNotNull(
                    store.videos.find((s) => s.id == x.id)?.burnSettings,
                    `Could not find burn config for ${x.id}`,
                  )
                  storeBurnSettings.subtitleId = e.target.value
                }}
              >
                <MenuItem value={''} key="none">
                  <em>None</em>
                </MenuItem>
                {x.subtitles.map((subtitle, i) => (
                  <MenuItem value={subtitle.id} key={i}>
                    <span>
                      {subtitle.title} ({subtitle.language})
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </VideoContainer>
      )}
    </>
  )
}
