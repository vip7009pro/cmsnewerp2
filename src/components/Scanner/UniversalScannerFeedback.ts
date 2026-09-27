/**
 * Helper âm thanh bíp và rung phản hồi (Web Audio API & Vibration API)
 * Tạo âm thanh chuẩn máy quét mã công nghiệp (Honeywell / Zebra) không cần file mp3 ngoài.
 */

let sharedAudioContext: AudioContext | null = null;

export const playScannerBeep = (enabled: boolean = true): void => {
  if (!enabled || typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    if (!sharedAudioContext || sharedAudioContext.state === "closed") {
      sharedAudioContext = new AudioContextClass();
    }

    if (sharedAudioContext.state === "suspended") {
      sharedAudioContext.resume().catch(() => {});
    }

    const ctx = sharedAudioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Tần số 2400Hz - âm cao sắc nét chuẩn máy quét tem mã vạch công nghiệp
    osc.type = "sine";
    osc.frequency.setValueAtTime(2400, now);

    // Envelope âm lượng: bật ngay tức thì và fade out nhẹ sau 85ms
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (err) {
    // Tránh gián đoạn tiến trình quét nếu thiết bị chặn AudioContext
  }
};

export const triggerScannerVibration = (enabled: boolean = true): void => {
  if (!enabled || typeof window === "undefined" || !navigator.vibrate) return;

  try {
    // Xung rung ngắn 60ms cho phản hồi xúc giác tức thì
    navigator.vibrate(60);
  } catch (err) {
    // Bỏ qua nếu thiết bị không hỗ trợ rung
  }
};

export const triggerScanFeedback = (beep: boolean = true, vibrate: boolean = true): void => {
  playScannerBeep(beep);
  triggerScannerVibration(vibrate);
};
