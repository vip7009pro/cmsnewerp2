import { useMemo } from "react";
import { getCompany, getLagMode } from "./Api";

/**
 * Hook gây "lag" mỗi khi component render.
 * @param enabled Bật/tắt chế độ lag
 * @param durationMs Thời gian block (ms) cho mỗi lần render
 */
export function useRenderLag(enabled: boolean = true, durationMs: number = 200) {
  useMemo(() => {
    if (!enabled) return;

    const start = performance.now();
    // Block vòng lặp cho tới khi đủ duration
    if(getCompany() === "CMS" && getLagMode()){
    while (performance.now() - start < durationMs) {
      // bận CPU
    }}
  }, [enabled, durationMs]);
}
