import React, { useMemo } from "react";
import { AiOutlineSearch, AiOutlineUnorderedList } from "react-icons/ai";
import { BsLayers } from "react-icons/bs";
import AGTable from "../../../../components/DataTable/AGTable";
import { CODE_INFO, CODEPHOI, LIST_BOM_AMAZON } from "../../interfaces/rndInterface";
import { SidebarTabMode } from "./bomAmazonTypes";
import { createCodeInfoColumns, createListBomAmazonColumns } from "./PrecisionBomAmazonColumns";

interface SidebarProps {
  isOpen: boolean;
  codephoilist: CODEPHOI[];
  G_CODE_MAU: string;
  setG_CODE_MAU: (val: string) => void;
  sidebarTab: SidebarTabMode;
  setSidebarTab: (val: SidebarTabMode) => void;
  listamazontable: LIST_BOM_AMAZON[];
  rows: CODE_INFO[];
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  handleSearchCodeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCODEINFO: () => void;
  handleGETBOMAMAZON: (G_CODE: string) => void;
  onSelectCodeInfo: (row: CODE_INFO) => void;
}

export const PrecisionBomAmazonSidebar: React.FC<SidebarProps> = React.memo(
  ({
    isOpen,
    codephoilist,
    G_CODE_MAU,
    setG_CODE_MAU,
    sidebarTab,
    setSidebarTab,
    listamazontable,
    rows,
    codeCMS,
    setCodeCMS,
    handleSearchCodeKeyDown,
    handleCODEINFO,
    handleGETBOMAMAZON,
    onSelectCodeInfo,
  }) => {
    const listBomColumns = useMemo(() => createListBomAmazonColumns(false), []);
    const codeInfoColumns = useMemo(() => createCodeInfoColumns(false), []);

    return (
      <aside className={`precision-bom-amz__sidebar ${!isOpen ? "precision-bom-amz__sidebar--collapsed" : ""}`}>
        {/* KHUNG CHỌN PHÔI */}
        <div className="precision-bom-amz__phoiBox">
          <label htmlFor="select-code-phoi">
            <BsLayers size={13} color="#2563eb" />
            <span>CODE PHÔI MẪU:</span>
          </label>
          <select
            id="select-code-phoi"
            value={G_CODE_MAU}
            onChange={(e) => setG_CODE_MAU(e.target.value)}
          >
            {codephoilist.map((phoi, idx) => (
              <option key={idx} value={phoi.G_CODE_MAU}>
                {phoi.G_NAME || phoi.G_CODE_MAU}
              </option>
            ))}
          </select>
        </div>

        {/* TABS CHUYỂN ĐỔI CHẾ ĐỘ TRA CỨU */}
        <div className="precision-bom-amz__sidebarTabs">
          <button
            type="button"
            className={`precision-bom-amz__sidebarTabBtn ${
              sidebarTab === "EXISTING" ? "precision-bom-amz__sidebarTabBtn--active" : ""
            }`}
            onClick={() => setSidebarTab("EXISTING")}
            title="Danh sách mã hàng đã được thiết lập BOM Amazon"
          >
            <AiOutlineUnorderedList size={13} />
            <span>ĐÃ CÓ BOM</span>
            <span className="countBadge">{listamazontable.length}</span>
          </button>

          <button
            type="button"
            className={`precision-bom-amz__sidebarTabBtn ${
              sidebarTab === "SEARCH_ALL" ? "precision-bom-amz__sidebarTabBtn--active" : ""
            }`}
            onClick={() => setSidebarTab("SEARCH_ALL")}
            title="Tra cứu danh mục toàn bộ mã hàng để tạo BOM mới từ phôi"
          >
            <AiOutlineSearch size={13} />
            <span>TRA CỨU ALL</span>
            <span className="countBadge">{rows.length}</span>
          </button>
        </div>

        {/* Ô TÌM KIẾM THEO TAB */}
        {sidebarTab === "SEARCH_ALL" ? (
          <div className="precision-bom-amz__sidebarSearchBox">
            <div className="inputWrapper">
              <span className="searchIcon">
                <AiOutlineSearch />
              </span>
              <input
                type="text"
                placeholder="Nhập mã hoặc tên sản phẩm..."
                value={codeCMS}
                onChange={(e) => setCodeCMS(e.target.value)}
                onKeyDown={handleSearchCodeKeyDown}
              />
            </div>
            <button
              type="button"
              className="searchBtn"
              onClick={handleCODEINFO}
              title="Tìm mã hàng theo từ khóa (hoặc nhấn Enter)"
            >
              Tìm
            </button>
          </div>
        ) : (
          <div className="precision-bom-amz__sidebarSearchBox">
            <div className="inputWrapper">
              <span className="searchIcon">
                <AiOutlineSearch />
              </span>
              <input
                type="text"
                placeholder="Lọc mã đã có BOM Amazon..."
                onChange={(e) => {
                  // Có thể lọc nhanh qua AG-Grid filter hoặc nạp lại
                }}
              />
            </div>
          </div>
        )}

        {/* BẢNG DỮ LIỆU SIDEBAR */}
        <div className="precision-bom-amz__sidebarGrid">
          {sidebarTab === "EXISTING" ? (
            <AGTable
              showFilter={true}
              toolbar={<></>}
              columns={listBomColumns}
              data={listamazontable}
              onSelectionChange={() => {}}
              onRowClick={(params: any) => {
                if (params.data?.G_CODE) {
                  handleGETBOMAMAZON(params.data.G_CODE);
                }
              }}
            />
          ) : (
            <AGTable
              showFilter={true}
              toolbar={<></>}
              columns={codeInfoColumns}
              data={rows}
              onSelectionChange={() => {}}
              onRowClick={(params: any) => {
                if (params.data) {
                  onSelectCodeInfo(params.data);
                }
              }}
            />
          )}
        </div>
      </aside>
    );
  }
);

PrecisionBomAmazonSidebar.displayName = "PrecisionBomAmazonSidebar";
