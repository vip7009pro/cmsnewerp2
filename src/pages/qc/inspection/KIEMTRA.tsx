
import  { useEffect, useState} from 'react'
import "./KIEMTRA.scss"
import INSPECTION from './INSPECTION';
import INSPECT_REPORT from './INSPECT_REPORT';
import INSPECT_STATUS from './INSPECT_STATUS/INSPECT_STATUS';

const KIEMTRA = () => {
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
    <div className='kiemtra'>
      <div className='mininavbar'>       
        <div className='mininavitem'  onClick={() => setNav(1)} style={{backgroundColor:selection.tab1 === true ? '#9933ff':'#d9b3ff', color: selection.tab1 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Data Kiểm Tra
          </span>
        </div>         
        <div className='mininavitem'  onClick={() => setNav(2)} style={{backgroundColor:selection.tab2 === true ? '#9933ff':'#d9b3ff', color: selection.tab2 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Báo cáo
          </span>
        </div>         
        <div className='mininavitem'  onClick={() => setNav(3)} style={{backgroundColor:selection.tab3 === true ? '#9933ff':'#d9b3ff', color: selection.tab3 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          ISP STATUS
          </span>
        </div>         
      </div>     
      {selection.tab1 && (
        <div className='trainspection'>
            <INSPECTION/>          
        </div>
      )}
      {selection.tab2 && (
        <div className='trainspection'>
            <INSPECT_REPORT/>          
        </div>
      )}
      {selection.tab3 && (
        <div className='trainspection'>
            <INSPECT_STATUS/>          
        </div>
      )}
    </div>
  );
}
export default KIEMTRA