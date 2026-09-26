/* eslint-disable no-loop-func */
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { getCompany, getUserData } from "../../../../api/Api";
import { IconButton, TextField } from "@mui/material";
import "./EQ_STATUS2.scss";
import { checkBP } from "../../../../api/services/permissionService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Swal from "sweetalert2";
import { AiFillDelete, AiFillFileAdd, AiOutlineSetting } from "react-icons/ai";
import AGTable from "../../../../components/DataTable/AGTable";
import { EQ_STT } from "../interfaces/khsxInterface";
import { f_addMachine, f_deleteMachine, f_handle_loadEQ_STATUS, f_handle_toggleMachineActiveStatus } from "../utils/khsxUtils";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";
import PrecisionEqStatus2MobileHeader from "./PrecisionEqStatus2/PrecisionEqStatus2MobileHeader";
import PrecisionEqStatus2MobileToolbar from "./PrecisionEqStatus2/PrecisionEqStatus2MobileToolbar";
import PrecisionEqStatus2MobileKpi from "./PrecisionEqStatus2/PrecisionEqStatus2MobileKpi";
import PrecisionEqStatus2MobileFilterDrawer from "./PrecisionEqStatus2/PrecisionEqStatus2MobileFilterDrawer";
import PrecisionEqStatus2MobileContent from "./PrecisionEqStatus2/PrecisionEqStatus2MobileContent";
import PrecisionEqStatus2DesktopPanel from "./PrecisionEqStatus2/PrecisionEqStatus2DesktopPanel";
import PrecisionEqStatus2ManagerModal from "./PrecisionEqStatus2/PrecisionEqStatus2ManagerModal";
import PrecisionEqStatus2AddMachineDialog from "./PrecisionEqStatus2/PrecisionEqStatus2AddMachineDialog";

