
import  { useEffect, useState} from 'react'
import INPUTPQC from './INPUTPQC';
import TRAPQC from './TRAPQC';
import "./PQC.scss"
import CODE_MANAGER from '../../rnd/code_manager/CODE_MANAGER';

const PQC = () => {
  const [selection, setSelection] = useState<any>({
    tab1: false,
    tab2: true,
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
    <div className='pqc'>
      <div className='mininavbar'>
       
      <div className='mininavitem'  onClick={() => setNav(2)} style={{backgroundColor:selection.tab2 === true ? '#9933ff':'#d9b3ff', color: selection.tab2 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Data PQC          
          </span>
        </div>    

        <div className='mininavitem'  onClick={() => setNav(1)} style={{backgroundColor:selection.tab1 === true ? '#9933ff':'#d9b3ff', color: selection.tab1 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          CODE INFO          
          </span>
        </div>  
                      
      </div>
      {selection.tab2 && (
        <div className='trapqc'>
          <TRAPQC />
        </div>
      )}
      {selection.tab1 && (
        <div className='trapqc'>
          <CODE_MANAGER />
        </div>
      )}
      {selection.tab3 && <div className='report'></div>}
    </div>
  );
}
export default PQC