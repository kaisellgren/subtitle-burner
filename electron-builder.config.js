/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: 'com.kaisellgren.subtitleburner',
  productName: 'Subtitle Burner',
  linux: {
    target: [
      'deb',
      'tar.gz',
    ],
    executableName: 'subtitle-burner',
    category: 'Utility',
    icon: 'src/assets/icons/icon-256x256.png',
  },
  deb: {
    depends: [
      'ffmpeg',
      'libgtk-3-0',
      'libnotify4',
      'libxapp1',
      'libnss3',
      'libxss1',
      'libxtst6',
      'xdg-utils',
      'libatspi2.0-0',
      'libuuid1',
      'libsecret-1-0',
      'libasound2',
    ],
  },
  pacman: {},
  rpm: {},
  files: [
    'dist/main/**/*',
    'dist/preload/**/*',
    'dist/renderer/**/*',
    'dist/assets/**/*',
    'package.json',
    '!**/node_modules/*/{test,__tests__,examples,docs}/**',
    '!**/*.map',
    '!**/locale/**',
    '!**/locales/**',
    '!**/*.md',
    '!**/test{,s}/**',
    '!**/__mocks__/**',
  ],
  extraFiles: [
    {
      from: 'screenshots/screenshot.jpg',
      to: 'usr/share/doc/subtitle-burner/screenshot.jpg',
    },
    {
      from: 'src/assets/appstream/appdata.xml',
      to: 'usr/share/metainfo/com.kaisellgren.subtitleburner.appdata.xml',
    },
  ],
  asar: true,
}
