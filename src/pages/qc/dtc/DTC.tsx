
import  { useEffect, useState} from 'react'
import KHOTP from '../../kho/khotp/KHOTP';
import DKDTC from './DKDTC';
import "./DTC.scss"
import KQDTC from './KQDTC';
import SPECDTC from './SPECDTC';
import ADDSPECDTC from './ADDSPECDTC';
const DTC = () => {
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false
  });

  const setNav = (choose: number) => {
    if(choose ===1 )
    {
      setSelection({...selection, tab1:true, tab2: false, tab3:false, tab4: false});
    }
    else if(choose ===2 )
    {
      setSelection({...selection, tab1:false, tab2: true, tab3:false, tab4: false});
    }
    else if(choose ===3 )
    {
      setSelection({...selection, tab1:false, tab2: false, tab3:true, tab4: false});
    }
    else if(choose ===4 )
    {
      setSelection({...selection, tab1:false, tab2: false, tab3:false, tab4: true});
    }
  }

  useEffect(()=>{
        
  },[]);
  

  return (
    <div className='dtc'>
      <div className='mininavbar'> 
        <div className='mininavitem'  onClick={() => setNav(1)} style={{backgroundColor:selection.tab1 === true ? '#9933ff':'#d9b3ff', color: selection.tab1 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          TRA KQ ĐTC
          </span>
        </div> 
        <div className='mininavitem'  onClick={() => setNav(2)} style={{backgroundColor:selection.tab2 === true ? '#9933ff':'#d9b3ff', color: selection.tab2 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          TRA SPEC ĐTC
          </span>
        </div> 
        <div className='mininavitem'  onClick={() => setNav(3)} style={{backgroundColor:selection.tab3 === true ? '#9933ff':'#d9b3ff', color: selection.tab3 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          ADD SPEC ĐTC
          </span>
        </div> 
        
      </div>     
      {selection.tab1 && (
        <div className='trainspection'>
          <KQDTC/>
        </div>
      )} 
      {selection.tab2 && (
        <div className='trainspection'>
          <SPECDTC/>
        </div>
      )} 
      {selection.tab3 && (
        <div className='trainspection'>
          <ADDSPECDTC/>
        </div>
      )} 
    </div>
  );
}
export default DTC