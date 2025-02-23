import { FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import { formatBitRate, formatBytes, formatDateTime, formatDuration } from './util/format'
import { Store } from './store'
import { useSnapshot } from 'valtio/react'
import { expectNotNull } from '../common/objects'

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
  }
`

export function Videos({ store }: Props) {
  const snap = useSnapshot(store)

  return (
    <Container>
      {snap.videos.map((x) => {
        const config = expectNotNull(
          snap.burnConfigs.find((c) => c.videoId == x.id),
          'Expected burn config',
        )

        return (
          <Paper elevation={0} key={x.id} sx={{ padding: 2 }}>
            <Typography variant="h6" component="h6" sx={{ mb: 1 }}>
              {x.filename} ({formatBytes(x.sizeInBytes)})
            </Typography>
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
                    value={config.subtitleId ?? ''}
                    label="Subtitle"
                    onChange={(e: SelectChangeEvent) => {
                      const storeBurnConfig = expectNotNull(
                        store.burnConfigs.find((s) => s.videoId == x.id),
                        `Could not find burn config for ${x.id}`,
                      )
                      storeBurnConfig.subtitleId = e.target.value
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
          </Paper>
        )
      })}
    </Container>
  )
}
