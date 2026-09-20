import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 768px)";

/**
 * Hook theo dõi viewport mobile (≤ 768px) theo convention chung của repo
 * (window.matchMedia + listener "change", xem `PrecisionHeader.tsx`, `UserManager.tsx`).
 *
 * Dùng để conditional rendering theo viewport: trên mobile chỉ render các khối
 * thông tin quan trọng, giảm padding và mật độ hiển thị.
 */
export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return isMobile;
}
