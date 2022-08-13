import YCSXComponent from '../ycsxmanager/YCSXComponent/YCSXComponent'
import  { ReactElement, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import './POandStockFull.scss'
import DrawComponent from '../ycsxmanager/DrawComponent/DrawComponent';

const POandStockFull = () => {  
  const [ycsxno, setYCSXNO] = useState<string>('');
  const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
  

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content :  () => componentRef.current,
  });
  interface YCSXLIST {
    PROD_REQUEST_NO: string,
    G_CODE: string
  }
  const ycsxlist:Array<YCSXLIST> = [{PROD_REQUEST_NO: '2HC0020',G_CODE:'7C05142A'},{PROD_REQUEST_NO: '2HC0019',G_CODE:'7A07674A'},{PROD_REQUEST_NO: '2HA0051',G_CODE:'7A05268C'}]

  const renderYCSX = () => {
    return  ycsxlist.map((element,index)=><DrawComponent key={index}/> )
  }

  return (
    <div>
      POandStockFull
      <input
        type='text'
        value={ycsxno}
        onChange={(e) => {
          setYCSXNO(e.target.value);
        }}
      ></input>
      <button onClick={handlePrint}>Print YCSX</button>
      <button
        onClick={() => {
          setYCSXListRender(renderYCSX());
        }}
      >
        Render YCSX
      </button>
      <div ref={componentRef}>
        <div>
          {
            renderYCSX()
          }
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default POandStockFull