import React from 'react'
import { GiArchiveRegister, GiCurvyKnife, } from "react-icons/gi";
import { AiFillSetting } from "react-icons/ai";
import { HiLogout, HiOutlineQrcode } from "react-icons/hi";
import { TbReportAnalytics } from "react-icons/tb";

import './PLAN_STATUS_COMPONENTS.scss'
import { LinearProgressWithLabel } from '../../../../components/Navbar/AccountInfo/AccountInfo';
interface SX_DATA {
    id: number,
    STEP?: number,
    PLAN_FACTORY?: string,
    PLAN_ID?: string,
    PLAN_DATE?: string,
    PLAN_EQ?: string,
    G_NAME?: string,
    G_NAME_KD?: string,
    XUATDAO?: string,
    SETTING_START_TIME?: string,
    MASS_START_TIME?: string,
    MASS_END_TIME?: string,
    DKXL?: string,
    XUATLIEU?: string,
    CHOTBC: number,   
    KQ_SX_TAM: number,
    KETQUASX: number, 
    PLAN_QTY: number,
}

const PLAN_STATUS_COMPONENTS = ({id, PLAN_ID, PLAN_QTY, KQ_SX_TAM, KETQUASX, PLAN_FACTORY, STEP, PLAN_DATE, PLAN_EQ, G_NAME, G_NAME_KD, XUATDAO, SETTING_START_TIME, MASS_START_TIME, MASS_END_TIME, DKXL, XUATLIEU, CHOTBC} : SX_DATA) => {
let kq_tem: number = (CHOTBC===null? (KQ_SX_TAM===null? 0: KQ_SX_TAM): KETQUASX);
let phantram_tem : number = PLAN_QTY===0? 0 : kq_tem/(PLAN_QTY) * 100;
let backgroundColor:string ='white';

if(kq_tem >0) 
{
     backgroundColor ='#c9f261';
} 
else
{
     backgroundColor ='white';
}
/* if(phantram_tem >=0 && phantram_tem <20) 
{
    backgroundColor ='#ccccff';
}
if(phantram_tem >=20 && phantram_tem <40) 
{
    backgroundColor ='#66ffff';
}
if(phantram_tem >=40 && phantram_tem <60) 
{
    backgroundColor ='#00e6e6';
}
if(phantram_tem >=60 && phantram_tem <80) 
{
    backgroundColor ='#00ffcc';
}
if(phantram_tem >=80 && phantram_tem <=100) 
{
    backgroundColor ='#00ff00';
}
if(phantram_tem >100 && phantram_tem <=110) 
{
    backgroundColor ='#ff6666';
}
if(phantram_tem >110) 
{
    backgroundColor ='#ff3333';
} */
 
  return (
    <div className='plan_status_component'>    
        <div className='flag' style={{backgroundColor: 'green', padding: '10px', width:'20px', color:'white'}}>
            {id+1}           
        </div> 
        <div className='flag' style={{backgroundColor: 'yellow', padding: '10px'}}>
            {PLAN_ID}           
        </div> 
        <div className='flag' style={{backgroundColor: '#fabd6e', padding: '10px', color: 'black', width:'180px', overflow:'hidden'}}>
        <HiOutlineQrcode color='black' size={25} /> {G_NAME_KD}           
        </div>
        <div className='flag' style={{backgroundColor: '#6efad7', padding: '10px'}}>
            {PLAN_DATE}           
        </div> 
        <div className='flag' style={{backgroundColor: '#5230fc', padding: '10px', color:'yellow'}}>
            {PLAN_FACTORY}           
        </div> 
        <div className='flag' style={{backgroundColor: '#5230fc', padding: '10px', color:'yellow'}}>
            {PLAN_EQ}           
        </div> 
        <div className='flag' style={{backgroundColor: STEP===0?'yellow': '#fcba03', padding: '10px', color:'black'}}>
            STEP: {STEP===0 ? 'F': STEP}           
        </div> 
        <div className='flag' style={{backgroundColor: XUATDAO===null? 'red':'#6ffa48', padding: '10px', width: '200px',color: XUATDAO===null? 'white':'black'}}>
        <GiCurvyKnife color='black' size={25} /> {XUATDAO===null? `CHƯA XUẤT DAO`: `ĐÃ XUẤT DAO`}            
        </div> 
        <div className='flag' style={{backgroundColor: SETTING_START_TIME===null? 'red':'#6ffa48', padding: '10px', width:'200px',color: SETTING_START_TIME===null? 'white':'black'}}>
        <AiFillSetting color='black' size={25} />   {SETTING_START_TIME===null? `CHƯA BĐ SETTING`: `ĐÃ BĐ SETTING`}            
        </div> 
        <div className='flag' style={{backgroundColor: MASS_START_TIME===null? 'red':'#6ffa48', padding: '10px', width:'200px',color: MASS_START_TIME===null? 'white':'black'}}>
        <AiFillSetting color='black' size={25} /> {MASS_START_TIME===null? `CHƯA KT SETTING`: `ĐÃ KT SETTING`}            
        </div> 
        <div className='flag' style={{backgroundColor: DKXL===null? 'red':'#6ffa48', padding: '10px', width: '220px',color: DKXL===null? 'white':'black'}}>
        <GiArchiveRegister color='black' size={25} />    {DKXL===null? `CHƯA ĐĂNG KÝ XL`: `ĐÃ ĐĂNG KÝ XL`}            
        </div> 
        <div className='flag' style={{backgroundColor: XUATLIEU===null? 'red':'#6ffa48', padding: '10px', width: '220px',color: XUATLIEU===null? 'white':'black'}}>
        <HiLogout color='black' size={25} />    {XUATLIEU===null? `CHƯA XUẤT LIỆU CHÍNH`: `ĐÃ XUẤT LIỆU CHÍNH`}            
        </div> 
        <div className='flag' style={{backgroundColor: CHOTBC===null? 'red':'#6ffa48', padding: '10px', width:'200px',color: CHOTBC===null? 'white':'black'}}>
        <TbReportAnalytics color='black' size={25} />     {CHOTBC===null? `CHƯA CHỐT BC`: `ĐÃ CHỐT BC`}            
        </div>  
        <div className='flag' style={{backgroundColor: backgroundColor, padding: '10px', color:'black', width: '200px', justifySelf: 'center', fontWeight:'bold'}}>
            <b>{kq_tem?.toLocaleString('en-US')}/ {PLAN_QTY?.toLocaleString('en-US')} </b>
            <LinearProgressWithLabel
              value={phantram_tem}              
            />
        </div>       
    </div>
  )
}

export default PLAN_STATUS_COMPONENTS