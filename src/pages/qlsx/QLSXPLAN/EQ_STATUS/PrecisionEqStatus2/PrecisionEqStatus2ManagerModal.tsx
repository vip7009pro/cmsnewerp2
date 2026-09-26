import React from "react";
import { IconButton } from "@mui/material";
import { AiFillCloseCircle } from "react-icons/ai";

interface PrecisionEqStatus2ManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataTable: React.ReactNode;
}

export const PrecisionEqStatus2ManagerModal: React.FC<PrecisionEqStatus2ManagerModalProps> = React.memo(({
  isOpen,
  onClose,
  dataTable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="eq_manager_overlay" onMouseDown={onClose}>
      <div className="eq_manager" onMouseDown={(e) => e.stopPropagation()}>
        <div className="eq_manager_title">
          <span>EQ Manager</span>
          <IconButton className="buttonIcon" onClick={onClose}>
            <AiFillCloseCircle color="blue" size={18} />
            Close
          </IconButton>
        </div>
        <div className="eq_manager_content">{dataTable}</div>
      </div>
    </div>
  );
});

export default PrecisionEqStatus2ManagerModal;
