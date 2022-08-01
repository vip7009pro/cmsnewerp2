import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { UserContext } from '../../api/Context';
import Widget from '../../components/Widget/Widget'

const KinhDoanh = () => {
  const [userData,setUserData] = useContext(UserContext);

  return (
    <div className='kinhdoanh'>
       {/*  <div className='widgets'>
          <Widget type='user' />
          <Widget type='order' />
          <Widget type='earning' />
          <Widget type='balance' />
        </div>        */}
        <Outlet/>
    </div>
  )
}

export default KinhDoanh