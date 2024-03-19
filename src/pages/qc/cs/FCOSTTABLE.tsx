import React, { useState } from 'react'
import './CSFCOSTTABLE.scss'
import { CSFCOST, InspectSummary, PATROL_HEADER_DATA, WEB_SETTING_DATA } from '../../../api/GlobalInterface'
import { getGlobalSetting } from '../../../api/Api'
import { nFormatter } from '../../../api/GlobalFunction'
const CSFCOSTTABLE = ({ data }: { data: CSFCOST }) => {
  let totalRMAAmount: number = 0;
  let totalTaxiAmount: number = 0;
  for (let i = 0; i < data.RMA_DATA.length; i++) totalRMAAmount += data.RMA_DATA[i].TT;
  for (let i = 0; i < data.TAXI_DATA.length; i++) totalTaxiAmount += data.TAXI_DATA[i].TAXI_AMOUNT;
  return (
    <div className='csfcosttable'>
      <table>
        <thead>
          <tr>
            <td>CATEGORY</td>
            <td>CS F-COST AMOUNT</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>RMA AMOUNT</td>
            <td style={{ color: 'blue', fontWeight: 'bold' }}>{nFormatter(totalRMAAmount, 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE === 'USD' ? ' $' : ' đ') ?? "$"}</td>
          </tr>
          <tr>
            <td>TAXI AMOUNT</td>
            <td style={{ color: 'blue', fontWeight: 'bold' }}>{nFormatter(totalTaxiAmount, 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE === 'USD' ? ' $' : ' đ') ?? "$"}</td>
          </tr>
          <tr>
            <td>TOTAL AMOUNT</td>
            <td style={{ color: 'blue', fontWeight: 'bold' }}>{nFormatter((totalTaxiAmount + totalRMAAmount), 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE === 'USD' ? ' $' : ' đ') ?? "$"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default CSFCOSTTABLE