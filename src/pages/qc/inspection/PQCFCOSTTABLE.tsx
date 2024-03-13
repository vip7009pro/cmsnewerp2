import React from 'react'
import './FCOSTTABLE.scss'
import { InspectSummary, PATROL_HEADER_DATA, PQCSummary, WEB_SETTING_DATA } from '../../../api/GlobalInterface'
import { getGlobalSetting } from '../../../api/Api'
import { nFormatter } from '../../../api/GlobalFunction'
const PQCFCOSTTABLE = ({ data }: { data: PQCSummary[] }) => {
  return (
    <div className='fcosttable'>
      <table>
        <thead>
          <tr>
            <td>TOTAL_LOT</td>
            <td>OK_LOT</td>
            <td>NG_LOT</td>
            <td>NG_RATE</td>
            <td>INSPECT_AMOUNT</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ color: 'blue', fontWeight: 'bold' }}>{`${nFormatter(data[0]?.TOTAL_LOT, 2)}`}</td>
            <td style={{ color: 'green', fontWeight: 'bold' }}>{`${nFormatter(data[0]?.TOTAL_LOT - data[0]?.NG_LOT, 2)}`}</td>
            <td style={{ color: 'red', fontWeight: 'bold' }}>{`${nFormatter(data[0]?.NG_LOT, 2)}`}</td>
            <td style={{ color: 'red', fontWeight: 'bold' }}>{`${data[0]?.NG_RATE.toLocaleString('en-US', { style: 'percent' })}`}</td>
            <td style={{ color: 'red', fontWeight: 'bold' }}>{`$${nFormatter(data[0]?.INSPECT_AMOUNT, 2)}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default PQCFCOSTTABLE