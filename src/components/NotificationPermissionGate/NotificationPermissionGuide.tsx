import { useEffect, useMemo, useState } from "react";
import { getGuide, GUIDE_TABS, type GuideTarget, type GuideStep } from "../../api/services/notificationGuideData";
import type { PlatformInfo } from "../../api/services/platformDetect";
import { FiCheck, FiInfo } from "../icons/localIconSet";
import NotificationPermissionVisual from "./NotificationPermissionVisual";

interface Props {
  platformInfo: PlatformInfo;
  /**
   * Khoá hướng dẫn theo MỘT thiết bị (ẩn thanh chuyển tab).
   * Dùng khi thiết bị hiện tại không thể tự chọn khác — ví dụ iPhone ở tab Safari
   * chỉ có thể làm theo luồng iOS.
   */
  onlyTarget?: GuideTarget;
}

/** Tab mặc định = thiết bị đang dùng, để người dùng thấy ngay hướng dẫn đúng. */
function defaultTarget(info: PlatformInfo): GuideTarget {
  if (info.device === "desktop") return "desktop";
  if (info.platform === "ios") return "ios";
  if (info.platform === "android") return "android";
  return "desktop";
}

/**
 * Khối hướng dẫn bật lại quyền thông báo: tự nhận diện thiết bị, cho phép chuyển
 * sang xem hướng dẫn của thiết bị khác (ví dụ IT hướng dẫn nhân viên qua điện thoại).
 */
export default function NotificationPermissionGuide({ platformInfo, onlyTarget }: Props) {
  const detected = useMemo(() => onlyTarget ?? defaultTarget(platformInfo), [onlyTarget, platformInfo]);
  const [target, setTarget] = useState<GuideTarget>(detected);
  const [copied, setCopied] = useState(false);

  // Đồng bộ khi prop đổi (ví dụ chỉ định thiết bị sau khi nhận diện xong).
  useEffect(() => {
    setTarget(detected);
  }, [detected]);

  const guide = useMemo(
    () => getGuide(target, platformInfo.browser, platformInfo.platform),
    [target, platformInfo.browser, platformInfo.platform]
  );

  const isIOSNotStandalone = target === "ios" && platformInfo.isIOSWebView && !onlyTarget;

  const handleCopy = async () => {
    if (!guide.settingsUrl) return;
    try {
      await navigator.clipboard.writeText(guide.settingsUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="notiPermGuide">
      <div className="notiPermGuide__detected">
        <FiInfo size={15} strokeWidth={2.4} />
        <span>
          Thiết bị đang dùng: <strong>{platformInfo.deviceLabel}</strong> ·{" "}
          {platformInfo.browserName}
        </span>
      </div>

      <div className="notiPermGuide__tabs" role="tablist" aria-label="Chọn thiết bị">
        {GUIDE_TABS.filter((tab) => !onlyTarget || tab === onlyTarget).map((tab) => {
          const label =
            tab === "desktop" ? "Máy tính" : tab === "android" ? "Android" : "iPhone / iPad";
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={target === tab}
              className={
                "notiPermGuide__tab" +
                (target === tab ? " is-active" : "") +
                (detected === tab ? " is-detected" : "")
              }
              onClick={() => setTarget(tab)}
            >
              {label}
              {detected === tab && <span className="notiPermGuide__tabDot" aria-hidden />}
            </button>
          );
        })}
      </div>

      <div className="notiPermGuide__subtitle">{guide.subtitle}</div>
      {isIOSNotStandalone && (
        <div className="notiPermGuide__warn">
          Bạn đang mở ERP bằng tab Safari. iPhone/iPad chỉ cho phép thông báo đẩy khi ERP được
          thêm vào màn hình chính — hãy làm theo bước 1 bên dưới.
        </div>
      )}

      <ol className="notiPermGuide__steps">
        {guide.deniedSteps.map((step: GuideStep, index: number) => (
          <li className="notiPermGuide__step" key={step.title}>
            <div className="notiPermGuide__stepNum">{index + 1}</div>
            <div className="notiPermGuide__stepBody">
              <div className="notiPermGuide__stepTitle">{step.title}</div>
              <div className="notiPermGuide__stepDetail">{step.detail}</div>
              {step.visual && <NotificationPermissionVisual visual={step.visual} />}
            </div>
          </li>
        ))}
      </ol>

      {guide.settingsUrl && (
        <button
          type="button"
          className="notiPermGuide__urlChip"
          onClick={() => void handleCopy()}
          title="Bấm để sao chép rồi dán vào thanh địa chỉ"
        >
          <code>{guide.settingsUrl}</code>
          <span className="notiPermGuide__copy">{copied ? <FiCheck size={14} strokeWidth={3} /> : "Sao chép"}</span>
        </button>
      )}

      <div className="notiPermGuide__footer">{guide.footerNote}</div>
    </div>
  );
}
