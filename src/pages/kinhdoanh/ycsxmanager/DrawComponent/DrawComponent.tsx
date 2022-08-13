import React, { useRef, useState } from 'react'
import './DrawComponent.scss'
import Pdf, { usePdf } from '@mikecousins/react-pdf';

const DrawComponent = () => {
    const [page, setPage] = useState(1);
    const canvasRef = useRef(null);
  
    const { pdfDocument, pdfPage } = usePdf({
      file: '/banve.pdf',
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