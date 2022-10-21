import  { useEffect, useState} from 'react'
import DiemDanhNhomBP from '../DiemDanhNhom/DiemDanhBP';
import DieuChuyenTeamBP from '../DieuChuyenTeam/DieuChuyenTeamBP';
import PheDuyetNghiBP from '../PheDuyetNghi/PheDuyetNghiBP';
import "./QuanLyCapCao.scss"

const QuanLyCapCao = () => {
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
    <div className='quanlycapcao'>
      <div className='mininavbar'>
        <div className='mininavitem'  onClick={() => setNav(1)}>
          <span className='mininavtext'>
           Điểm danh toàn bộ phận
          </span>
        </div>   
        <div className='mininavitem'  onClick={() => setNav(2)}>
          <span className='mininavtext'>
          Phê duyệt nghỉ toàn bộ phận
          </span>
        </div>  
        <div className='mininavitem'  onClick={() => setNav(3)}>
          <span className='mininavtext'>
          Điều chuyển toàn bộ phận
          </span>
        </div>  
          
      </div>     
      {selection.tab1 && (
        <div className='diemdanhbp'>
            <DiemDanhNhomBP/>                      
        </div>
      )}
      {selection.tab2 && (
        <div className='pheduyetbp'>
            <PheDuyetNghiBP/>                               
        </div>
      )}
      {selection.tab3 && (
        <div className='dieuchuyenbp'>
            <DieuChuyenTeamBP/>                               
        </div>
      )}
    </div>
  );
}
export default QuanLyCapCao