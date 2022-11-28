import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "../home/home.scss";
import { useSpring, animated } from '@react-spring/web'

function Home() {
  const springs = useSpring({
    from: { x: 1000, y: 100 },
    to: { x: 0, y :0 },
  })

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
           <Outlet />
        </animated.div>
         
        </div>
      </div>
    </div>
  );
}
export default Home;
