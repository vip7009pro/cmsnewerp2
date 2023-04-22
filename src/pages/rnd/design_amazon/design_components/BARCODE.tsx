import React from "react";
var Barcode = require("react-barcode");

interface BARCODE_DATA {
  text: string;
  width: number;
  height: number;
  top: string;
  left: string;
  type: string;
}
const BARCODE = ({DATA}: {DATA: BARCODE_DATA}) => {
  return (

    <div className='amazon_rectange' style={{ position: 'absolute', top: DATA.top, left: DATA.left, width:'10mm', height:'5mm',}}>     
      <Barcode
      value={DATA.text}
      format={DATA.type}
      width={DATA.width}
      height={DATA.height}
      displayValue={false}
      background='#fff'
      lineColor='black'
      margin={0}            
    />
    </div>

   
  );
};

export default BARCODE;
