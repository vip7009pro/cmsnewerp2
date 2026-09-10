import React, { useState } from "react";
import "./PrecisionFCST/PrecisionFCST.scss";
import PrecisionFCSTHeader from "./PrecisionFCST/PrecisionFCSTHeader";
import PrecisionFCSTAddModal from "./PrecisionFCST/PrecisionFCSTAddModal";
import FCSTManagerManageTab from "./FCSTManagerManageTab";

const FCSTManager: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);

  return (
    <div className="precision-fcst">
      {/* Header: Sub-Tab + Action Buttons */}
      <PrecisionFCSTHeader
        onOpenAddModal={() => setOpenAddModal(true)}
        onDeleteFcst={() => {
          // Delegate to ManageTab via custom event
          window.dispatchEvent(new CustomEvent("fcst-delete-selected"));
        }}
        onTogglePivot={() => {
          window.dispatchEvent(new CustomEvent("fcst-toggle-pivot"));
        }}
        onExportEX1={() => {
          window.dispatchEvent(new CustomEvent("fcst-export-ex1"));
        }}
        onExportEX2={() => {
          window.dispatchEvent(new CustomEvent("fcst-export-ex2"));
        }}
      />

      {/* Main Content: Filter Sidebar + Data Grid */}
      <div className="precision-fcst__content">
        <FCSTManagerManageTab />
      </div>

      {/* Modal Thêm FCST */}
      <PrecisionFCSTAddModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
    </div>
  );
};

export default FCSTManager;
