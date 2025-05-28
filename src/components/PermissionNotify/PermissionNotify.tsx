import React from "react";
import { Alert } from "@mui/material";

const PermissionNotify: React.FC = () => {
    return (
        <Alert severity="error" sx={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: 'red' }}>
            You do not have enough permissions to use this feature
        </Alert>
    );
};
export default PermissionNotify;