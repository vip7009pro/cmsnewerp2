import React, { useRef, useState } from 'react'
import './DrawComponent.scss'
import Pdf, { usePdf } from '@mikecousins/react-pdf';

const DrawComponent = ({G_CODE} : {G_CODE:string}) => {
    const [page, setPage] = useState(1);
    const canvasRef = useRef(null);
    let draw_path = 'http://14.160.33.94:3010/banve/';    
  
    const { pdfDocument, pdfPage } = usePdf({
      file: draw_path + G_CODE + '.pdf',
      page,
      scale: 3,
      canvasRef,
    });

  return (
    <div className='drawcomponent'>
        <canvas className="draw" ref={canvasRef} />
    </div>
  )
}

export default DrawComponent