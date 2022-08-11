import YCSXComponent from '../ycsxmanager/YCSXComponent/YCSXComponent'
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const POandStockFull = () => {  
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content :  () => componentRef.current,
  });

  const ycsxlist:Array<number> = [1,2,3,4,5,6,7,8]
  const renderYCSX = () => {
    return ycsxlist.map((element,index)=> <YCSXComponent/>)
  }
  return (
    <div>POandStockFull    
       <button onClick={handlePrint}>Print YCSX</button>  
       <div ref={componentRef} >
          {renderYCSX()}
        </div>
       
    </div>
  )
}

export default POandStockFull