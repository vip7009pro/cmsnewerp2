import React from 'react';
import './CustomDialog.scss'; // You'll need to create this CSS file
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../redux/store';

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  content: React.ReactNode;
  actions: React.ReactNode;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ isOpen, onClose, title, content, actions }) => {
  if (!isOpen) return null;
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);

  return (
    <div className="custom-dialog-overlay" onClick={onClose}>
      <div className="custom-dialog" onClick={(e) => e.stopPropagation()} style={{ backgroundImage: theme.CMS.backgroundImage }}>
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

