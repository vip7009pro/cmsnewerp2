import type { GuideVisual } from "../../api/services/notificationGuideData";
import { FiBell, FiCheck } from "../icons/localIconSet";

/**
 * Minh hoạ trực quan cho từng bước hướng dẫn, vẽ HOÀN TOÀN bằng HTML/CSS.
 *
 * Lý do không dùng ảnh chụp màn hình:
 * - Giao diện Chrome/Safari/Android đổi theo phiên bản ⇒ ảnh sẽ lỗi thời.
 * - Ảnh chụp không hỗ trợ dark mode, không co giãn theo màn hình điện thoại.
 * ⇒ Dựng khung "mô phỏng" đơn giản, chỉ giữ chi tiết người dùng cần nhìn thấy.
 */
export default function NotificationPermissionVisual({ visual }: { visual: GuideVisual }) {
  switch (visual.kind) {
    case "urlbar":
      return (
        <div className="notiPermVis notiPermVis--urlbar">
          <div className="notiPermVis__callout">{visual.callout}</div>
          <div className="notiPermVis__bar">
            <span className="notiPermVis__lock" aria-hidden>
              <LockGlyph />
            </span>
            <span className="notiPermVis__url">{visual.url}</span>
            <span className="notiPermVis__dots" aria-hidden>
              ⋮
            </span>
          </div>
        </div>
      );

    case "menu":
      return (
        <div className="notiPermVis notiPermVis--menu">
          <div className="notiPermVis__anchor">{visual.anchor}</div>
          <ul className="notiPermVis__items">
            {visual.items.map((item) => (
              <li
                key={item.label}
                className={
                  "notiPermVis__item" + (item.active ? " notiPermVis__item--active" : "")
                }
              >
                <span className="notiPermVis__itemLabel">{item.label}</span>
                {item.value && <span className="notiPermVis__itemValue">{item.value}</span>}
              </li>
            ))}
          </ul>
        </div>
      );

    case "toggle":
      return (
        <div className="notiPermVis notiPermVis--toggle">
          <div className="notiPermVis__toggleText">
            <span className="notiPermVis__toggleLabel">{visual.label}</span>
            {visual.hint && <span className="notiPermVis__toggleHint">{visual.hint}</span>}
          </div>
          <div className="notiPermVis__toggleRight">
            <span className={"notiPermVis__switch" + (visual.on ? " is-on" : "")} aria-hidden>
              <span className="notiPermVis__knob" />
            </span>
            <span className="notiPermVis__stateText">{visual.stateText}</span>
          </div>
        </div>
      );

    case "settings":
      return (
        <div className="notiPermVis notiPermVis--settings">
          <div className="notiPermVis__settingsTitle">{visual.title}</div>
          <ul className="notiPermVis__rows">
            {visual.rows.map((row) => (
              <li
                key={row.label}
                className={"notiPermVis__row" + (row.active ? " notiPermVis__row--active" : "")}
              >
                {row.glyph && <span className="notiPermVis__rowGlyph">{row.glyph}</span>}
                <span className="notiPermVis__rowLabel">{row.label}</span>
                {row.value && <span className="notiPermVis__rowValue">{row.value}</span>}
              </li>
            ))}
          </ul>
        </div>
      );

    case "tiles":
      return (
        <div className="notiPermVis notiPermVis--tiles">
          <div className="notiPermVis__tilesCaption">{visual.caption}</div>
          <div className="notiPermVis__tiles">
            {visual.tiles.map((tile) => (
              <div
                key={tile.label}
                className={"notiPermVis__tile" + (tile.active ? " notiPermVis__tile--active" : "")}
              >
                <span className="notiPermVis__tileGlyph" aria-hidden>
                  {tile.glyph}
                </span>
                <span className="notiPermVis__tileLabel">{tile.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "note":
      return (
        <div className={`notiPermVis notiPermVis--note is-${visual.tone}`}>
          <span className="notiPermVis__noteIcon" aria-hidden>
            {visual.tone === "ok" ? (
              <FiCheck size={15} strokeWidth={3} />
            ) : (
              <FiBell size={15} strokeWidth={2.4} />
            )}
          </span>
          <span className="notiPermVis__noteText">{visual.text}</span>
        </div>
      );

    default:
      return null;
  }
}

/** Ổ khoá nhỏ vẽ bằng CSS (không dùng emoji để đồng nhất mọi hệ điều hành). */
function LockGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden>
      <path
        d="M7 10V7a5 5 0 0 1 10 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor" />
    </svg>
  );
}
