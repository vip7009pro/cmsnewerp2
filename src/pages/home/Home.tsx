import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "../home/home.scss";
import { useSpring, animated } from "@react-spring/web";
import { useEffect, useState } from "react";
import { generalQuery } from "../../api/Api";
import Swal from "sweetalert2";
import PrimarySearchAppBar from "../../components/AppBar/AppBarCustom";
export const current_ver: number = 59;
function Home() {
  const springs = useSpring({
    from: { x: 1000, y: 100 },
    to: { x: 0, y: 0 },
  });
  const [checkVerWeb, setCheckVerWeb] = useState(1);
  console.log("local ver", current_ver);
  useEffect(() => {
    generalQuery("checkWebVer", {})
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          console.log("webver", response.data.data[0].VERWEB);
          setCheckVerWeb(response.data.data[0].VERWEB);
        } else {
          
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let intervalID = window.setInterval(() => {
      generalQuery("checkWebVer", {})
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            //console.log('webver',response.data.data[0].VERWEB);
            if (current_ver >= response.data.data[0].VERWEB) {
            } else {
              window.clearInterval(intervalID);
              Swal.fire({
                title: "Có ver mới, hãy update?",
                text: "Update web",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đã rõ",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire("Thông báo", "Update web", "success");
                  window.location.reload();
                } else {
                  Swal.fire("Thông báo", "Nhớ F5 để update web nhé", "info");
                }
              });
            }
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 30000);
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);
  return (
    <div className='home'>
      <div className='navdiv'>
        <Navbar />
        {/* <PrimarySearchAppBar/>  */}       
      </div>
      <div className='homeContainer'>
        <div className='sidebardiv'>
          <Sidebar />
        </div>
        <div className='outletdiv'>
          <animated.div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
              ...springs,
            }}
          >
            {current_ver >= checkVerWeb ? (
              <Outlet />
            ) : (
              <p>Web có câp nhật, Ctrl +F5 để cập nhật web</p>
            )}
          </animated.div>
        </div>
      </div>
    </div>
  );
}
export default Home;