const EQ_STATUS2 = () => {
  const isMobile = useIsMobile();
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [factory, setFactory] = useState("NM1");
  const [eqCode, setEqCode] = useState("");
  const [eqName, setEqName] = useState("");
  const [eqActive, setEqActive] = useState("OK");
  const [eqOp, setEqOp] = useState(1);
  const [showHideEQManager, setShowHideEQManager] = useState(false);
  const [showAddMachineDialog, setShowAddMachineDialog] = useState(false);
  const selectedMachine = useRef<EQ_STT | null>(null);

  // Mobile filter states
  const [mobileFactoryFilter, setMobileFactoryFilter] = useState("ALL");
  const [mobileStatusFilter, setMobileStatusFilter] = useState("ALL");
  const [mobileActiveFilter, setMobileActiveFilter] = useState("ALL");
  const [mobileSeriesFilter, setMobileSeriesFilter] = useState("ALL");
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState(false);
  const [showMobileKpi, setShowMobileKpi] = useState(true);
  const [kpiSeries, setKpiSeries] = useState("ALL");

  const [searchString, setSearchString] = useState("");
  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [eq_status_manager_data, setEQ_STATUS_MANAGER_DATA] = useState<EQ_STT[]>([]);
  const [eq_series, setEQ_SERIES] = useState<string[]>([]);

  const handle_loadEQ_STATUS = async () => {
    let eq_data = await f_handle_loadEQ_STATUS();
    setEQ_STATUS(eq_data.EQ_STATUS);
    setEQ_SERIES(eq_data.EQ_SERIES);
  };

  const handleAddMachine = async () => {
    let kq = await f_addMachine({
      FACTORY: factory,
      EQ_CODE: eqCode,
      EQ_NAME: eqName,
      EQ_ACTIVE: eqActive,
      EQ_OP: eqOp,
    });
    if (kq) {
      Swal.fire({ icon: "success", title: "Add machine successfully" });
      handle_loadEQ_STATUS();
    } else {
      Swal.fire({ icon: "error", title: "Add machine failed" });
    }
  };

  const handleDeleteMachine = async () => {
    if (selectedMachine.current) {
      let kq = await f_deleteMachine({ EQ_CODE: selectedMachine.current?.EQ_CODE });
      if (kq) {
        Swal.fire({ icon: "success", title: "Delete machine successfully" });
        handle_loadEQ_STATUS();
      } else {
        Swal.fire({ icon: "error", title: "Delete machine failed" });
      }
    } else {
      Swal.fire({ icon: "error", title: "No machine selected" });
    }
  };

  const handleToggleMachineActiveStatus = async (EQ_CODE: string, EQ_ACTIVE: string) => {
    let kq = await f_handle_toggleMachineActiveStatus(EQ_CODE, EQ_ACTIVE);
    if (kq) {
      Swal.fire({ icon: "success", title: "Toggle machine active status successfully" });
      handle_loadEQ_STATUS();
    } else {
      Swal.fire({ icon: "error", title: "Toggle machine active status failed" });
    }
  };

  const column_eq_status = [
    { field: "EQ_CODE", headerName: "EQ_CODE", width: 80, checkboxSelection: true, headerCheckboxSelection: true },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "EQ_NAME", headerName: "EQ_NAME", width: 80 },
    { field: "EQ_SERIES", headerName: "EQ_SERIES", width: 80 },
    {
      field: "EQ_ACTIVE", headerName: "EQ_ACTIVE", width: 80, cellStyle: (params: any) => {
        if (params.data.EQ_ACTIVE === "OK") return { backgroundColor: "#77da41", color: "black" };
        if (params.data.EQ_ACTIVE === "NG") return { backgroundColor: "#ff0000", color: "white" };
      },
    },
    { field: "EQ_OP", headerName: "EQ_OP", width: 80 },
    { field: "EQ_STATUS", headerName: "EQ_STATUS", width: 80 },
    { field: "CURR_PLAN_ID", headerName: "CURR_PLAN_ID", width: 80 },
    { field: "CURR_G_CODE", headerName: "CURR_G_CODE", width: 80 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 80 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 80 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 80 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 80 },
  ];

  const eq_data_table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(getUserData(), ["SX", "QLSX"], ["Leader", "Manager"], ["ALL"], async () => {
                  setShowAddMachineDialog(true);
                });
              }}
            >
              <AiFillFileAdd color="#3741d3" size={15} />
              Add
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(getUserData(), ["SX", "QLSX"], ["Leader", "Manager"], ["ALL"], async () => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDeleteMachine();
                    }
                  });
                });
              }}
            >
              <AiFillDelete color="#fb0000" size={15} />
              Delete
            </IconButton>
          </>
        }
        data={eq_status_manager_data}
        columns={column_eq_status}
        onSelectionChange={() => {}}
        onRowClick={(e: any) => {
          selectedMachine.current = e.data;
        }}
      />
    );
  }, [eq_status_manager_data]);

  const filteredMobileMachines = useMemo(() => {
    return eq_status.filter((m) => {
      if (mobileFactoryFilter !== "ALL" && m.FACTORY !== mobileFactoryFilter) return false;
      if (mobileStatusFilter !== "ALL" && m.EQ_STATUS !== mobileStatusFilter) return false;
      if (mobileActiveFilter !== "ALL" && m.EQ_ACTIVE !== mobileActiveFilter) return false;
      if (mobileSeriesFilter !== "ALL" && m.EQ_NAME?.substring(0, 2) !== mobileSeriesFilter) return false;
      if (searchString.trim() !== "") {
        const kw = searchString.toLowerCase();
        const matchName = m.EQ_NAME?.toLowerCase().includes(kw);
        const matchCode = m.EQ_CODE?.toLowerCase().includes(kw);
        const matchPlan = m.CURR_PLAN_ID?.toLowerCase().includes(kw);
        const matchGName = m.G_NAME_KD?.toLowerCase().includes(kw);
        if (!matchName && !matchCode && !matchPlan && !matchGName) return false;
      }
      return true;
    });
  }, [eq_status, mobileFactoryFilter, mobileStatusFilter, mobileActiveFilter, mobileSeriesFilter, searchString]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (mobileFactoryFilter !== "ALL") count++;
    if (mobileStatusFilter !== "ALL") count++;
    if (mobileActiveFilter !== "ALL") count++;
    if (mobileSeriesFilter !== "ALL") count++;
    if (searchString.trim() !== "") count++;
    return count;
  }, [mobileFactoryFilter, mobileStatusFilter, mobileActiveFilter, mobileSeriesFilter, searchString]);

  const handleResetAllFilters = useCallback(() => {
    setMobileFactoryFilter("ALL");
    setMobileStatusFilter("ALL");
    setMobileActiveFilter("ALL");
    setMobileSeriesFilter("ALL");
    setSearchString("");
  }, []);

  const openDialogEQManager = () => {
    checkBP(getUserData(), ["SX", "QLSX"], ["Leader", "Manager"], ["ALL"], async () => {
      setEQ_STATUS_MANAGER_DATA(eq_status);
      setShowHideEQManager(true);
    });
  };

  useEffect(() => {
    handle_loadEQ_STATUS();
    let intervalID = window.setInterval(() => {
      handle_loadEQ_STATUS();
    }, 3000);
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);

  const mobileVisibleFactories = useMemo(() => {
    if (mobileFactoryFilter !== "ALL") return [mobileFactoryFilter];
    return getCompany() === "CMS" ? ["NM1", "NM2"] : ["NM1"];
  }, [mobileFactoryFilter]);

  return (
    <div className={`eq_status2 ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. GIAO DIỆN DESKTOP (BẢO TOÀN NGUYÊN VẸN 100%) */}
      {!isMobile && (
        <>
          <div className="eqs_header">
            <div className="eqs_header__left">
              <div className="eqs_header__title">Equipment Status</div>
              <div className="eqs_header__subtitle">Realtime overview (auto refresh 3s)</div>
            </div>
            <div className="eqs_header__right">
              <TextField
                size="small"
                label="Search plan / G-name"
                value={searchString}
                onChange={(e: any) => setSearchString(e.target.value)}
              />
              {getUserData()?.EMPL_NO === "NHU1903" && (
                <IconButton className="buttonIcon" onClick={openDialogEQManager}>
                  <AiOutlineSetting color="#0b8a4a" size={15} />
                  EQ Manager
                </IconButton>
              )}
            </div>
          </div>

          <div className="eqs_content">
            <PrecisionEqStatus2DesktopPanel
              factoryCode="NM1"
              eq_status={eq_status}
              eq_series={eq_series}
              searchString={searchString}
              onToggleStatus={handleToggleMachineActiveStatus}
            />
            {getCompany() === "CMS" && (
              <PrecisionEqStatus2DesktopPanel
                factoryCode="NM2"
                eq_status={eq_status}
                eq_series={eq_series}
                searchString={searchString}
                onToggleStatus={handleToggleMachineActiveStatus}
              />
            )}
          </div>
        </>
      )}

      {/* 2. GIAO DIỆN MOBILE TỐI ƯU CÔNG THÁI HỌC & ZERO BLUR */}
      {isMobile && (
        <>
          <PrecisionEqStatus2MobileHeader
            totalMachines={eq_status.length}
            filteredCount={filteredMobileMachines.length}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
            canManage={getUserData()?.EMPL_NO === "NHU1903"}
            onOpenEQManager={openDialogEQManager}
          />

          {showMobileKpi && (
            <PrecisionEqStatus2MobileKpi
              data={filteredMobileMachines}
              seriesList={eq_series}
              selectedSeries={kpiSeries}
              onSelectSeries={setKpiSeries}
            />
          )}

          <PrecisionEqStatus2MobileToolbar
            searchString={searchString}
            onSearchChange={setSearchString}
            onClearSearch={() => setSearchString("")}
            factoryFilter={mobileFactoryFilter}
            onFactoryChange={setMobileFactoryFilter}
            isCmsCompany={getCompany() === "CMS"}
            statusFilter={mobileStatusFilter}
            onStatusFilterChange={setMobileStatusFilter}
            activeFilter={mobileActiveFilter}
            onActiveFilterChange={setMobileActiveFilter}
            activeFilterCount={activeFilterCount}
            onOpenFilterDrawer={() => setShowMobileFilterDrawer(true)}
            onResetAllFilters={handleResetAllFilters}
          />

          <PrecisionEqStatus2MobileContent
            filteredMobileMachines={filteredMobileMachines}
            mobileVisibleFactories={mobileVisibleFactories}
            eq_series={eq_series}
            searchString={searchString}
            onToggleStatus={handleToggleMachineActiveStatus}
          />

          <PrecisionEqStatus2MobileFilterDrawer
            isOpen={showMobileFilterDrawer}
            onClose={() => setShowMobileFilterDrawer(false)}
            factoryFilter={mobileFactoryFilter}
            setFactoryFilter={setMobileFactoryFilter}
            isCmsCompany={getCompany() === "CMS"}
            seriesFilter={mobileSeriesFilter}
            setSeriesFilter={setMobileSeriesFilter}
            seriesList={eq_series}
            statusFilter={mobileStatusFilter}
            setStatusFilter={setMobileStatusFilter}
            activeFilter={mobileActiveFilter}
            setActiveFilter={setMobileActiveFilter}
            onApply={() => {}}
            onReset={handleResetAllFilters}
          />
        </>
      )}

      {/* 3. DIALOGS QUẢN LÝ (EQ MANAGER & ADD MACHINE) */}
      <PrecisionEqStatus2ManagerModal
        isOpen={showHideEQManager}
        onClose={() => setShowHideEQManager(false)}
        dataTable={eq_data_table}
      />

      <PrecisionEqStatus2AddMachineDialog
        isOpen={showAddMachineDialog}
        onClose={() => setShowAddMachineDialog(false)}
        factory={factory}
        setFactory={setFactory}
        eqCode={eqCode}
        setEqCode={setEqCode}
        eqName={eqName}
        setEqName={setEqName}
        eqOp={eqOp}
        setEqOp={setEqOp}
        eqActive={eqActive}
        setEqActive={setEqActive}
        onAddMachine={handleAddMachine}
      />
    </div>
  );
};

export default EQ_STATUS2;
