import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" p={3}>
          <Typography variant="h4" color="error" gutterBottom>
            Đã xảy ra lỗi (Runtime Error)
          </Typography>
         <Typography variant="body1" sx={{ mb: 3 }}>
            Xin lỗi, tải trang thất bại. Mời bạn tải lại trang.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Tải Lại
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
