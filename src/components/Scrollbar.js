import * as React from 'react';
import ReactScroll from 'react-scrollbars-custom';
import styled from 'react-emotion';

const Track = styled.div`
  width: 4px !important;
  background: ${({ track }) => track || '#e8e8e8'} !important;
  border-radius: 7px !important;
`

const Thumb = styled.div`
  background: ${({ thumb }) => thumb || '#cf1322'} !important;
`

const trackYProps = {
  renderer: props => {
    const { elementRef, style, ...rest } = props;

    return <Track {...rest} style={style} innerRef={elementRef} />;
  }
}

const thumbYProps = {
  renderer: props => {
    const { elementRef, style, ...rest } = props;

    return <Thumb {...rest} style={style} innerRef={elementRef} />;
  }
}

type ScrollbarProps = {
  children?: React.Node,
  track?: string,
  thumb?: string,
  height?: string
}

function Scrollbar({ children, height = 'auto', track, thumb }: ScrollbarProps) {
  return (
    <ReactScroll
      track={track}
      thumb={thumb}
      trackYProps={{ ...trackYProps, track }}
      thumbYProps={{ ...thumbYProps, thumb }}
      style={{ width: '100%', height }}
    >
      {children}
    </ReactScroll>
  )
}

export default Scrollbar;