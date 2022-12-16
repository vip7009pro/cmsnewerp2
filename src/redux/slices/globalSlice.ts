import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import { io } from "socket.io-client";

const socket =  io('http://14.160.33.94:3005')
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("notification", (data) => {
    console.log(data); // x8WIv7-mJelg7on_ALbx
  });
socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});

export interface UserData  {
    EMPL_IMAGE?: string;
    ADD_COMMUNE: string;
    ADD_DISTRICT: string;
    ADD_PROVINCE: string;
    ADD_VILLAGE: string;
    ATT_GROUP_CODE: number;
    CMS_ID: string;
    CTR_CD: string;
    DOB: string;
    EMAIL: string;
    EMPL_NO: string;
    FACTORY_CODE: number;
    FACTORY_NAME: string;
    FACTORY_NAME_KR: string;
    FIRST_NAME: string;
    HOMETOWN: string;
    JOB_CODE: number;
    JOB_NAME: string;
    JOB_NAME_KR: string;
    MAINDEPTCODE: number;
    MAINDEPTNAME: string;
    MAINDEPTNAME_KR: string;
    MIDLAST_NAME: string;
    ONLINE_DATETIME: string;
    PASSWORD: string;
    PHONE_NUMBER: string;
    POSITION_CODE: number;
    POSITION_NAME: string;
    POSITION_NAME_KR: string;
    REMARK?: string;
    SEX_CODE: number;
    SEX_NAME: string;
    SEX_NAME_KR: string;
    SUBDEPTCODE: number;
    SUBDEPTNAME: string;
    SUBDEPTNAME_KR: string;
    WORK_POSITION_CODE: number;
    WORK_POSITION_NAME: string;
    WORK_POSITION_NAME_KR: string;
    WORK_SHIFT_CODE: number;
    WORK_SHIF_NAME: string;
    WORK_SHIF_NAME_KR: string;
    WORK_START_DATE: string;
    WORK_STATUS_CODE: number;
    WORK_STATUS_NAME: string;
    WORK_STATUS_NAME_KR: string;
}
export interface GlobalInterface {
    userData?: UserData,
    diemdanhstate?: boolean,
    lang?: string
    sidebarmenu?: boolean,
}
const initialState:GlobalInterface = {   
    userData: {
        ADD_COMMUNE: "Đông Xuân",
        ADD_DISTRICT: "Sóc Sơn",
        ADD_PROVINCE: "Hà Nội",
        ADD_VILLAGE: "Thôn Phú Thọ",
        ATT_GROUP_CODE: 1,
        CMS_ID: "CMS1179",
        CTR_CD: "002",
        DOB: "1993-10-18T00:00:00.000Z",
        EMAIL: "nvh1903@cmsbando.com",
        EMPL_NO: "none",
        FACTORY_CODE: 1,
        FACTORY_NAME: "Nhà máy 1",
        FACTORY_NAME_KR: "1공장",
        FIRST_NAME: "HÙNG3",
        HOMETOWN: "Phụ Thọ - Đông Xuân - Sóc Sơn - Hà Nội",
        JOB_CODE: 1,
        JOB_NAME: "Dept Staff",
        JOB_NAME_KR: "부서담당자",
        MAINDEPTCODE: 1,
        MAINDEPTNAME: "QC",
        MAINDEPTNAME_KR: "품질",
        MIDLAST_NAME: "NGUYỄN VĂN",
        ONLINE_DATETIME: "2022-07-12T20:49:52.600Z",
        PASSWORD: "dauxanhrauma",
        PHONE_NUMBER: "0971092454",
        POSITION_CODE: 3,
        POSITION_NAME: "Staff",
        POSITION_NAME_KR: "사원",
        REMARK: '',
        SEX_CODE: 1,
        SEX_NAME: "Nam",
        SEX_NAME_KR: "남자",
        SUBDEPTCODE: 2,
        SUBDEPTNAME: "PD",
        SUBDEPTNAME_KR: "통역",
        WORK_POSITION_CODE: 2,
        WORK_POSITION_NAME: "PD",
        WORK_POSITION_NAME_KR: "PD",
        WORK_SHIFT_CODE: 0,
        WORK_SHIF_NAME: "Hành Chính",
        WORK_SHIF_NAME_KR: "정규",
        WORK_START_DATE: "2019-03-11T00:00:00.000Z",
        WORK_STATUS_CODE: 1,
        WORK_STATUS_NAME: "Đang làm",
        WORK_STATUS_NAME_KR: "근무중",
      },
    diemdanhstate: false,
    lang: 'vi',
    sidebarmenu: false,

}
export const glbSlice = createSlice({
    name: 'totalSlice',
    initialState,
    reducers: {
        changeDiemDanhState: (state, action: PayloadAction<boolean>) => {
            //console.log(action.payload);
            state.diemdanhstate = action.payload;
        },
        changeUserData: (state, action: PayloadAction<UserData>)=> {
            //console.log(action.payload);
            state.userData = action.payload;            
        },
        update_socket: (state, action: PayloadAction<any>)=> {
            socket.emit("notification", action.payload);
          },
        toggleSidebar: (state,action: PayloadAction<any>)=> {         
          state.sidebarmenu = !state.sidebarmenu;
        }

    }
});
export const {changeDiemDanhState, changeUserData, update_socket,toggleSidebar } = glbSlice.actions;
export default glbSlice.reducer;
