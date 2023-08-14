import React from 'react'
import './CodeVisualLize.scss'
import { CODEDATA } from '../CalcQuotation'
import RECTANGLE from '../../../rnd/design_amazon/design_components/RECTANGLE'

const CodeVisualLize = ({DATA}: {DATA : CODEDATA}) => {    
 
  return (
    <div className='codevisualizecomponent'>
        <RECTANGLE DATA={{
            SIZE_W: DATA.G_WIDTH,
            SIZE_H: DATA.G_LENGTH,
            CAVITY_PRINT:2,
            DOITUONG_NAME:'',
            DOITUONG_NO: 1,
            DOITUONG_STT: '1',
            FONT_NAME:'Arial',
            FONT_SIZE: 6,
            FONT_STYLE:'normal',
            G_CODE_MAU:'',
            GIATRI:'',
            PHANLOAI_DT:'',
            POS_X:0,
            POS_Y:0,
            REMARK:'',
            ROTATE:0,
        }}/>

        
    </div>
  )
}

export default CodeVisualLize