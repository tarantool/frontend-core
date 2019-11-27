import React from 'react'
import { Icon } from 'antd'

export const MenuIcon = ({ icon, className }) => {
  if (typeof icon === 'string') {
    return <Icon type={icon} className={className} />
  }
  return <div className={className}>{icon}</div>
}
