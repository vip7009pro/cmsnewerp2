import React from 'react'
import './CIRCLE_COMPONENT.scss'

const CIRCLE_COMPONENT = ({value, title, style}:{value?: number, title?: string, style?: any}) => {
  return (
    <div className='circlecomponent'>
        <div className="value" style={style}>
            {value}    
        </div>
        <div className="title" style={style}>
            {title}
        </div>    
    </div>
  )
}

export default CIRCLE_COMPONENT