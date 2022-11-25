
import  { useEffect, useState} from 'react'
import KHOLIEU from '../../kho/kholieu/KHOLIEU';
import KQDTC from '../dtc/KQDTC';
import "./IQC.scss"



const IQC = () => {
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
    <div className='iqc'>
      <div className='mininavbar'>
        <div className='mininavitem'  onClick={() => setNav(1)} style={{backgroundColor:selection.tab1 === true ? '#9933ff':'#d9b3ff', color: selection.tab1 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Kho Liệu
          </span>
        </div>  
        <div className='mininavitem'  onClick={() => setNav(2)} style={{backgroundColor:selection.tab2 === true ? '#9933ff':'#d9b3ff', color: selection.tab2 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Data KT DTC
          </span>
        </div>            
      </div>     
      {selection.tab1 && (
        <div className='traiqc'>
          <KHOLIEU/>                     
        </div>
      )}
      {selection.tab2 && (
        <div className='datadtc'>
          <KQDTC/>                     
        </div>
      )}
    </div>
  );
}
export default IQC