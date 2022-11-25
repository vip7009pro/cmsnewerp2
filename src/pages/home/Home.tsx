import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "../home/home.scss";


function Home() {
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
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default Home;
