
import  { useEffect, useState} from 'react'
import INSPECTION from '../inspection/INSPECTION';
import "./PQC.scss"
import TRAPQC from './TRAPQC';


const PQC = () => {
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
    <div className='pqc'>
      <div className='mininavbar'>
        <div className='mininavitem'  onClick={() => setNav(1)}>
          <span className='mininavtext'>
            Data PQC
          </span>
        </div>   
        <div className='mininavitem'  onClick={() => setNav(2)}>
          <span className='mininavtext'>
            Report PQC
          </span>
        </div>   
      </div>     
      {selection.tab1 && (
        <div className='trapqc'>
            <TRAPQC/>          
        </div>
      )}
      {selection.tab2 && (
        <div className='reportpqc'>
            <TRAPQC/>          
        </div>
      )}
    </div>
  );
}
export default PQC