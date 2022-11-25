import  { useEffect, useState} from 'react'
import KHOLIEU from '../../kho/kholieu/KHOLIEU';
import PLAN_DATATB from './LICHSUCHITHITABLE/PLAN_DATATB';
import LICHSUINPUTLIEU from './LICHSUINPUTLIEU/LICHSUINPUTLIEU';
import MACHINE from './Machine/MACHINE';
import MACHINE2 from './Machine/MACHINE2';
import PLANTABLE from './PLANTABLE/PLANTABLE';
import "./QLSXPLAN.scss"
import QUICKPLAN from './QUICKPLAN/QUICKPLAN';

const QLSXPLAN = () => {
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
    <div className='qlsxplan'>
      <div className='mininavbar'>
      <div className='mininavitem'  onClick={() => setNav(1)} style={{backgroundColor:selection.tab1 === true ? '#9933ff':'#d9b3ff', color: selection.tab1 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
            PLAN VISUAL
          </span>
        </div>  
        <div className='mininavitem'  onClick={() => setNav(4)} style={{backgroundColor:selection.tab4 === true ? '#9933ff':'#d9b3ff', color: selection.tab4 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
            QUICK PLAN
          </span>
        </div>   
        <div className='mininavitem'  onClick={() => setNav(2)} style={{backgroundColor:selection.tab2 === true ? '#9933ff':'#d9b3ff', color: selection.tab2 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
            PLAN YCSX
          </span>
        </div>  
        <div className='mininavitem'  onClick={() => setNav(5)} style={{backgroundColor:selection.tab5 === true ? '#9933ff':'#d9b3ff', color: selection.tab5 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
            TRA PLAN
          </span>
        </div>  
        <div className='mininavitem'  onClick={() => setNav(3)} style={{backgroundColor:selection.tab3 === true ? '#9933ff':'#d9b3ff', color: selection.tab3 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
            LỊCH SỬ
          </span>
        </div>  
             
          
      </div>     
      {selection.tab1 && (
        <div className='traiqc'>
          <MACHINE/>                  
        </div>
      )}
      {selection.tab2 && (
        <div className='datadtc'>
          <PLANTABLE/>                               
        </div>
      )}
      {selection.tab3 && (
        <div className='datadtc'>
          <LICHSUINPUTLIEU/>                               
        </div>
      )}
      {selection.tab4 && (
        <div className='datadtc'>
          <QUICKPLAN/>                               
        </div>
      )}
      {selection.tab5 && (
        <div className='datadtc'>
          <PLAN_DATATB/>                               
        </div>
      )}
    </div>
  );
}
export default QLSXPLAN