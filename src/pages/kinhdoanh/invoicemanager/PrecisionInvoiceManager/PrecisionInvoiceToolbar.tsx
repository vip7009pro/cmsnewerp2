import React, { memo } from "react";
import {
  FiSidebar,
  FiPlusCircle,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiGrid,
  FiFileText,
  FiDownload,
} from "react-icons/fi";

interface Props {
  onToggleSidebar: () => void;
  onNewInvoice: () => void;
  onBulkImport: () => void;
  onEditInvoice: () => void;
  onDeleteInvoice: () => void;
  onUpdateInvoiceNo: () => void;
  onTogglePivot: () => void;
  onExport: () => void;
  invoiceNoRef: React.MutableRefObject<string>;
}

const PrecisionInvoiceToolbar: React.FC<Props> = ({
  onToggleSidebar,
  onNewInvoice,
  onBulkImport,
  onEditInvoice,
  onDeleteInvoice,
  onUpdateInvoiceNo,
  onTogglePivot,
  onExport,
  invoiceNoRef,
}) => {
  return (
    <div className="stitch-inv__toolbar">
      <div className="stitch-inv__toolbar-left">
        {/* Toggle sidebar */}
        <button className="stitch-inv__btn stitch-inv__btn--outline" onClick={onToggleSidebar}>
          <FiSidebar size={12} />
          <span>Show/Hide</span>
        </button>

        <div className="stitch-inv__toolbar-sep" />

        {/* CRUD */}
        <button className="stitch-inv__btn stitch-inv__btn--emerald" onClick={onNewInvoice}>
          <FiPlusCircle size={12} />
          NEW INV
        </button>
        <button className="stitch-inv__btn stitch-inv__btn--primary" onClick={onBulkImport}>
          <FiDownload size={12} style={{ transform: "rotate(180deg)" }} />
          UP HÀNG LOẠT
        </button>
        <button className="stitch-inv__btn stitch-inv__btn--amber" onClick={onEditInvoice}>
          <FiEdit2 size={12} />
          SỬA INV
        </button>
        <button className="stitch-inv__btn stitch-inv__btn--rose" onClick={onDeleteInvoice}>
          <FiTrash2 size={12} />
          XÓA INV
        </button>
        <button className="stitch-inv__btn stitch-inv__btn--teal" onClick={onUpdateInvoiceNo}>
          <FiRefreshCw size={12} />
          Update I.V No
        </button>

        {/* Invoice No input */}
        <input
          className="stitch-inv__iv-no-input"
          type="text"
          placeholder="Số Invoice..."
          defaultValue=""
          onChange={(e) => { invoiceNoRef.current = e.target.value; }}
        />

        <div className="stitch-inv__toolbar-sep" />

        {/* Analytics */}
        <button className="stitch-inv__btn stitch-inv__btn--purple" onClick={onTogglePivot}>
          <FiGrid size={12} />
          Pivot Grid
        </button>
        <button className="stitch-inv__btn stitch-inv__btn--slate" onClick={onExport}>
          <FiFileText size={12} />
          EX1 (Excel)
        </button>
      </div>

      <div className="stitch-inv__toolbar-right">
        <span style={{ color: "#059669", display: "flex", alignItems: "center", gap: 4 }}>
          <FiRefreshCw size={10} /> Sẵn sàng
        </span>
      </div>
    </div>
  );
};

export default memo(PrecisionInvoiceToolbar);
