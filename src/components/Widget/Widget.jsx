import React from 'react'
import "../Widget/Widget.scss"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
export default function Widget({type}) {    
  return (
    <div className='widget'>
        <div className="left">
            <span className="title">USERS</span>
            <span className="counter">123456</span>
            <span className="link">All users</span>
        </div>
        <div className="right">
            <div className="percentage positive">
                <KeyboardArrowUpIcon/>
                20%
            </div>
            <PersonOutlineOutlinedIcon className='icon' />
        </div>
    </div>
  )
}
