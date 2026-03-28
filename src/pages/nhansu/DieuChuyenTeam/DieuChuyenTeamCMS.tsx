import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FormControl, Select, MenuItem, InputLabel, Box, Typography } from "@mui/material";
import Swal from "sweetalert2";
import moment from "moment";
import { RootState } from "../../../redux/store";
import { generalQuery, getSocket, getUserData, getCompany } from "../../../api/Api";
import { f_insert_Notification_Data } from "../../../api/services/notificationService";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import { DiemDanhNhomData, WorkPositionTableData } from "../interfaces/nhansuInterface";
import { getlang } from "../../../components/String/String";
import AGTable from "../../../components/DataTable/AGTable";

import TeamCell from "./components/TeamCell";
import ShiftCell from "./components/ShiftCell";
import FactoryCell from "./components/FactoryCell";
import PositionCell from "./components/PositionCell";

import "./DieuChuyenTeam.scss";

const FullNameCellElement = (params: any) => {
  return (
    <Typography sx={{ fontSize: '0.6rem', fontWeight: 'normal', color: 'blue' }}>
      {params.data?.FULL_NAME}
    </Typography>
  );
};

const DieuChuyenTeamCMS = ({ option1, option2 }: { option1: string, option2: string }) => {
  const glbLang: string | undefined = useSelector((state: RootState) => state.totalSlice.lang);
  const [WORK_SHIFT_CODE, setWORK_SHIFT_CODE] = useState(5);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<Array<DiemDanhNhomData>>([]);
  const [workpositionload, setWorkPositionLoad] = useState<Array<WorkPositionTableData>>([]);

  const loadDiemDanhNhomTable = useCallback(async (teamnamelist: number) => {
    generalQuery(option1, { team_name_list: teamnamelist })
      .then((response) => {
        let loaded_data = response.data.data.map((e: any, index: number) => ({
          ...e,
          REQUEST_DATE: e.REQUEST_DATE ? moment.utc(e.REQUEST_DATE).format("YYYY-MM-DD") : "",
          APPLY_DATE: e.APPLY_DATE ? moment.utc(e.APPLY_DATE).format("YYYY-MM-DD") : "",
          FULL_NAME: e.MIDLAST_NAME + " " + e.FIRST_NAME,
          id: index + 1,
        }));
        setDiemDanhNhomTable(loaded_data);
      })
      .catch(console.error);
  }, [option1]);

  const loadWorkPositionTable = useCallback(() => {
    generalQuery(option2, {})
      .then((response) => {
        let loaded_data = response.data.data.map((e: any, index: number) => ({ ...e, id: index + 1 }));
        setWorkPositionLoad(loaded_data);
      })
      .catch(console.error);
  }, [option2]);

  const setTeam = useCallback(async (EMPL_NO: string, value: number) => {
    generalQuery("setteamnhom", { teamvalue: value, EMPL_NO }).then((response) => {
      if (response.data.tk_status === "OK") {
        setDiemDanhNhomTable(prev => prev.map(p => p.EMPL_NO === EMPL_NO
          ? { ...p, WORK_SHIF_NAME: value === 0 ? "Hành Chính" : value === 1 ? "TEAM 1" : "TEAM 2" }
          : p));
      } else {
        Swal.fire("Có lỗi", response.data.message, "error");
      }
    });
  }, []);

  const setCa = useCallback(async (params: any, value: number) => {
    generalQuery("setca", { EMPL_NO: params.data?.EMPL_NO, CALV: value })
      .then(async (response) => {
        if (response.data.tk_status === "OK") {
          const EMPL_NO = params.data?.EMPL_NO;
          setDiemDanhNhomTable(prev => prev.map(p => p.EMPL_NO === EMPL_NO ? { ...p, CALV: value } : p));

          let newNotification: NotificationElement = {
            CTR_CD: "002", NOTI_ID: -1, NOTI_TYPE: "success", TITLE: "Thay đổi ca làm việc",
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}) đã thay ca cho ${EMPL_NO} thành ${value === 2 ? "Ca đêm" : value === 1 ? "Ca ngày" : "Ca HC"}`,
            SUBDEPTNAME: getUserData()?.SUBDEPTNAME ?? "", MAINDEPTNAME: getUserData()?.MAINDEPTNAME ?? "",
            INS_EMPL: "NHU1903", INS_DATE: "2024-12-30", UPD_EMPL: "NHU1903", UPD_DATE: "2024-12-30",
          };
          if (await f_insert_Notification_Data(newNotification)) {
            getSocket().emit("notification_panel", newNotification);
          }
        } else {
          Swal.fire("Có lỗi", response.data.message, "error");
        }
      })
      .catch(console.error);
  }, []);

  const resetCa = useCallback(async (params: any) => {
    setDiemDanhNhomTable(prev => prev.map(p => p.EMPL_NO === params.data?.EMPL_NO ? { ...p, CALV: null } : p));
  }, []);

  const setFactory = useCallback(async (EMPL_NO: string, value: number) => {
    generalQuery("setnhamay", { EMPL_NO, FACTORY: value })
      .then((response) => {
        if (response.data.tk_status === "OK") {
          setDiemDanhNhomTable(prev => prev.map(p => p.EMPL_NO === EMPL_NO ? { ...p, FACTORY_NAME: value === 1 ? "Nhà máy 1" : "Nhà máy 2" } : p));
        } else {
          Swal.fire("Có lỗi", response.data.message, "error");
        }
      })
      .catch(console.error);
  }, []);

  const setViTri = useCallback(async (EMPL_NO: string, WORK_POSITION_CODE: number) => {
    Swal.fire({
      title: "Chắc chắn muốn chuyển vị trí?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Vẫn chuyển!",
    }).then((result) => {
      if (result.isConfirmed) {
        generalQuery("setEMPL_WORK_POSITION", { WORK_POSITION_CODE, EMPL_NO })
          .then((response) => {
            if (response.data.tk_status === "OK") {
              setDiemDanhNhomTable(prev => prev.map(p => p.EMPL_NO === EMPL_NO ? {
                ...p, WORK_POSITION_CODE,
                WORK_POSITION_NAME: workpositionload.find(w => w.WORK_POSITION_CODE === WORK_POSITION_CODE)?.WORK_POSITION_NAME ?? ""
              } : p));
              Swal.fire("Thành công", "Đã chuyển vị trí", "success");
            } else {
              Swal.fire("Lỗi", response.data.message, "error");
            }
          })
          .catch(console.error);
      }
    });
  }, [workpositionload]);

  const columns = useMemo(() => {
    const baseCols = [
      { field: "id", headerName: "ID", width: 50 },
      { field: "FULL_NAME", headerName: "FULL_NAME", width: 140, cellRenderer: FullNameCellElement },
      { field: "WORK_SHIF_NAME", headerName: "TEAM", width: 100 },
      {
        field: "SET_TEAM", headerName: "SET_TEAM", width: 150,
        cellClass: 'flex-center-end-cell',
        cellRenderer: (p: any) => <TeamCell data={p.data} onSetTeam={setTeam} />
      },
      {
        field: "SETCA", headerName: "SET CA", width: 220,
        cellClass: 'flex-center-end-cell',
        cellRenderer: (p: any) => <ShiftCell data={p.data} onSetCa={setCa} onResetCa={resetCa} />
      },
      { field: "FACTORY_NAME", headerName: "NM", width: 80 },
      {
        field: "SET_NM", headerName: "SET_NM", width: 150,
        cellClass: 'flex-center-end-cell',
        cellRenderer: (p: any) => <FactoryCell data={p.data} onSetFactory={setFactory} />
      },
      { field: "WORK_POSITION_NAME", headerName: "VI_TRI", width: 120 },
      {
        field: "SETVITRI", headerName: "SET_VI_TRI", width: 180,
        cellClass: 'flex-center-end-cell',
        cellRenderer: (p: any) => <PositionCell data={p.data} workpositionload={workpositionload} onSetViTri={setViTri} />
      },
      { field: "EMPL_NO", headerName: "EMPL_NO", width: 80 },
      { field: "CMS_ID", headerName: "NS_ID", width: 80 },
      { field: "SUBDEPTNAME", headerName: "BỘ PHẬN", width: 100 },
      { field: "WORK_STATUS_NAME", headerName: "TRẠNG THÁI", width: 100 },
      { field: "JOB_NAME", headerName: "CÔNG VIỆC", width: 100 },
    ];

    return baseCols.map(col => ({
      ...col,
      cellClass: col.cellClass ? `${col.cellClass} flex-center-vertical` : 'flex-center-vertical'
    }));
  }, [setTeam, setCa, resetCa, setFactory, setViTri, workpositionload]);

  useEffect(() => {
    loadWorkPositionTable();
    loadDiemDanhNhomTable(5);
  }, [loadWorkPositionTable, loadDiemDanhNhomTable]);

  return (
    <Box className="dieuchuyenteam">
      <Box className="filterform" sx={{ p: 0.2, borderRadius: 1, display: 'flex', alignItems: 'center', height: 'fit-content' }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1, height: '25px' }}>
          <InputLabel sx={{ fontSize: '0.75rem', top: '2px' }}>{getlang("calamviec", glbLang!)}</InputLabel>
          <Select
            label={getlang("calamviec", glbLang!)}
            value={WORK_SHIFT_CODE}
            onChange={(e) => {
              setWORK_SHIFT_CODE(Number(e.target.value));
              loadDiemDanhNhomTable(Number(e.target.value));
            }}
            sx={{ height: '28px', fontSize: '0.75rem' }}
          >
            {[
              { v: 0, t: "TEAM 1 + Hành chính" },
              { v: 1, t: "TEAM 2+ Hành chính" },
              { v: 2, t: "TEAM 1" },
              { v: 3, t: "TEAM 2" },
              { v: 4, t: "Hành chính" },
              { v: 5, t: "Tất cả" }
            ].map(opt => (
              <MenuItem key={opt.v} value={opt.v} sx={{ fontSize: '0.7rem' }}>{opt.t}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box className="maindept_table">
        <AGTable
          rowHeight={30}
          suppressRowClickSelection={false}
          toolbar={<></>}
          columns={columns}
          data={diemdanhnhomtable}
          onSelectionChange={() => { }}
        />
      </Box>
    </Box>
  );
};

export default DieuChuyenTeamCMS;
