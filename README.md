# Subtitle Burner

Ever wanted to Chromecast with subtitles, but most players like VLC simply do not support subtitles?

This utility makes it easy to burn subtitles inside `.mkv` files onto the video data itself
so that subtitles can be seen regardless of which player you are using.

## Installation

Make sure you have ffmpeg and NodeJS installed:

```shell
ffmpeg -version
node --version
```

Clone this repo and install everything

```shell
npm i
```

That's it! You can now right-click any `.mkv` file in Nautilus and select `Scripts -> Burn subtitles`.
