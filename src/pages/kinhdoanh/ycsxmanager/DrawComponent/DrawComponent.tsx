import React, { useRef, useState } from 'react'
import './DrawComponent.scss'
import Pdf, { usePdf } from '@mikecousins/react-pdf';

const DrawComponent = ({G_CODE, PDBV} : {G_CODE:string, PDBV?: string}) => {
    const [page, setPage] = useState(1);
    const canvasRef = useRef(null);
    let draw_path = 'http://14.160.33.94/banve/';    
    console.log(draw_path + G_CODE +'.pdf');
    const { pdfDocument, pdfPage } = usePdf({
      file: draw_path + G_CODE + '.pdf',
      page,
      scale: 3,
      canvasRef,
    });

  return (
    <div className='drawcomponent'>
       {(PDBV === 'Y') && <div className="qcpass">
        <img alt="qcpass" src="/QC PASS20.png" width={220} height={200}/>
      </div>  }  
        <canvas className="draw" ref={canvasRef} />
        {(PDBV === 'Y') && <div className="qcpass2">
        <img alt="qcpass2" src="/QC PASS20.png" width={220} height={200}/>
      </div>  }   
    </div>
  )
}

export default DrawComponent