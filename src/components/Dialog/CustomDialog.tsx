import React, { useRef } from 'react';
import './CustomDialog.scss'; // You'll need to create this CSS file
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  content: React.ReactNode;
  actions: React.ReactNode;
  dialogClassName?: string;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ isOpen, onClose, title, content, actions, dialogClassName }) => {
  if (!isOpen) return null;
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const mouseDownTarget = useRef<EventTarget | null>(null);

  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseDownTarget.current = e.target;
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Chỉ đóng modal khi người dùng chủ động click trực tiếp ngoài vùng modal:
    // Cả mousedown và click đều phải diễn ra trên chính overlay (e.currentTarget)
    if (e.target === e.currentTarget && mouseDownTarget.current === e.currentTarget) {
      onClose();
    }
    mouseDownTarget.current = null;
  };

  return (
    <div
      className="custom-dialog-overlay"
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
    >
      <div
        className={`custom-dialog${dialogClassName ? ` ${dialogClassName}` : ""}`}
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundImage: theme.CMS.backgroundImage }}
      >
        <div className="custom-dialog-title">
          {title}
        </div>
        <div className="custom-dialog-content">
          {content}
        </div>
        <div className="custom-dialog-actions">
          {actions}
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;

// Add these styles to your CustomDialog.css file

