import { css } from 'react-emotion'
import React, {Component} from 'react';
import TNTHeader from "./TNTHeader";
import TNTContent from "./TNTContent";

const styles = {
	layout: css`
    display: block;
	`,
	head: css`
		display: block;
	`,
	content: css`
		display:block;
	`
};

export default class TNTLayout extends Component{
	render(){
		return <div className={styles.layout}>
			<div className={styles.head}>
				<TNTHeader/>
			</div>
			<div className={styles.content}>
				<TNTContent/>
			</div>
		</div>;
	}
}