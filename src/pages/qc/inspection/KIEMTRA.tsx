
import  { useEffect, useState,  lazy, Suspense} from 'react'
import "./KIEMTRA.scss"

const INSPECTION= lazy(()=> import('./INSPECTION'));
const INSPECT_REPORT= lazy(()=> import('./INSPECT_REPORT'));
const INSPECT_STATUS= lazy(()=> import('./INSPECT_STATUS/INSPECT_STATUS'));
const TINHHINHCUONLIEU= lazy(()=> import('../../sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU'));

const KIEMTRA = () => {
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
    <div className='kiemtra'>
      <Suspense fallback={<div>Loading</div>}>
      <div className='mininavbar'>       
        <div className='mininavitem'  onClick={() => setNav(1)} style={{backgroundColor:selection.tab1 === true ? '#02c712':'#abc9ae', color: selection.tab1 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Data Kiểm Tra
          </span>
        </div>         
        <div className='mininavitem'  onClick={() => setNav(2)} style={{backgroundColor:selection.tab2 === true ? '#02c712':'#abc9ae', color: selection.tab2 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Báo cáo
          </span>
        </div>         
        <div className='mininavitem'  onClick={() => setNav(3)} style={{backgroundColor:selection.tab3 === true ? '#02c712':'#abc9ae', color: selection.tab3 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          ISP STATUS
          </span>
        </div>         
        <div className='mininavitem'  onClick={() => setNav(4)} style={{backgroundColor:selection.tab4 === true ? '#02c712':'#abc9ae', color: selection.tab4 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Material Status
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
      {selection.tab4 && (
        <div className='trainspection'>
            <TINHHINHCUONLIEU/>          
        </div>
      )}
      </Suspense>
    </div>
  );
}
export default KIEMTRA