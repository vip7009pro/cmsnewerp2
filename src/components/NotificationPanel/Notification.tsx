import React from 'react'
import './Notification.scss'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
export interface NotificationElement {
  CTR_CD: string,
  NOTI_ID: number,
  NOTI_TYPE: string,
  TITLE: string,
  CONTENT: string,
  SUBDEPTNAME: string,
  MAINDEPTNAME: string,
  INS_EMPL: string,
  INS_DATE: string,
  UPD_EMPL: string,
  UPD_DATE: string,
}
const Notification = ({notidata}: {notidata: NotificationElement}) => {
    const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
    
  return (
    <div className='notification' >
      <div className="header">
      <div className='title'>{notidata.TITLE}</div>
      <div className='time'>{notidata.INS_DATE}</div>
      </div>
      <p className='content'>{notidata.CONTENT}</p>
    </div>
  )
}

export default Notification