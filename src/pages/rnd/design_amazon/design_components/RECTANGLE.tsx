import React from 'react'

interface RECT_DATA  {
 backgroundColor: string,
 width: string,
 height: string,
 top: string,
 left: string,
}

const RECTANGLE = ({DATA}: {DATA: RECT_DATA}) => { 
  return (
    <div className='amazon_rectange' style={{backgroundColor: DATA.backgroundColor, width: DATA.width, height: DATA.height, top: DATA.top, left: DATA.left, position: 'absolute',}}>
      
    </div>
  )
}
export default RECTANGLE