import React from "react";
import DataMatrix from 'react-datamatrix-svg'

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
const DATAMATRIX = ({DATA}: {DATA: COMPONENT_DATA}) => {
  return (

    <div className='amz_datamatrix' style={{ position: 'absolute', top: `${DATA.POS_Y}mm`, left: `${DATA.POS_X}mm`, width:`${DATA.SIZE_W}mm`, height:`${DATA.SIZE_H}mm`, transform:`rotate(${DATA.ROTATE}deg)` }}>     
      <DataMatrix msg={DATA.GIATRI} dim={DATA.SIZE_W/0.26458333333719} pad={0}/>
    </div>

   
  );
};

export default DATAMATRIX;
