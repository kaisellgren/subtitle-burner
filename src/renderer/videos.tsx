import { Paper, Typography } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import { formatBitRate, formatBytes, formatDateTime, formatDuration } from './util/format'
import { Store } from './store'
import { useSnapshot } from 'valtio/react'

interface Props {
  store: Store
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const VideoInfoContainer = styled.div`
  padding: 2rem;
`

const Summary = styled.div`
  display: table;
  margin-top: 2rem;
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

const ThumbnailContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
`

const Thumbnail = styled.div`
  > img {
    width: 320px;
  }
`

const Info = styled.div``

export function Videos({ store }: Props) {
  const snap = useSnapshot(store)

  return (
    <Container>
      {snap.videos.map((x, i) => {
        return (
          <Paper elevation={0} key={i}>
            <VideoInfoContainer>
              <ThumbnailContainer>
                <Thumbnail>
                  <img src={x.thumbnail} alt="" />
                </Thumbnail>
                <Info>
                  <Typography variant="h6" component="h6">
                    {x.filename} ({formatBytes(x.sizeInBytes)})
                  </Typography>
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
                </Info>
              </ThumbnailContainer>
            </VideoInfoContainer>
          </Paper>
        )
      })}
    </Container>
  )
}
