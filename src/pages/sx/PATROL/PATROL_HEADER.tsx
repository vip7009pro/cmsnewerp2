import React from 'react'
import './PATROL_HEADER.scss'
import { PATROL_HEADER_DATA } from '../../qlsx/QLSXPLAN/interfaces/khsxInterface'
import { getGlobalSetting } from '../../../api/Api'
import { WEB_SETTING_DATA } from '../../../api/GlobalInterface'
const PATROL_HEADER = ({ data }: { data: PATROL_HEADER_DATA[] }) => {
  return (
    <div className='patrolheader'>
      <table>
        <thead>
          <tr>
            <td>TOP</td>
            <td>G_NAME</td>
            <td>NG_AMOUNT</td>
            <td>INSPECT_TT</td>
            <td>INSPECT_NG</td>
            <td>NG_RATE</td>
            <td>WORST1</td>
            <td>WORST2</td>
            <td>WORST3</td>
          </tr>
        </thead>
        <tbody>
          {data.map((ele: PATROL_HEADER_DATA, index: number) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{ele.G_NAME_KD}</td>
                <td style={{color:'red', fontWeight:'bold'}}>{ele.NG_AMOUNT.toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                  }
                )}</td>
                <td>{Number(ele.INSPECT_TOTAL_QTY).toLocaleString("en-US")}</td>
                <td>{Number(ele.NG_QTY).toLocaleString("en-US")}</td>
                <td>{(ele.NG_QTY * 1.0 / ele.INSPECT_TOTAL_QTY * 100).toLocaleString("en-US", {
                  style: "decimal",
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 1,
                })}%</td>
                <td>{ele.WORST1}</td>
                <td>{ele.WORST2}</td>
                <td>{ele.WORST3}</td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
    </div>
  )
}
export default PATROL_HEADER