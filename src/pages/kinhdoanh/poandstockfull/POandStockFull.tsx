import YCSXComponent from '../ycsxmanager/YCSXComponent/YCSXComponent'
import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

const POandStockFull = () => {  
  const [ycsxno, setYCSXNO] = useState<string>('');


  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content :  () => componentRef.current,
  });
  interface YCSXLIST {
    PROD_REQUEST_NO: string,
    G_CODE: string
  }
  const ycsxlist:Array<YCSXLIST> = [{PROD_REQUEST_NO: '2HC0020',G_CODE:'7C05142A'},{PROD_REQUEST_NO: '2HC0019',G_CODE:'7A07674A'},{PROD_REQUEST_NO: '2HA0051',G_CODE:'7A05268C'},{PROD_REQUEST_NO: '2HC0019',G_CODE:'7A07674A'},{PROD_REQUEST_NO: '2HC0019',G_CODE:'7A07674A'}]
  const renderYCSX = () => {
    return ycsxlist.map((element,index)=> <YCSXComponent key={index} PROD_REQUEST_NO={element.PROD_REQUEST_NO} G_CODE={element.G_CODE}/>)
  }


  return (
    <div>POandStockFull    
      <input type="text" value ={ycsxno} onChange={(e)=> {setYCSXNO(e.target.value);}}></input>
       <button onClick={handlePrint}>Print YCSX</button>  
       <div ref={componentRef} >
          {renderYCSX()}
        </div>
       
    </div>
  )
}

export default POandStockFull