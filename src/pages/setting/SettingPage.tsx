import React, { useState, useEffect } from 'react'
import './SettingPage.scss'
import { WEB_SETTING_DATA } from '../../api/GlobalInterface';
import { generalQuery } from '../../api/Api';
import Swal from "sweetalert2";
import {
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  changeServer,
  changeGLBSetting
} from "../../redux/slices/globalSlice";
const SettingPage = () => {
  const dispatch = useDispatch();
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
          let loadeddata: WEB_SETTING_DATA[] =[];
          if (crST_string !== '') {
            let crST: WEB_SETTING_DATA[] = JSON.parse(crST_string);
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA, index: number) => {
                return {
                  ...element,
                  CURRENT_VALUE: crST.filter((ele: WEB_SETTING_DATA, id: number) => ele.ID === element.ID)[0].CURRENT_VALUE ?? 'xxxxxx'
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
  useEffect(() => {
    loadWebSetting();
  }, [])
  return (
    <div className='settingpage'>
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
    </div>
  );
}
export default SettingPage