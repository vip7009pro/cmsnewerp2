import React from "react";
import QRCode from 'qrcode.react';

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
const QRCODE = ({DATA}: {DATA: COMPONENT_DATA}) => {
  return (

    <div className='amz_qrcode' style={{ position: 'absolute', top: `${DATA.POS_Y}mm`, left: `${DATA.POS_X}mm`, width:`${DATA.SIZE_W}mm`, height:`${DATA.SIZE_H}mm`, transform:`rotate(${DATA.ROTATE}deg)`, transformOrigin: `top left` }}>     
      <QRCode
        id='qrcode'
        value={DATA.GIATRI}
        size={DATA.SIZE_W/0.26458333333719}
        level={'H'}
        includeMargin={false}
        renderAs="svg"
        />
    </div>

   
  );
};

export default QRCODE;
