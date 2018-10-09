import * as React from 'react'
import {connect} from 'react-redux'
import {css} from 'react-emotion'
import {push} from 'connected-react-router'

const styles = {
  menu: css``,
  item: css``,
  itemSelected: css``,
  itemLabel: css``,
  itemLoading: css``,
  itemSubItems: css``,
}

const MenuItem = ({path, selected, label, loading, expanded, items, onClick}) => {
  let subItems = null
  if (expanded){
    subItems = <div className={styles.itemSubItems}>
      {items.map(x => <MenuItem {...x} onClick={onClick}/>)}
    </div>
  }
  return <div className={styles.item}>
    <div className={`${styles.itemLabel} ${selected?styles.itemSelected:''}`} onClick={() => onClick(path)}>
      {label}
    </div>
    {loading && <div className={styles.itemLoading}></div>}
    {subItems}
  </div>
}

@connect((menu) => {
  return {
    menu
  }
})
export default class Menu extends React.Component{

  onClick(path){
    this.props.dispatch(push(path))
  }

  render() {
    const menu = this.props.menu
    return (
      <div>
        {menu.map(x => <MenuItem {...x} onClick={this.onClick} />)}
      </div>
    )
  }

}
