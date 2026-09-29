import { getUserData } from "../Api";
import type { NotificationElement } from "../../components/NotificationPanel/Notification";

/** Danh sách job được xem là quản lý — phải khớp với backend `nhansuService`. */
const APPROVER_JOBS = ["Leader", "Sub Leader", "Dept Staff", "ADMIN"];

/**
 * Từ khoá nhận diện thông báo thuộc nghiệp vụ nhân sự (nghỉ phép / tăng ca / chấm công).
 * Khớp với TITLE mà backend sinh ra trong `notifyRegistrationSubmitted` và `notifyApprovalChanged`.
 */
const HR_KEYWORDS = ["đơn nghỉ", "nghỉ phép", "phê duyệt", "tăng ca", "chấm công"];

export function isApproverRole(): boolean {
  const jobName = getUserData()?.JOB_NAME || "";
  return APPROVER_JOBS.includes(jobName);
}

/**
 * Suy ra route đích khi người dùng bấm vào một thông báo trong Trung tâm thông báo.
 *
 * Trả về `null` khi không đủ căn cứ ⇒ nơi gọi sẽ chỉ đánh dấu đã đọc, tránh điều hướng sai.
 */
export function resolveNotificationRoute(item: NotificationElement): string | null {
  // Ưu tiên link tường minh nếu backend/notification có gắn sẵn.
  if (item.LINK && item.LINK.startsWith("/")) {
    return item.LINK;
  }

  const text = `${item.TITLE || ""} ${item.CONTENT || ""}`.toLowerCase();
  const isHrNotification = HR_KEYWORDS.some((keyword) => text.includes(keyword));

  if (isHrNotification) {
    // Quản lý mở màn phê duyệt; nhân viên mở màn đăng ký để xem trạng thái đơn của mình.
    return isApproverRole() ? "/nhansu/pheduyetnghi" : "/nhansu/dangky";
  }

  return null;
}
