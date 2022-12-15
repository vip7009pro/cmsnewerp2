import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "../home/home.scss";
import { useSpring, animated } from '@react-spring/web'
import { useEffect, useState } from "react";
import { generalQuery } from "../../api/Api";

function Home() {
  const springs = useSpring({
    from: { x: 1000, y: 100 },
    to: { x: 0, y :0 },
  });
  
  const [checkVerWeb,setCheckVerWeb] = useState(1);
  const current_ver:number =3;
  console.log('local ver', current_ver);
  useEffect(()=> {   
     generalQuery("checkWebVer", {    
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          console.log('webver',response.data.data[0].VERWEB);
          setCheckVerWeb(response.data.data[0].VERWEB);
          
        } else {
         
        }
      })
      .catch((error) => {
        console.log(error);
      });

  },[])
  return (
    <div className='home'>
      <div className='navdiv'>
        <Navbar />
      </div>
      <div className='homeContainer'>
        <div className='sidebardiv'>
          <Sidebar />
        </div>
        <div className='outletdiv'>

        <animated.div
          style={{
            width: '100%',
            height: '100%',            
            borderRadius: 8,
            ...springs,
          }}
        >
            {
              (current_ver >= checkVerWeb? <Outlet /> : <p>Web có câp nhật, Ctrl +F5 để cập nhật web</p>)
            }
           
        </animated.div>
         
        </div>
      </div>
    </div>
  );
}
export default Home;
