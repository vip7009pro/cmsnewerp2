import { Html5QrcodeSupportedFormats } from "html5-qrcode";

export type ScannerScanMode = "single" | "continuous";

export interface CameraDeviceItem {
  id: string;
  label: string;
  isBackCamera?: boolean;
}

export interface ZoomCapabilitiesState {
  min: number;
  max: number;
  step: number;
  current: number;
  isSupported: boolean;
}

export interface UniversalScannerProps {
  /** Callback được gọi khi quét mã thành công */
  onScanSuccess: (decodedText: string, formatName?: string) => void;
  /** Callback tùy chọn khi có lỗi quét */
  onScanError?: (errorMessage: string) => void;
  /** Chế độ quét: 'single' (dừng sau 1 mã) hoặc 'continuous' (quét liên tục nhiều mã) */
  mode?: ScannerScanMode;
  /** Tốc độ quét FPS (Mặc định: 25) */
  fps?: number;
  /** Bật âm thanh bíp khi quét trúng (Mặc định: true) */
  beepOnScan?: boolean;
  /** Bật rung khi quét trúng (Mặc định: true) */
  vibrateOnScan?: boolean;
  /** Tắt tính năng đèn Flash */
  disableTorch?: boolean;
  /** Tắt tính năng Zoom */
  disableZoom?: boolean;
  /** Tắt tính năng chuyển đổi Camera */
  disableCameraSwitch?: boolean;
  /** Tắt tab tải ảnh từ máy */
  disableFileUpload?: boolean;
  /** Tắt tab nhập mã thủ công */
  disableManualInput?: boolean;
  /** Danh sách định dạng muốn hỗ trợ (Mặc định: toàn bộ QR và Barcode phổ biến) */
  formatsToSupport?: Html5QrcodeSupportedFormats[];
  /** Tùy biến class bọc ngoài */
  className?: string;
  /** Chiều cao khung camera (Mặc định: 360px trên mobile, 420px trên desktop) */
  cameraHeight?: number | string;
}

export interface UniversalScannerModalProps {
  /** Trạng thái mở modal */
  open: boolean;
  /** Hàm đóng modal */
  onClose: () => void;
  /** Callback trả về mã sau khi quét hoặc nhập thành công */
  onScanSuccess: (decodedText: string) => void;
  /** Tiêu đề modal */
  title?: string;
  /** Hướng dẫn bên dưới tiêu đề hoặc khung quét */
  description?: string;
  /** Chế độ quét: single hoặc continuous */
  mode?: ScannerScanMode;
  /** Cho phép nhập thủ công */
  allowManualInput?: boolean;
  /** Cho phép tải ảnh từ máy */
  allowFileUpload?: boolean;
}
