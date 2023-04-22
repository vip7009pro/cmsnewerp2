import React from 'react'
import BARCODE from './design_components/BARCODE';
import RECTANGLE from './design_components/RECTANGLE'
import TEXT from './design_components/TEXT'


interface TEXT_DATA  {
  text: string,
  fontSize: number,
  top: string,
  left: string,
  fontFamily: string,
}

interface RECT_DATA  {
  backgroundColor: string,
  width: string,
  height: string,
  top: string,
  left: string,
 }

 
 interface BARCODE_DATA {
  text: string;
  width: number;
  height: number;
  top: string;
  left: string;
  type: string;
}
const DESIGN_AMAZON = () => {
  const tdt : TEXT_DATA = {
    text: 'nguyen van hung',
    fontSize: 6.5,
    top: '20mm',
    left: '20mm',
    fontFamily: 'Arial',
  }
  const ractdt : RECT_DATA = {
    backgroundColor: 'gray',
    width: '23mm',
    height: '28.6mm',
    top: '20mm',
    left: '20mm',
  }

  const barcodedt : BARCODE_DATA = {
    text: 'GH68-54619A',
    width: 1,
    height: 20,
    top: '30mm',
    left: '20mm',
    type: 'CODE128',
  }
  return (
    <div className='designAmazon' style={{position:'relative'}}>
        <RECTANGLE DATA={ractdt}/>
        <TEXT DATA={tdt}/>
        <BARCODE DATA={barcodedt}/>        
    </div>
  )
}
export default DESIGN_AMAZON