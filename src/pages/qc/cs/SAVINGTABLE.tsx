import React, { useState } from 'react'
import './CSFCOSTTABLE.scss'
import { CSFCOST, CS_REDUCE_AMOUNT_DATA, InspectSummary, PATROL_HEADER_DATA, WEB_SETTING_DATA } from '../../../api/GlobalInterface'
import { getGlobalSetting } from '../../../api/Api'
import { nFormatter } from '../../../api/GlobalFunction'
const SAVINGTABLE = ({ data }: { data: CS_REDUCE_AMOUNT_DATA[] }) => {
  let totalSavingAmount: number = 0;
 
  for (let i = 0; i < data.length; i++) totalSavingAmount += data[i].REDUCE_AMOUNT;
  
  return (
    <div className='csfcosttable'>
      <table>
        <thead>
          <tr>
            <td>CATEGORY</td>
            <td>SAVING AMOUNT</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SAVING AMOUNT</td>
            <td style={{ color: 'blue', fontWeight: 'bold' }}>{nFormatter(totalSavingAmount, 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE === 'USD' ? ' $' : ' đ')}</td>
          </tr>          
        </tbody>
      </table>
    </div>
  )
}
export default SAVINGTABLE