import React from 'react'
import './PATROL_COMPONENT.scss'
import { PATROL_DATA } from '../../qlsx/QLSXPLAN/interfaces/khsxInterface'
import moment from 'moment';
const PATROL_COMPONENT2 = ({ data }: { data?: PATROL_DATA }) => {
  var datesetting1 = moment.utc(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
  var datesetting2 = moment.utc(data?.TIME).format("YYYY-MM-DD HH:mm:ss");
  var diffsetting: number = datesetting1.diff(datesetting2, "minutes");
  return (
    <div className='patrolcomponent2'>
      <div className="imagediv">
        <div className="empl_image">
          <img src={`/Picture_NS/NS_${data?.EMPL_NO}.jpg`} alt="Image1" />
        </div>
        <div className="anhdiv">
          <img src={`${data?.LINK}`} alt="Image1" />
        </div>
      </div>
      <div className="infodiv">
        <div className="timeinfo">
          <div className="title">
            {diffsetting}min
          </div>
        </div>
        <div className="eqinfo">
          <div className="eq">
            {data?.EQ}
          </div>
          <div className="factory">
            {data?.FACTORY}
          </div>
        </div>
        <div className="codeinfo">
          <div className="codename">
            {data?.G_NAME_KD}
          </div>
          <div className="khachhang">
            {data?.CUST_NAME_KD}
          </div>
        </div>
        <div className="thongtinloi">
          <div className="defect">
            {data?.DEFECT}
          </div>
          <div className="ngrate">
            NG Rate: {data?.INSPECT_NG}/{data?.INSPECT_QTY} ({(data?.INSPECT_NG! / data?.INSPECT_QTY! * 100).toLocaleString("en-US", {
              style: "decimal",
              maximumFractionDigits: 1,
              minimumFractionDigits: 1,
            })}%)
          </div>
        </div>
      </div>
      <div className="doisachdiv">
        <div className="nguyennhan">
          <span style={{ fontWeight: 'bold', color:'red' }}>1. Nguyên nhân (원인)</span>
          <span style={{color:'blue'}}>{data?.NG_NHAN}</span>
        </div>
        <div className="doisach">
          <span style={{ fontWeight: 'bold', color:'green' }}>2. Đối sách (대책)</span>
          <span style={{color:'blue'}}>{data?.DOI_SACH}</span>
        </div>
      </div>
    </div>
  )
}
export default PATROL_COMPONENT2