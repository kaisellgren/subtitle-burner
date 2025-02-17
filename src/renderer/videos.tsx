import { VideoInfo } from '../common/video-info'
import { Paper, Typography } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import { formatDateTime, formatDuration, formatBitRate, formatBytes } from './util/format'

interface Props {
  videos: VideoInfo[]
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const VideoInfo = styled.div`
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

export function Videos({ videos }: Props) {
  return (
    <Container>
      {videos.map((x, i) => {
        return (
          <Paper elevation={0}>
            <VideoInfo key={i}>
              <Typography variant="h6" component="h6">
                {x.filename} ({formatBytes(x.sizeInBytes)})
              </Typography>
              <Summary>
                <Details>
                  <Label>Format (codec):</Label>
                  <Value>{x.formatName} ({x.videoCodec})</Value>
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
            </VideoInfo>
          </Paper>
        )
      })}
    </Container>
  )
}
