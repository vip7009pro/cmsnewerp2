import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

import { RootState } from "../../../redux/store";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { UserData } from "../../../api/GlobalInterface";
import {
  BANGGIA_DATA_CALC,
  CODEDATA,
  DEFAULT_DM,
  GIANVL,
} from "../interfaces/kdInterface";
import { BOM_GIA } from "../../rnd/interfaces/rndInterface";

import PrecisionCostProductList from "./PrecisionQuotation/PrecisionCostProductList";
import PrecisionCostBOMAndVisualizer from "./PrecisionQuotation/PrecisionCostBOMAndVisualizer";
import PrecisionCostStandardUnits from "./PrecisionQuotation/PrecisionCostStandardUnits";
import PrecisionCostSheet from "./PrecisionQuotation/PrecisionCostSheet";
import PrecisionCostPricingAndHistory from "./PrecisionQuotation/PrecisionCostPricingAndHistory";
import PrecisionCostVisualModal from "./PrecisionQuotation/PrecisionCostVisualModal";
import PivotTable from "../../../components/PivotChart/PivotChart";

const initialSelectedCode: CODEDATA = {
  id: 0,
  Q_ID: "",
  G_CODE: "",
  WIDTH_OFFSET: 0,
  LENGTH_OFFSET: 0,
  KNIFE_UNIT: 0,
  FILM_UNIT: 0,
  INK_UNIT: 0,
  LABOR_UNIT: 0,
  DELIVERY_UNIT: 0,
  DEPRECATION_UNIT: 0,
  GMANAGEMENT_UNIT: 0,
  M_LOSS_UNIT: 0,
  G_WIDTH: 0,
  G_LENGTH: 0,
  G_C: 0,
  G_C_R: 0,
  G_LG: 0,
  G_CG: 0,
  G_SG_L: 0,
  G_SG_R: 0,
  PROD_PRINT_TIMES: 0,
  KNIFE_COST: 0,
  FILM_COST: 0,
  INK_COST: 0,
  LABOR_COST: 0,
  DELIVERY_COST: 0,
  DEPRECATION_COST: 0,
  GMANAGEMENT_COST: 0,
  MATERIAL_COST: 0,
  TOTAL_COST: 0,
  SALE_PRICE: 0,
  PROFIT: 0,
  G_NAME: "",
  G_NAME_KD: "",
  CUST_NAME_KD: "",
  CUST_CD: "",
};

const initialDefaultDM: DEFAULT_DM = {
  id: 0,
  WIDTH_OFFSET: 0,
  LENGTH_OFFSET: 0,
  KNIFE_UNIT: 0,
  FILM_UNIT: 0,
  INK_UNIT: 0,
  LABOR_UNIT: 0,
  DELIVERY_UNIT: 0,
  DEPRECATION_UNIT: 0,
  GMANAGEMENT_UNIT: 0,
  M_LOSS_UNIT: 0,
};

