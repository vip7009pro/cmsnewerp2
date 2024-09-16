import React, { useState } from 'react'
import Swal from 'sweetalert2'
import './BOM_DESIGN.scss'
import { Rnd } from 'react-rnd';
const BOM_DESIGN = () => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <div className='bomdesign' style={{ border: '1px solid #000', width: '100%', height: '100%' }}>
      <Rnd default={{
        x: 0,
        y: 0,
        width: 300,
        height: 300,
      }}
        style={{ border: '1px solid #000' }}
        size={{ width: width, height: height }}
        position={{ x: x, y: y }}
        onDragStop={(e, d) => { setX(d.x); setY(d.y) }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setWidth(Number(ref.style.width));
          setHeight(Number(ref.style.height));
        }}
        bounds="parent"
        minWidth={10}
        minHeight={10}
        maxWidth={500}
        maxHeight={500}
        lockAspectRatio={false}
      >
        <div className='bomdesign_content' >
          <div className='bomdesign_content_header'>
            <div className='bomdesign_content_header_title'>
              BOM DESIGN   AA
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  )
}

export default BOM_DESIGN 