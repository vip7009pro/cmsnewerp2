
import  { useEffect, useState} from 'react'
import KHOLIEU from '../../kho/kholieu/KHOLIEU';
import KQDTC from '../dtc/KQDTC';
import "./IQC.scss"
import SPECDTC from '../dtc/SPECDTC';
import ADDSPECTDTC from '../dtc/ADDSPECDTC';
import DKDTC from '../dtc/DKDTC';



const IQC = () => {
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false
  });

  const setNav = (choose: number) => {
    if(choose ===1 )
    {
      setSelection({...selection, tab1:true, tab2: false, tab3:false, tab4: false, tab5: false});
    }
    else if(choose ===2 )
    {
      setSelection({...selection, tab1:false, tab2: true, tab3:false, tab4: false, tab5: false});
    }
    else if(choose ===3 )
    {
      setSelection({...selection, tab1:false, tab2: false, tab3:true, tab4: false, tab5: false});
    }
    else if(choose ===4 )
    {
      setSelection({...selection, tab1:false, tab2: false, tab3:false, tab4: true, tab5: false});
    }
    else if(choose ===5 )
    {
      setSelection({...selection, tab1:false, tab2: false, tab3:false, tab4: false, tab5: true});
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
        <div className='mininavitem'  onClick={() => setNav(3)} style={{backgroundColor:selection.tab3 === true ? '#9933ff':'#d9b3ff', color: selection.tab3 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          TRA SPEC ĐTC
          </span>
        </div> 
        <div className='mininavitem'  onClick={() => setNav(4)} style={{backgroundColor:selection.tab4 === true ? '#9933ff':'#d9b3ff', color: selection.tab4 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          ADD SPEC ĐTC
          </span>
        </div> 
        <div className='mininavitem'  onClick={() => setNav(5)} style={{backgroundColor:selection.tab5 === true ? '#9933ff':'#d9b3ff', color: selection.tab5 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          ĐKÝ TEST ĐTC
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
      {selection.tab3 && (
        <div className='datadtc'>
          <SPECDTC/>                     
        </div>
      )}
      {selection.tab4 && (
        <div className='datadtc'>
          <ADDSPECTDTC/>                     
        </div>
      )}
      {selection.tab5 && (
        <div className='datadtc'>
          <DKDTC/>                     
        </div>
      )}
    </div>
  );
}
export default IQC