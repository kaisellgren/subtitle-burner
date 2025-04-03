export interface Subtitle {
  id: string
  language: string
  title: string
}

export interface VideoInfo {
  id: string
  fullPath: string
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
  thumbnail: string | null
  subtitles: readonly Subtitle[]
}
