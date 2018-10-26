import { css } from 'react-emotion'
import React, {Component} from 'react';
import {mainColor} from '../colorConfig.js';

const octagon = (color, topBackground, bottomBackground, size, index=1) => {
	const angleSize = Math.round(size*0.29);
	const baseSize = Math.round(size*0.42);

	return css({
		width: `${size}px`,
		height: `${size}px`,
		background: color,
		position: 'relative',
		zIndex: index,
		boxSizing: 'content-box',
		':before': {
			content: '""',
			display: 'block',
			position: 'absolute',
			top: 0,
			left: 0,
			borderBottom: `${angleSize}px solid ${color}`,
			borderLeft: `${angleSize}px solid ${topBackground}`,
			borderRight: `${angleSize}px solid ${topBackground}`,
			width: `${baseSize}px`,
			height: 0,
			boxSizing: 'content-box',
		},
		':after': {
			content: '""',
			display: 'block',
			position: 'absolute',
			bottom: 0,
			left: 0,
			borderTop: `${angleSize}px solid ${color}`,
			borderLeft: `${angleSize}px solid ${bottomBackground}`,
			borderRight: `${angleSize}px solid ${bottomBackground}`,
			width: `${baseSize}px`,
			height: 0,
			boxSizing: 'content-box',
		}
	});
};

const TLetter = (color, topHeight, topWidth, bottomHeight, bottomWidth) => {
	return css({
		display: 'block',
		width: Math.max(topWidth, bottomWidth),
		height: topHeight+bottomHeight,
		transition: 'all 1s',
		':before': {
			content: '""',
			display: 'block',
			position: 'static',
			width: `${topWidth}px`,
			height: `${topHeight}px`,
			margin: '0 auto',
			background: color,
		},
		':after': {
			content: '""',
			display: 'block',
			position: 'static',
			width: `${bottomWidth}px`,
			height: `${bottomHeight}px`,
			margin: '0 auto',
			background: color,
		}
	})
};

const letterColor = 'black';
const roundColor = 'black';

const styles = {
	container: css`
		display: block;
		height: 70px;
		position: relative;
		background: ${mainColor};
		border: 2px solid black;
	`,
	logoContainer: css`
		position: absolute;
		right: 50px;
		top: 100%;
		transform: translate(0%, -50%);
		z-index: 1;
	`,
	logoRelative: css`
		position: relative;
	`,
	logoOuterOctagon: octagon(roundColor, mainColor, 'white', 100),
	logoInnerContainer: css`
		position: absolute;
		left: 10px;
		top: 10px;
		z-index:2
	`,
	logoInnerOctagon: octagon('white', roundColor, roundColor, 80, 2),
	logoLetterContainer: css`
		position: absolute;
		left: 50%;
		top: 55%;
		transform: translate(-50%, -50%);
		z-index: 5;
	`,
	logoLetter: TLetter(letterColor, 15, 50, 40, 15),
	title: css`
		display: block;
		color: white;
		position: absolute;
		bottom: 10px;
		left: 40px;
		font-size: 40px;
		font-family: 'Play';
	`
};

export default class TNTHeader extends Component{
	render(){
		return <div className={styles.container}>
			<div className={styles.title}>Tarantool Enterprise</div>
		</div>;
	}
}
