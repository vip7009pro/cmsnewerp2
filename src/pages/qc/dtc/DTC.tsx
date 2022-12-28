
import  { useEffect, useState} from 'react'
import KHOTP from '../../kho/khotp/KHOTP';
import DKDTC from './DKDTC';
import "./DTC.scss"
import KQDTC from './KQDTC';
import SPECDTC from './SPECDTC';
const DTC = () => {
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false
  });

  const setNav = (choose: number) => {
    if(choose ===1 )
    {
      setSelection({...selection, tab1:true, tab2: false, tab3:false});
    }
    else if(choose ===2 )
    {
      setSelection({...selection, tab1:false, tab2: true, tab3:false});
    }
    else if(choose ===3 )
    {
      setSelection({...selection, tab1:false, tab2: false, tab3:true});
    }
  }

  useEffect(()=>{
        
  },[]);
  

  return (
    <div className='dtc'>
      <div className='mininavbar'> 
        <div className='mininavitem'  onClick={() => setNav(1)} style={{backgroundColor:selection.tab1 === true ? '#9933ff':'#d9b3ff', color: selection.tab1 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          DATA ĐTC
          </span>
        </div> 
        
      </div>     
      {selection.tab1 && (
        <div className='trainspection'>
          <KQDTC/>
        </div>
      )} 
    </div>
  );
}
export default DTC