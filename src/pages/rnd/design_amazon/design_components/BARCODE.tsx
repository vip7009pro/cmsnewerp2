import React from "react";
var Barcode = require("react-barcode");

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


const BARCODE = ({DATA}: {DATA: COMPONENT_DATA}) => {
  return (
    <div className='amz_barcode' style={{ position: 'absolute', top: `${DATA.POS_Y}mm`, left: `${DATA.POS_X}mm`, width:`${DATA.SIZE_W}mm`, height:`${DATA.SIZE_H}mm`,}}>     
      <Barcode
      value={DATA.GIATRI}
      format='CODE128'
      width={DATA.SIZE_W/41.47695504}
      height={DATA.SIZE_H/0.265}       
      displayValue={false}
      background='#fff'
      lineColor='black'
      margin={0}
      />
    </div>   
  );
};

export default BARCODE;
