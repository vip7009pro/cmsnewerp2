/**
 * Helper chuẩn hoá phản hồi từ backend `queryDB`.
 *
 * Backend (`practice1/config/database_mssql.js`) trả `{ tk_status: 'OK' | 'NG', message }`.
 * Tuy nhiên một số endpoint cũ vẫn `res.send("NO_LEADER")` — tức trả về CHUỖI thuần, khi đó
 * `response.data.message` là `undefined` và UI hiện "Nội dung: undefined".
 *
 * Quy ước: luôn dùng các helper dưới đây thay vì tự đọc `.tk_status` / `.message`,
 * để lỗi luôn hiển thị đúng nội dung thật từ máy chủ.
 *
 * Lưu ý: `generalQuery` (src/api/Api.ts) KHÔNG catch — nó THROW khi lỗi mạng/HTTP,
 * nên phải xử lý cả nhánh `catch` bằng `getErrMessage`.
 */

/** Backend báo thành công (chỉ đúng khi có `tk_status === 'OK'`). */
export const isTkOk = (response: any): boolean => response?.data?.tk_status === "OK";

/**
 * Lấy thông điệp thật từ mọi dạng phản hồi:
 * - object `{ tk_status, message }` (chuẩn)
 * - chuỗi thuần (VD `"NO_LEADER"`)
 * - `null` / `undefined` / rỗng
 */
export const getTkMessage = (
  response: any,
  fallback = "Không rõ nguyên nhân"
): string => {
  const data = response?.data;

  if (typeof data === "string") {
    const trimmed = data.trim();
    return trimmed !== "" ? trimmed : fallback;
  }

  if (data === null || data === undefined) {
    return typeof response?.message === "string" && response.message.trim() !== ""
      ? response.message
      : fallback;
  }

  if (typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim() !== "") {
      return data.message;
    }
    if (typeof data.tk_status === "string" && data.tk_status.trim() !== "") {
      return data.tk_status;
    }
    return fallback;
  }

  return String(data);
};

/** Lấy thông điệp từ exception (khi `generalQuery` throw do lỗi mạng/HTTP). */
export const getErrMessage = (
  error: any,
  fallback = "Lỗi kết nối máy chủ, vui lòng thử lại"
): string =>
  error?.response?.data?.message || error?.message || fallback;
