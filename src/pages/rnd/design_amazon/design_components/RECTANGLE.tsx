import React from 'react'

export interface COMPONENT_DATA {
  G_CODE_MAU: string,
  DOITUONG_NO: number,
  DOITUONG_NAME: string,
  PHANLOAI_DT: string,
  DOITUONG_STT: string,
  CAVITY_PRINT: number,
  GIATRI: string,
  FONT_NAME: string,
  FONT_SIZE: number,
  FONT_STYLE: string,
  POS_X: number,
  POS_Y: number,
  SIZE_W: number,
  SIZE_H: number,
  ROTATE: number,
  REMARK: string,
}

const RECTANGLE = ({DATA}: {DATA: COMPONENT_DATA}) => { 
  return (
    <div className='amazon_rectange' style={{ backgroundColor:'white', width: `${DATA.SIZE_W}mm`, height: `${DATA.SIZE_H}mm`, top: `${DATA.POS_Y}mm`, left: `${DATA.POS_X}mm`, position: 'absolute', transform:`rotate(${DATA.ROTATE}deg)`, transformOrigin: `top left` }}>      
    </div>
  )
}
export default RECTANGLE