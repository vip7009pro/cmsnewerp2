
import  { useEffect, useState} from 'react'
import KHOLIEU from '../../kho/kholieu/KHOLIEU';
import MACHINE from './Machine/MACHINE';
import MACHINE2 from './Machine/MACHINE2';
import "./QLSXPLAN.scss"



const QLSXPLAN = () => {
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
    <div className='qlsxplan'>
      <div className='mininavbar'>
        <div className='mininavitem'  onClick={() => setNav(1)}>
          <span className='mininavtext'>
            PLAN VISUAL
          </span>
        </div>   
        <div className='mininavitem'  onClick={() => setNav(2)}>
          <span className='mininavtext'>
            PLAN TABLE
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
            <MACHINE2/>                           
        </div>
      )}
    </div>
  );
}
export default QLSXPLAN