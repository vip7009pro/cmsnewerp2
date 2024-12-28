import React from 'react'
import './Notification.scss'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
export interface NotificationElement {
  id: number,
  title: string,
  content: string;
  time: string
}
const Notification = ({id, title, content, time}: NotificationElement) => {
    const theme: any = useSelector((state: RootState) => state.totalSlice.theme);

  return (
    <div className='notification' >
      <div className="header">
      <div className='title'>{title}</div>
      <div className='time'>{time}</div>
      </div>
      <p className='content'>{content}</p>
    </div>
  )
}

export default Notification