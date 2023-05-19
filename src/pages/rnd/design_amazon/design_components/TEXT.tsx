import React from 'react'

interface COMPONENT_DATA {
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
const TEXT = ({DATA}: {DATA: COMPONENT_DATA}) => {
  return (
    <div className='amz_text' style={{ position: 'absolute', top: `${DATA.POS_Y}mm`, left: `${DATA.POS_X}mm`, fontSize: `${DATA.FONT_SIZE}pt`,  fontFamily: `${DATA.FONT_NAME}`, fontWeight:DATA.FONT_STYLE==='B'? 'bold':'normal' , fontStyle: DATA.FONT_STYLE==='I'? 'italic':'normal', textDecoration: DATA.FONT_STYLE==='U'? 'underline':'none',  whiteSpace: 'nowrap',  }}>
      {DATA.GIATRI}
    </div>
  )
}
export default TEXT