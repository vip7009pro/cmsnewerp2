import React from "react";
import { IconButton } from "@mui/material";
import { AiFillPlusCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import CustomDialog from "../../../../../components/Dialog/CustomDialog";

interface PrecisionEqStatus2AddMachineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  factory: string;
  setFactory: (val: string) => void;
  eqCode: string;
  setEqCode: (val: string) => void;
  eqName: string;
  setEqName: (val: string) => void;
  eqOp: number;
  setEqOp: (val: number) => void;
  eqActive: string;
  setEqActive: (val: string) => void;
  onAddMachine: () => Promise<void>;
}

export const PrecisionEqStatus2AddMachineDialog: React.FC<
  PrecisionEqStatus2AddMachineDialogProps
> = React.memo(({
  isOpen,
  onClose,
  factory,
  setFactory,
  eqCode,
  setEqCode,
  eqName,
  setEqName,
  eqOp,
  setEqOp,
  eqActive,
  setEqActive,
  onAddMachine,
}) => {
  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add machine"
      content={
        <div>
          <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="factory" style={{ marginBottom: "5px" }}>Factory:</label>
              <select
                id="factory"
                name="factory"
                value={factory}
                onChange={(e) => setFactory(e.target.value)}
                style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="NM1">NM1</option>
                <option value="NM2">NM2</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="eq_code" style={{ marginBottom: "5px" }}>EQ Code:</label>
              <input
                type="text"
                id="eq_code"
                name="eq_code"
                value={eqCode}
                onChange={(e) => setEqCode(e.target.value)}
                style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="eq_name" style={{ marginBottom: "5px" }}>EQ Name:</label>
              <input
                type="text"
                id="eq_name"
                name="eq_name"
                value={eqName}
                onChange={(e) => setEqName(e.target.value)}
                style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="eq_op" style={{ marginBottom: "5px" }}>EQ OP:</label>
              <input
                type="number"
                id="eq_op"
                name="eq_op"
                value={eqOp}
                onChange={(e) => setEqOp(parseInt(e.target.value) || 1)}
                style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="eq_active" style={{ marginBottom: "5px" }}>EQ Active:</label>
              <select
                id="eq_active"
                name="eq_active"
                value={eqActive}
                onChange={(e) => setEqActive(e.target.value)}
                style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="OK">OK</option>
                <option value="NG">NG</option>
              </select>
            </div>
          </form>
        </div>
      }
      actions={
        <IconButton
          className="buttonIcon"
          onClick={() => {
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, add it!",
            }).then(async (result) => {
              if (result.isConfirmed) {
                await onAddMachine();
                onClose();
              }
            });
          }}
        >
          <AiFillPlusCircle color="green" size={15} />
          Add Machine
        </IconButton>
      }
    />
  );
});

export default PrecisionEqStatus2AddMachineDialog;
