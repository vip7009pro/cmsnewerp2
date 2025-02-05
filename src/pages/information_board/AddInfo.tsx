import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import "./AddInfo.scss";
import { useSelector } from "react-redux";

import 'react-html5-camera-photo/build/css/index.css';
import { DEPARTMENT_DATA, PQC1_DATA, SX_DATA, UserData } from "../../api/GlobalInterface";
import { RootState } from "../../redux/store";
import { generalQuery, getCtrCd, uploadQuery } from "../../api/Api";

const AddInfo = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [file, setFile] = useState<any>(null);
  const [deptlist, setDeptList] = useState<DEPARTMENT_DATA[]>([]);
  const [selectedDept, setSelectedDept] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [content, setContent]= useState<string>("");

  const refArray = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = (index + 1) % refArray.length;
      refArray[nextIndex].current.focus();
    }
  };


  const getlastestPostId = async () => {
    let lastPostId: number = 1;
    try {
      let res = await generalQuery('getlastestPostId', {});
      if (res.data.tk_status !== 'NG') {
        console.log(res.data.data);
       lastPostId = res.data.data[0].POST_ID;
      } else {
        console.log('getlastestPostId error'); 
      }
    } catch (error) {
      console.log(error);
    }
    return lastPostId;
  }

  const insertPost = async (CTR_CD: string, DEPT_CODE: number, FILENAME: string) => {
    console.log('DEPT_CODE',DEPT_CODE);
    let insertData = {
      DEPT_CODE: DEPT_CODE,
      TITLE: title,
      CONTENT: content,
      FILE_NAME: CTR_CD+ "_" + DEPT_CODE + "_" + FILENAME,
    }
    console.log(insertData);

    try {
      let res = await generalQuery('insert_information', insertData);
      if (res.data.tk_status !== 'NG') {
        //console.log(res.data.data);
        uploadFile2(CTR_CD, DEPT_CODE, FILENAME);
       
      } else {
        console.log('getlastestPostId error'); 
      }
    } catch (error) {
      console.log(error);
    } 
  }
  

  const uploadFile2 = async (ctr_cd: string, dept_code: number, filename: string) => {
    console.log(file);
    uploadQuery(file, ctr_cd + "_" + dept_code + "_" + filename, "informationboard")
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire(
            "Thông báo",
            "Upload file thành công",
            "success"
          );
        } else {
          Swal.fire(
            "Thông báo",
            "Upload file thất bại:" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const handleGetDepartmentList = async () => {
    try {
      let res = await generalQuery('getDepartmentList', {});
      if (res.data.tk_status !== 'NG') {
        console.log(res.data.data);
        setDeptList(res.data.data);
        setSelectedDept(res.data.data[0].DEPT_CODE);
      } else {
        console.log('getDepartmentList error'); 
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    handleGetDepartmentList();
   
    return ()=> {
       
    }    
  }, []);

  return (
    <div className="addinfo">
      <div className="tracuuDataInspection"> 
        <div className="inputform"> 
          <div className="tracuuDataInspectionform">
            <span className="headertitle" style={{ color: "#0798ac", padding: "5px", fontWeight:'bold', fontSize:'1.2rem' }}> ĐĂNG BÀI</span>
            <div className="forminput">
              <div className="forminputcolumn">
                <label>
                  <b>DEPARTMENT</b>
                  <select                   
                    name="factory"
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(Number(e.target.value));
                    }}
                  >
                    {deptlist.map((item: DEPARTMENT_DATA, index: number) => {
                      return (
                        <option key={index} value={item.DEPT_CODE}>
                          {item.SUBDEPT}
                        </option>
                      );
                    })}                    
                  </select>
                </label>
                <label>
                  <b>TITLE</b>                
                  <input
                    ref={refArray[0]}
                    type="text"
                    placeholder=""
                    value={title}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 0);
                    }}
                    onChange={(e) => {
                      setTitle(e.target.value);                      
                    }}
                  ></input>
                </label>                
                <label>
                  <b>CONTENT</b>
                  <textarea
                    className="textar"
                    disabled={userData?.EMPL_NO !== 'NHU1903'}
                    ref={refArray[1]}
                    onKeyDown={(e) => {
                      
                    }}                    
                    placeholder={""}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                  ></textarea>
                </label>                
                <label>
                  <b>Chọn ảnh bài post</b>
                  <input
                    accept='.jpg'
                    type='file'
                    onChange={(e: any) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="inputbutton">
            <div className="forminputcolumn">
              <Button
                disabled={false}
                ref={refArray[4]}
                onKeyDown={(e) => {
                }}
                color={"primary"}
                variant="contained"
                size="large"
                sx={{
                  fontSize: "0.7rem",
                  padding: "3px",
                  backgroundColor: "#756DFA",
                }}
                onClick={async () => {  
                  //console.log(selectedDept);               
                  await insertPost(getCtrCd(), selectedDept,  file.name);         
                }}
              >
                Đăng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddInfo;
