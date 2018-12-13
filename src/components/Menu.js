import {css, keyframes} from 'react-emotion'
import React, {Component} from 'react';
import {connect} from 'react-redux'
import {mainColor} from '../colorConfig';
import {push} from 'connected-react-router'
import * as constants from '../store/constants'

const translateFromRight = keyframes`
	from{
		transform: translate3d(200px, 0, 0);
	}
	to{
		transform: translate3d(0, 0, 0);
	}
`;


const styles = {
  container: css`
		display: block;
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
  item: css``,
  menuItem: css`
		display: block;
		font-size: 20px;
		font-family: Roboto;
		font-weight: 400;
		cursor: pointer;
		color: white;
		margin-bottom: 15px;
		width: 160px;
		transition: color 300ms;
		:hover{
			color: #e32636;
		}
	`,
  selectedMenuItem: css`
		border-bottom: 1px solid rgba(255, 39, 44, 1);   
		cursor: default;
		:hover{
			color: rgba(255, 39, 44, 1);
		}
	`,
  submenuItem: css`
		display: block;
		margin-bottom: 15px;
		font-size: 18px;
		color: white;
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
	`,
  itemLoading: css`
  `
};

const MenuItem = ({path, selected, label, loading, expanded, items, onClick}) => {
  let subItems = null
  if (expanded) {
    subItems = <div className={styles.submenuList}>
      {items.map(x => <MenuItem {...x} onClick={onClick}/>)}
    </div>
  }
  return <div className={styles.item}>
    <div className={`${styles.menuItem} ${selected?styles.selectedMenuItem:''}`}
         onClick={() => onClick(path)}>
      {label}
    </div>
    {loading && <div className={styles.itemLoading}></div>}
    {subItems}
  </div>
}

@connect(({menu}) => {
  return {
    menu,
  }
})
export default class Menu extends Component{

  onClick = (path) => {
    this.props.dispatch({type: constants.SELECT_MENU, payload: {path: path}})
    this.props.dispatch(push(path))
  }
  render(){
    const {menu} = this.props
    return <div className={styles.container}>
      <div className={styles.menuList}>
        {menu.map(x => <MenuItem {...x} key={x.path} onClick={this.onClick} />)}
      </div>
    </div> ;
  }
}
