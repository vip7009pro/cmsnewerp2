import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const CHUNK_RELOAD_KEY = "erp_chunk_autoreload_at";
const CHUNK_RELOAD_COOLDOWN_MS = 15000;

/**
 * Lỗi tải module động (Vite/Rollup):
 * - Deploy phiên bản mới ⇒ hash chunk cũ 404 ("Failed to fetch dynamically imported module").
 * - Dev server restart / mất mạng tạm thời.
 * Những lỗi này KHÔNG thể phục hồi bằng cách render lại — chỉ cần reload 1 lần là xong.
 */
function isChunkLoadError(error?: Error): boolean {
  const message = `${error?.name ?? ""} ${error?.message ?? ""}`;
  return /ChunkLoadError|Loading chunk|Loading CSS chunk|dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
    message
  );
}

/**
 * Chỉ cho phép auto-reload 1 lần trong mỗi 15s để tránh vòng lặp reload vô hạn
 * khi nguyên nhân thực sự là mất mạng / server chết.
 */
function tryConsumeAutoReload(): boolean {
  try {
    const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? 0);
    if (
      Number.isFinite(last) &&
      last > 0 &&
      Date.now() - last < CHUNK_RELOAD_COOLDOWN_MS
    ) {
      return false;
    }
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
    return true;
  } catch {
    return false;
  }
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

    // Chunk lỗi ⇒ tự động tải lại trang (một lần) thay vì bắt người dùng F5 thủ công.
    if (isChunkLoadError(error) && tryConsumeAutoReload()) {
      window.location.reload();
    }
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
