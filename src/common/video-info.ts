export interface Subtitle {
  language: string
  title: string
}

export interface VideoInfo {
  filename: string
  path: string
  extension: string
  sizeInBytes: number
  createdAt: Date
  formatName: string
  durationInSeconds: number
  frameRate: number
  bitRate: number
  videoCodec: string
  aspectRatio: string
  width: number
  height: number
  subtitles: Subtitle[]
}
