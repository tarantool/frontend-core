// @flow
import { Component } from 'react'
import icon from './favicon@32.png'
import iconSvg from './favicon.svg'

export default class FavIcon extends Component<any> {
  componentDidMount () {
    const svgIconElement = document.createElement('link')
    svgIconElement.setAttribute('rel', 'shortcut icon')
    svgIconElement.setAttribute('href', iconSvg)
    svgIconElement.setAttribute('type', 'image/svg+xml')
    svgIconElement.setAttribute('sizes', 'any')
    document.head && document.head.appendChild(svgIconElement)

    const pngIconElement = document.createElement('link')
    pngIconElement.setAttribute('rel', 'shortcut icon')
    pngIconElement.setAttribute('href', icon)
    pngIconElement.setAttribute('type', 'image/png')
    pngIconElement.setAttribute('sizes', '32x32')
    document.head && document.head.appendChild(pngIconElement)
  }

  render () {
    return null
  }
}
