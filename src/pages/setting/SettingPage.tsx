import React, { useState, useEffect } from 'react'
import './SettingPage.scss'
import { WEB_SETTING_DATA } from '../../api/GlobalInterface';
import { generalQuery, getUserData } from '../../api/Api';
import Swal from "sweetalert2";
import {
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  changeGLBSetting
} from "../../redux/slices/globalSlice";
import CameraComponent from '../../components/Camera/Camera';
import Scanner from '../../components/Scanner/Scanner';
import OpenCV from '../../components/OpenCV/OpenCV';
import addNotification from 'react-push-notification';
import WebCam from '../../components/Camera/WebCam';
import FlowChart from '../../components/FlowChart/FlowChart';
import { title } from 'process';
const SettingPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const dispatch = useDispatch();
  const globalSetting: WEB_SETTING_DATA[] | undefined = useSelector(
    (state: RootState) => state.totalSlice.globalSetting
  );
  const [settings, setSettings] = useState<Array<WEB_SETTING_DATA>>([]);
  const updateSettingValue = (ID: number, newValue: any) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.ID === ID ? { ...setting, CURRENT_VALUE: newValue } : setting
      )
    );
  };
  const resetSettingValue = () => {
    setSettings((prevSettings: any) => {
      return prevSettings.map((setting: WEB_SETTING_DATA, id: number) => {
        return {
          ...setting,
          CURRENT_VALUE: setting.DEFAULT_VALUE
        }
      });
    });
    dispatch(changeGLBSetting(settings.map((setting: WEB_SETTING_DATA, id: number) => {
      return {
        ...setting,
        CURRENT_VALUE: setting.DEFAULT_VALUE
      }
    })));
    localStorage.setItem(
      "setting",
      JSON.stringify(
        settings.map((setting: WEB_SETTING_DATA, id: number) => {
          return {
            ...setting,
            CURRENT_VALUE: setting.DEFAULT_VALUE
          }
        })
      )
    );
  };
  const loadWebSetting = () => {
    generalQuery("loadWebSetting", {
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let crST_string: any = localStorage.getItem("setting") ?? '';
          let loadeddata: WEB_SETTING_DATA[] = [];
          if (crST_string !== '') {
            let crST: WEB_SETTING_DATA[] = JSON.parse(crST_string);
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA, index: number) => {
                return {
                  ...element,
                  CURRENT_VALUE: crST.filter((ele: WEB_SETTING_DATA, id: number) => ele.ID === element.ID)[0]?.CURRENT_VALUE ?? element.DEFAULT_VALUE
                };
              }
            );
          }
          else {
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA, index: number) => {
                return {
                  ...element,
                  CURRENT_VALUE: element.DEFAULT_VALUE
                };
              }
            );
          }
          dispatch(changeGLBSetting(loadeddata));
          setSettings(loadeddata);
        } else {
          setSettings([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
    const buttonClick = () => {
      addNotification({
          icon: 'favicon.ico',
          title: 'Thông báo',
          subtitle: 'Hàng được nhập kho',
          message: 'Code GH68-48946A đã được nhập kho 10K vào lúc 10h30p',
          theme: 'light',
          native: true // when using native, your OS will handle theming.
      });
  };
    const sendNotification = async (title: string, body: string) => {
      try {
        const response = await generalQuery('sendNotificationAPI', {
          title: title,
          body: body,       
        });
        if (response.data.tk_status === "OK") {
          console.log('Đã gửi thông báo thành công!');
        } else {
          console.log('Lỗi khi gửi thông báo!');
        }
      } catch (error) {
        console.error('Lỗi khi gửi thông báo:', error);
      }
    };    
  useEffect(() => {
    loadWebSetting();
    //getWifiInfo();
  }, [])
  return (
    <div className='settingpage'>
      {/* <OpenCV/> */}
        
      <h2>Setting Page</h2>
      <div className="headerbutton">
        <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#2639F6' }} onClick={() => {
          Swal.fire({
            title: "Chắc chắn muốn lưu setting ?",
            text: "Lưu setting",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Tiếp tục lưu!",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Lưu setting", "Đã lưu setting (chỉ lưu trên máy local, ko lưu lên server)", "success");
              localStorage.setItem(
                "setting",
                JSON.stringify(
                  settings
                )
              );
              dispatch(changeGLBSetting(settings));
            }
          });
        }}>Save</Button>
        <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f17bde' }} onClick={() => {
          Swal.fire({
            title: "Chắc chắn muốn reset setting ?",
            text: "Reset setting",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Tiếp tục reset!",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Reset setting", "Đã reset setting,trả về Default Value", "success");
              resetSettingValue();
            }
          });
        }}>Reset</Button>
        <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f17bde' }} onClick={() => {
          console.log(globalSetting);
        }}>Show</Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Item</th>
            <th>Default</th>
            <th>Current</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((setting) => (
            <tr key={setting.ID}>
              <td>{setting.ID}</td>
              <td>{setting.ITEM_NAME}</td>
              <td>{setting.DEFAULT_VALUE}</td>
              <td>
                <input
                  type="text"
                  value={setting.CURRENT_VALUE}
                  onChange={(e) => updateSettingValue(setting.ID, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {getUserData()?.EMPL_NO === "NHU1903" && <div>
        <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)}/>
        <input type="text" placeholder="Body" onChange={(e) => setBody(e.target.value)}/>
        <Button onClick={()=> {sendNotification(title, body)}}>Send Notifications</Button>
      </div>}
     
      {/* <WebCam/> */}
      {/* <FlowChart/> */}
      {/* <Scanner/> */}
      {/* <CameraComponent/> */}
    </div>
  );
}
export default SettingPage