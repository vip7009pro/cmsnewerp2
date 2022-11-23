import React from 'react'

interface TEXT_DATA  {
    text: string,
    fontSize: number,
    top: string,
    left: string,
    fontFamily: string,
}
const TEXT = ({DATA}: {DATA: TEXT_DATA}) => {
  return (
    <div className='amazon_rectange' style={{ position: 'absolute', top: DATA.top, left: DATA.left, fontSize: DATA.fontSize,  fontFamily: DATA.fontFamily }}>
      {DATA.text}
    </div>
  )
}
export default TEXT