const CalcQuotation: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  /* ── Data States ── */
  const [listcode, setListCode] = useState<CODEDATA[]>([]);
  const [listVL, setListVL] = useState<BOM_GIA[]>([]);
  const [banggia, setBangGia] = useState<BANGGIA_DATA_CALC[]>([]);
  const [selectedRows, setSelectedRows] = useState<CODEDATA>(initialSelectedCode);

  /* ── Custom Cost Overrides (Inputs Tùy Biến) ── */
  const [cust_nhancong, setCust_NhanCong] = useState("0");
  const [cust_vanchuyen, setCust_VanChuyen] = useState("0");
  const [cust_khauhao, setCust_KhauHao] = useState("0");
  const [cust_quanlychung, setCust_QuanLyChung] = useState("0");

  /* ── Pricing & MOQ States ── */
  const [tempQTY, setTempQty] = useState(1);
  const [profit, setProfit] = useState(10);
  const [salePriceNB, setSalePriceNB] = useState(0);
  const [salePriceOP, setSalePriceOP] = useState(0);

  /* ── Standard Units ── */
  const [defaultDM, setDefaultDM] = useState<DEFAULT_DM>(initialDefaultDM);

  /* ── Modal States ── */
  const [openVisualModal, setOpenVisualModal] = useState(false);
  const [openPivotModal, setOpenPivotModal] = useState(false);
  const [pivotDataSource, setPivotDataSource] = useState<any>(null);

  /* ── Calculated Cost Figures ── */
  const [gianvl, setGiaNvl] = useState<GIANVL>({
    mCutWidth: 0,
    mLength: 0,
    mArea: 0,
    giaVLSS: 0,
    giaVLCMS: 0,
    knife_cost: 0,
    film_cost: 0,
    ink_cost: 0,
    labor_cost: 0,
    delivery_cost: 0,
    deprecation_cost: 0,
    gmanagement_cost: 0,
    totalcostCMS: 0,
    totalcostSS: 0,
  });

  /* ── Core Math Formulas: tinhgia ── */
  const tinhgia = useCallback(
    (codeInfo: CODEDATA, bomnvl: BOM_GIA[], qty: number) => {
      const materialCutWidth =
        (codeInfo.G_SG_L || 0) +
        ((codeInfo.G_CG || 0) + (codeInfo.G_WIDTH || 0)) * ((codeInfo.G_C || 1) - 1) +
        (codeInfo.G_WIDTH || 0) +
        (codeInfo.G_SG_R || 0) +
        (codeInfo.WIDTH_OFFSET || 0);

      const materialLength =
        (codeInfo.G_C || 0) > 0
          ? (((codeInfo.G_LENGTH || 0) + (codeInfo.G_LG || 0)) / (codeInfo.G_C || 1)) * 1.0 * qty
          : 0;

      const materialArea =
        (materialLength * materialCutWidth * (1 + (codeInfo.M_LOSS_UNIT || 0) / 100)) / 1000000;

      let matAmountCMS = 0;
      let matAmountSS = 0;
      for (let i = 0; i < bomnvl.length; i++) {
        matAmountCMS += (bomnvl[i].M_CMS_PRICE || 0) * materialArea;
        matAmountSS += (bomnvl[i].M_SS_PRICE || 0) * materialArea;
      }

      const knife_cost =
        (codeInfo.KNIFE_UNIT || 0) *
        ((codeInfo.G_WIDTH || 0) * (codeInfo.G_C || 1) * 2 +
          (codeInfo.G_LENGTH || 0) * (codeInfo.G_C_R || 1) * 2);

      const film_cost =
        (codeInfo.FILM_UNIT || 0) *
        ((codeInfo.G_WIDTH || 0) *
          ((codeInfo.G_LENGTH || 0) + (codeInfo.LENGTH_OFFSET || 0)) *
          (codeInfo.G_C || 1) *
          (codeInfo.PROD_PRINT_TIMES || 0));

      const ink_cost = (codeInfo.INK_UNIT || 0) * materialArea;
      const labor_cost = (codeInfo.LABOR_UNIT || 0) * materialArea;
      const delivery_cost = codeInfo.DELIVERY_UNIT || 0;
      const deprecation_cost = (codeInfo.DEPRECATION_UNIT || 0) * materialArea;
      const gmanagement_cost = (codeInfo.GMANAGEMENT_UNIT || 0) * materialArea;

      const total_costCMS =
        matAmountCMS +
        knife_cost +
        film_cost +
        ink_cost +
        labor_cost +
        delivery_cost +
        deprecation_cost +
        gmanagement_cost;

      const total_costSS =
        matAmountSS +
        knife_cost +
        film_cost +
        ink_cost +
        labor_cost +
        delivery_cost +
        deprecation_cost +
        gmanagement_cost;

      setGiaNvl({
        mCutWidth: materialCutWidth,
        mLength: materialLength,
        mArea: materialArea,
        giaVLSS: matAmountSS,
        giaVLCMS: matAmountCMS,
        knife_cost,
        film_cost,
        ink_cost,
        labor_cost,
        delivery_cost,
        deprecation_cost,
        gmanagement_cost,
        totalcostCMS: total_costCMS,
        totalcostSS: total_costSS,
      });

      return { total_costCMS, total_costSS };
    },
    []
  );

  /* ── HandlesetCodeInfo: Khi sửa tiêu chuẩn hoặc tùy biến ── */
  const handlesetCodeInfo = useCallback(
    (keyname: string, value: number) => {
      const tempCodeInfo = { ...selectedRows, [keyname]: value };
      const costs = tinhgia(tempCodeInfo, listVL, tempQTY);
      setSalePriceNB(costs.total_costCMS * (1 + profit / 100));
      setSalePriceOP(costs.total_costSS * (1 + profit / 100));
      setSelectedRows(tempCodeInfo);
    },
    [selectedRows, listVL, tempQTY, profit, tinhgia]
  );

  const handlesetDefaultDM = useCallback((keyname: string, value: any) => {
    setDefaultDM((prev) => ({ ...prev, [keyname]: value }));
  }, []);

  /* ── Load Bảng Giá Lịch Sử Code ── */
  const loadbanggia = useCallback(async (custCd: string, gCode: string) => {
    try {
      const res = await generalQuery("loadbanggiamoinhat", {
        ALLTIME: true,
        FROM_DATE: "",
        TO_DATE: "",
        M_NAME: "",
        G_CODE: gCode,
        G_NAME: "",
        CUST_NAME_KD: "",
        CUST_CD: custCd,
      });
      if (res.data.tk_status !== "NG") {
        const loaded: BANGGIA_DATA_CALC[] = res.data.data.map(
          (el: BANGGIA_DATA_CALC, idx: number) => ({
            ...el,
            PRICE_DATE: el.PRICE_DATE ? moment.utc(el.PRICE_DATE).format("YYYY-MM-DD") : "",
            id: idx,
          })
        );
        setBangGia(loaded);
      } else {
        setBangGia([]);
      }
    } catch (err) {
      setBangGia([]);
    }
  }, []);

  /* ── Load BOM NVL ── */
  const loadbomNVLQuotation = useCallback(
    async (codeInfo: CODEDATA, qty: number) => {
      try {
        const res = await generalQuery("getbomgia", { G_CODE: codeInfo.G_CODE });
        if (res.data.tk_status !== "NG") {
          const loaded: BOM_GIA[] = res.data.data.map((el: BOM_GIA, idx: number) => ({
            ...el,
            id: idx,
          }));
          setListVL(loaded);
          const costs = tinhgia(codeInfo, loaded, qty);
          setSalePriceNB(costs.total_costCMS * (1 + profit / 100));
          setSalePriceOP(costs.total_costSS * (1 + profit / 100));
        } else {
          setListVL([]);
        }
      } catch (err) {
        setListVL([]);
      }
    },
    [profit, tinhgia]
  );

  /* ── Load Danh Mục Sản Phẩm ── */
  const loadListCode = useCallback(async () => {
    try {
      const res = await generalQuery("loadlistcodequotation", {});
      if (res.data.tk_status !== "NG") {
        const loaded: CODEDATA[] = res.data.data.map((el: CODEDATA, idx: number) => ({
          ...el,
          G_NAME:
            getAuditMode() === 0
              ? el?.G_NAME
              : el?.G_NAME?.search("CNDB") === -1
              ? el?.G_NAME
              : "TEM_NOI_BO",
          G_NAME_KD:
            getAuditMode() === 0
              ? el?.G_NAME_KD
              : el?.G_NAME_KD?.search("CNDB") === -1
              ? el?.G_NAME_KD
              : "TEM_NOI_BO",
          id: idx,
        }));
        setListCode(loaded);
        if (loaded.length > 0 && !selectedRows.G_CODE) {
          handleSelectProduct(loaded[0]);
        }
      } else {
        setListCode([]);
      }
    } catch (err) {
      setListCode([]);
    }
  }, []);

  /* ── Load Default DM ── */
  const loadDefaultDM = useCallback(async () => {
    try {
      const res = await generalQuery("loadDefaultDM", {});
      if (res.data.tk_status !== "NG" && res.data.data?.length > 0) {
        setDefaultDM(res.data.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  /* ── Select Product Action ── */
  const handleSelectProduct = useCallback(
    (codeData: CODEDATA) => {
      setSelectedRows(codeData);
      loadbomNVLQuotation(codeData, tempQTY);
      loadbanggia(codeData.CUST_CD, codeData.G_CODE);
      setCust_KhauHao("0");
      setCust_NhanCong("0");
      setCust_QuanLyChung("0");
      setCust_VanChuyen("0");
    },
    [loadbomNVLQuotation, loadbanggia, tempQTY]
  );

  /* ── Update Giá Liệu BOM (updateGIAVLBOM2) ── */
  const updateGIAVLBOM2 = useCallback(async () => {
    if (listVL.length === 0) {
      Swal.fire("Thông báo", "Code này chưa có bom liệu", "error");
      return;
    }
    let hasErr = false;
    for (const item of listVL) {
      try {
        const res = await generalQuery("updateGiaVLBOM2", {
          G_CODE: item.G_CODE,
          M_CODE: item.M_CODE,
          M_CMS_PRICE: item.M_CMS_PRICE,
          M_SS_PRICE: item.M_SS_PRICE,
        });
        if (res.data.tk_status === "NG") hasErr = true;
      } catch (err) {
        hasErr = true;
      }
    }
    if (!hasErr) {
      Swal.fire("Thông báo", "Lưu giá liệu thành công", "success");
      if (selectedRows.G_CODE) loadbomNVLQuotation(selectedRows, tempQTY);
    } else {
      Swal.fire("Thông báo", "Có lỗi khi cập nhật giá liệu", "error");
    }
  }, [listVL, selectedRows, tempQTY, loadbomNVLQuotation]);

  /* ── Update Tiêu Chuẩn Hiện Tại vào DB (updateCurrentUnit) ── */
  const updateCurrentUnit = useCallback(async () => {
    try {
      await generalQuery("updateCurrentUnit", selectedRows);
    } catch (err) {
      console.error(err);
    }
  }, [selectedRows]);

  /* ── Upload Giá vào DB (uploadgia) ── */
  const uploadgia = useCallback(async () => {
    if (banggia.length === 0) {
      Swal.fire("Thông báo", "Thêm dòng hoặc import excel file để up giá", "error");
      return;
    }
    let err_code = "";
    const today = moment.utc().format("YYYY-MM-DD");
    for (let i = 0; i < banggia.length; i++) {
      if (banggia[i].PRICE_DATE === today) {
        try {
          const checkRes = await generalQuery("checkgiaExist", banggia[i]);
          if (checkRes.data.tk_status !== "NG") {
            const updRes = await generalQuery("updategiasp", banggia[i]);
            if (updRes.data.tk_status === "NG") err_code += `Lỗi: ${updRes.data.message} | `;
          } else {
            const insRes = await generalQuery("upgiasp", banggia[i]);
            if (insRes.data.tk_status === "NG") err_code += `Lỗi: ${insRes.data.message} | `;
          }
        } catch (err) {
          err_code += `Lỗi: ${err} | `;
        }
      }
    }
    if (err_code === "") {
      Swal.fire("Thông báo", "Up giá thành công", "success");
    } else {
      Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
    }
  }, [banggia]);

  /* ── Add to List: Thêm dòng vào bảng báo giá ── */
  const addRowBG = useCallback(() => {
    if (!selectedRows.G_CODE) {
      Swal.fire("Thông báo", "Chọn code bất kỳ!", "error");
      return;
    }
    const addBangGiaRow: BANGGIA_DATA_CALC = {
      CUST_CD: selectedRows.CUST_CD,
      G_CODE: selectedRows.G_CODE,
      PRICE_DATE: moment.utc().format("YYYY-MM-DD"),
      MOQ: tempQTY,
      FINAL: "N",
      PROD_PRICE: tempQTY > 0 ? Number((salePriceOP / tempQTY).toFixed(0)) : 0,
      BEP: tempQTY > 0 ? Number((gianvl.totalcostSS / tempQTY).toFixed(0)) : 0,
      id: banggia.length + 1,
      INS_DATE: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      INS_EMPL: userData?.EMPL_NO || "",
      UPD_DATE: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      UPD_EMPL: userData?.EMPL_NO || "",
      REMARK: "",
    };
    setBangGia((prev) => [...prev, addBangGiaRow]);
  }, [selectedRows, tempQTY, salePriceOP, gianvl.totalcostSS, banggia.length, userData]);

  /* ── Lưu Giá Master: Gọi đồng bộ 3 hàm gốc ── */
  const handleSaveMaster = useCallback(async () => {
    await uploadgia();
    await updateCurrentUnit();
    await loadListCode();
  }, [uploadgia, updateCurrentUnit, loadListCode]);

  /* ── Pivot Modal Open ── */
  const handleOpenPivot = (data: any[]) => {
    setPivotDataSource({
      fields: Object.keys(data[0] || {}).map((k) => ({
        caption: k,
        dataField: k,
      })),
      store: data,
    });
    setOpenPivotModal(true);
  };

  /* ── Init Data ── */
  useEffect(() => {
    loadListCode();
    loadDefaultDM();
  }, [loadListCode, loadDefaultDM]);

  return (
    <div className="stitch-calc">
      {/* SubNavigation Banner y hệt code.html & screen.png */}
      <section className="stitch-calc__subnav">
        <div className="subnav-left">
          <div className="sub-tab-btn sub-tab-btn--active">
            <span className="dot"></span>
            <span>Tính báo giá (BẢNG TÍNH GIÁ)</span>
          </div>
        </div>

        {/* Center Title Banner */}
        <div className="subnav-center">
          BẢNG TÍNH GIÁ
        </div>

        <div className="subnav-right">
          <span>Đơn vị tính: <strong>VND</strong></span>
          <span style={{ color: "#cbd5e1" }}>|</span>
          <span>Tỷ giá USD: <strong>25,450</strong></span>
        </div>
      </section>

      {/* Main Content Grid: 12 cột (4 cột trái : 8 cột phải) */}
      <main className="stitch-calc__grid">
        {/* Khối bên trái: Bảng danh sách sản phẩm (4 cột) */}
        <PrecisionCostProductList
          listcode={listcode}
          selectedCode={selectedRows}
          onSelectProduct={handleSelectProduct}
          onOpenPivot={() => handleOpenPivot(listcode)}
        />

        {/* Khối bên phải: Khu vực tính toán, tiêu chuẩn, cơ cấu chi phí & kết quả (8 cột) */}
        <div className="stitch-calc__right-col">
          {/* Top: BOM Materials Table */}
          <PrecisionCostBOMAndVisualizer
            listVL={listVL}
            selectedCode={selectedRows}
            onUpdateGiaNVL={updateGIAVLBOM2}
            onOpenVisualizer={() => setOpenVisualModal(true)}
            onOpenPivot={() => handleOpenPivot(listVL)}
          />

          {/* Middle: Standard Units Table (Standard vs Actual Cost Rates) */}
          <PrecisionCostStandardUnits
            defaultDM={defaultDM}
            onSetDefaultDM={handlesetDefaultDM}
            selectedCode={selectedRows}
            onSetCodeInfo={handlesetCodeInfo}
            onOpenVisualizer={() => setOpenVisualModal(true)}
          />

          {/* Bottom Split: 2 cột (Cơ cấu chi phí vs Định giá & Lịch sử) */}
          <div className="stitch-calc__bottom-split">
            {/* Cost Breakdown Table */}
            <PrecisionCostSheet
              gianvl={gianvl}
              selectedCode={selectedRows}
              onSetCodeInfo={handlesetCodeInfo}
              custNhanCong={cust_nhancong}
              onChangeCustNhanCong={setCust_NhanCong}
              custVanChuyen={cust_vanchuyen}
              onChangeCustVanChuyen={setCust_VanChuyen}
              custKhauHao={cust_khauhao}
              onChangeCustKhauHao={setCust_KhauHao}
              custQuanLyChung={cust_quanlychung}
              onChangeCustQuanLyChung={setCust_QuanLyChung}
            />

            {/* Pricing Summary & Quotation History */}
            <PrecisionCostPricingAndHistory
              tempQTY={tempQTY}
              onChangeQTY={(qty) => {
                setTempQty(qty);
                const costs = tinhgia(selectedRows, listVL, qty);
                setSalePriceNB(costs.total_costCMS * (1 + profit / 100));
                setSalePriceOP(costs.total_costSS * (1 + profit / 100));
              }}
              profit={profit}
              onChangeProfit={(p) => {
                setProfit(p);
                const costs = tinhgia(selectedRows, listVL, tempQTY);
                setSalePriceNB(costs.total_costCMS * (1 + p / 100));
                setSalePriceOP(costs.total_costSS * (1 + p / 100));
              }}
              salePriceNB={salePriceNB}
              onChangeSalePriceNB={setSalePriceNB}
              salePriceOP={salePriceOP}
              onChangeSalePriceOP={setSalePriceOP}
              onAddToList={addRowBG}
              onSaveMaster={handleSaveMaster}
              banggia={banggia}
              onDeleteRow={(id) => setBangGia((prev) => prev.filter((item) => item.id !== id))}
              onOpenPivot={() => handleOpenPivot(banggia)}
            />
          </div>
        </div>
      </main>

      {/* Modal Mô Phỏng Hình Dạng Sản Phẩm & Bản Vẽ Kỹ Thuật */}
      <PrecisionCostVisualModal
        open={openVisualModal}
        onClose={() => setOpenVisualModal(false)}
        selectedCode={selectedRows}
      />

      {/* Modal Pivot Table Popup */}
      {openPivotModal && pivotDataSource && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: "95vw",
              height: "90vh",
              borderRadius: 8,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#059669",
                color: "#ffffff",
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              <span>Phân Tích Dữ Liệu Đa Chiều (Pivot Grid)</span>
              <button
                onClick={() => setOpenPivotModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ flex: 1, minHeight: 0, padding: 8 }}>
              <PivotTable datasource={pivotDataSource} tableID="calcQuotationPivot" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalcQuotation;
