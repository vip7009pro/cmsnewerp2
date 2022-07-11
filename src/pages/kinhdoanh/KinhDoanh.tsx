import React from 'react'
import { Outlet } from 'react-router-dom'
import Widget from '../../components/Widget/Widget'

const KinhDoanh = () => {
  return (
    <div className='kinhdoanh'>
        <div className='widgets'>
          <Widget type='user' />
          <Widget type='order' />
          <Widget type='earning' />
          <Widget type='balance' />
        </div>       
        <Outlet/>
    </div>
  )
}

export default KinhDoanh