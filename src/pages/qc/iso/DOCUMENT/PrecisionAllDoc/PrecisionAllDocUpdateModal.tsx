import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
} from "@mui/material";
import { AiOutlineClose, AiOutlineSave } from "react-icons/ai";
import { UpdateModalState, DOCUMENT_DATA } from "./allDocTypes";

interface UpdateModalProps {
  updateState: UpdateModalState;
  setUpdateState: React.Dispatch<React.SetStateAction<UpdateModalState>>;
  selectedRows: DOCUMENT_DATA[];
  onClose: () => void;
  onSave: () => Promise<void>;
}

export const PrecisionAllDocUpdateModal: React.FC<UpdateModalProps> = ({
  updateState,
  setUpdateState,
  selectedRows,
  onClose,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  if (!updateState.isOpen) return null;

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={updateState.isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      className="pad-dialog-custom"
    >
      <DialogTitle>
        <span>Cập Nhật Thông Tin Tài Liệu</span>
        <IconButton size="small" onClick={onClose} disabled={isSaving}>
          <AiOutlineClose size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1e40af",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            marginBottom: "14px",
            fontWeight: 500,
          }}
        >
          Áp dụng cập nhật cho <b>{selectedRows.length}</b> tài liệu đang tick chọn
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Ngày ban hành (REG_DATE)"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={updateState.REG_DATE}
              onChange={(e) =>
                setUpdateState((prev) => ({
                  ...prev,
                  REG_DATE: e.target.value,
                }))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Ngày hết hạn (EXP_DATE)"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={updateState.EXP_DATE}
              disabled={updateState.HSD_YN === "N"}
              onChange={(e) =>
                setUpdateState((prev) => ({
                  ...prev,
                  EXP_DATE: e.target.value,
                }))
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel>Có hạn dùng (HSD)</InputLabel>
              <Select
                value={updateState.HSD_YN}
                label="Có hạn dùng (HSD)"
                onChange={(e) =>
                  setUpdateState((prev) => ({
                    ...prev,
                    HSD_YN: e.target.value as string,
                  }))
                }
              >
                <MenuItem value="Y">Có HSD</MenuItem>
                <MenuItem value="N">Vô hạn</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel>Hiệu lực sử dụng (USE_YN)</InputLabel>
              <Select
                value={updateState.USE_YN}
                label="Hiệu lực sử dụng (USE_YN)"
                onChange={(e) =>
                  setUpdateState((prev) => ({
                    ...prev,
                    USE_YN: e.target.value as string,
                  }))
                }
              >
                <MenuItem value="Y">Đang sử dụng (Y)</MenuItem>
                <MenuItem value="N">Ngừng sử dụng (N)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isSaving}>
          Hủy
        </Button>
        <Button
          onClick={handleSaveClick}
          variant="contained"
          color="primary"
          disabled={isSaving}
          startIcon={<AiOutlineSave />}
        >
          {isSaving ? "Đang cập nhật..." : "Áp Dụng Cập Nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
