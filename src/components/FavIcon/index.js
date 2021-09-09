// @flow
import { Component } from 'react';

import iconSvg from './favicon.svg';
import icon128 from './favicon@128.png';
import icon32 from './favicon@32.png';

export default class FavIcon extends Component<any> {
  componentDidMount() {
    const svgIconElement = document.createElement('link');
    svgIconElement.setAttribute('rel', 'shortcut icon');
    svgIconElement.setAttribute('href', iconSvg);
    svgIconElement.setAttribute('type', 'image/svg+xml');
    svgIconElement.setAttribute('sizes', 'any');

    const pngIconElement = document.createElement('link');
    pngIconElement.setAttribute('rel', 'shortcut icon');
    pngIconElement.setAttribute('href', icon32);
    pngIconElement.setAttribute('type', 'image/png');
    pngIconElement.setAttribute('sizes', '32x32');

    const pngAppleIconElement = document.createElement('link');
    pngAppleIconElement.setAttribute('rel', 'apple-touch-icon');
    pngAppleIconElement.setAttribute('href', icon128);
    pngAppleIconElement.setAttribute('type', 'image/png');
    pngAppleIconElement.setAttribute('sizes', '180x180');

    document.head &&
      document.head.appendChild(svgIconElement) &&
      document.head.appendChild(pngIconElement) &&
      document.head.appendChild(pngAppleIconElement);
  }

  render() {
    return null;
  }
}
