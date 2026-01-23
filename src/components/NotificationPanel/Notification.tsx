import React from 'react'
import './Notification.scss'

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
  const formatNotiTime = (value: string) => {
    const raw = String(value || '').trim();
    const date = new Date(raw);
    if (!raw || Number.isNaN(date.getTime())) return raw;
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return raw;
    }
  };

  return (
    <div className='notification' role='listitem' tabIndex={0}>
      <div className="notification__header">
        <div className='notification__title' title={notidata.TITLE}>{notidata.TITLE}</div>
        <div className='notification__time'>{formatNotiTime(notidata.INS_DATE)}</div>
      </div>
      <div className='notification__content'>{notidata.CONTENT}</div>
    </div>
  )
}

export default Notification