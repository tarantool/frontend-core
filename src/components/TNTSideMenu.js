import {css, keyframes} from 'react-emotion'
import React, {Component} from 'react';
import {mainColor} from '../colorConfig';

const translateFromRight = keyframes`
	from{
		transform: translate3d(200px, 0, 0);
	}
	to{
		transform: translate3d(0, 0, 0);
	}
`;

const sideColor = '#fff';
const styles = {
	container: css`
		display: block;
		background: ${sideColor};	
		border: 2px solid black;
		border-top: none;
		overflow: hidden;
	`,
	menuTitle: css`
		display: block;
		font-size: 14px;
		margin-left: 20px;
		margin-top: 10px;
		color: rgba(0, 0, 0, 0.65);
	`,
	menuList: css`
		
	`,
	menuItem: css`
		display: block;
		font-size: 28px;
		padding-left: 20px;
		cursor: pointer;
		padding-top: 10px;
		padding-bottom: 10px;
		color: black;
		:hover{
			color: ${mainColor};
		}
	`,
	selectedMenuItem: css`
		background: ${mainColor};
		color: white;
		cursor: default;
		:hover{
			color: white;
		}
	`,
	submenuItem: css`
		display: block;
		margin-bottom: 15px;
		font-size: 18px;
		color: black;
		margin-left: 30px;
		cursor: pointer;
		:before{ content: '> '; display: inline-block; width: 20px; position: relative;}
		:hover{
			color: #ca0009;
			:before{ content: '@'; display: inline-block; width: 20px; position: relative;}
		}
		animation: ${translateFromRight} 1s;
	`,
	submenuList: css`
		display: block;
		margin-top: 10px;
	`
};

const menuList = ['Клиенты', 'Инженеры', 'Смены'];

export default class TNTSideMenu extends Component{
	render(){
		return <div className={styles.container}>
			<div className={styles.menuTitle}>menu</div>
			<div className={styles.menuList}>
				{menuList.map((t,i) => <a className={css`${styles.menuItem} ${i==2 && styles.selectedMenuItem}`}>{t}</a> )}
				<div className={styles.submenuList}> {menuList.map((t,i) => <a className={css`${styles.submenuItem}`}>{t}</a> )}</div>
			</div>
		</div> ;
	}
}
