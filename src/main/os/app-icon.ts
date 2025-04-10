import path from 'node:path'
import { nativeImage } from 'electron'
import icon256 from '../../assets/icons/icon-256x256.png'

export const APP_ICON = nativeImage.createFromPath(path.join(__dirname, icon256 as string))
