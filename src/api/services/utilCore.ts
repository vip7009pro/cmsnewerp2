/**
 * utilCore — các hàm tiện ích KHÔNG phụ thuộc UI, dùng bởi những module nằm trong
 * graph khởi động (`App.tsx`, `api/Api.ts`, `api/services/inventoryService.ts`).
 *
 * LÝ DO TÁCH FILE (đo được 2026-09-21):
 * `utilService.tsx` trước đây vừa chứa utils vừa import `recharts` + 6 component UI của
 * trang design_amazon (TEXT / RECTANGLE / DATAMATRIX / BARCODE2 / IMAGE / QRCODE — kéo theo
 * `jsbarcode`, `react-barcode`, `react-datamatrix-svg`, `qrcode.react`).
 * Vì `App.tsx` chỉ cần `requestFullScreen` từ file đó, TOÀN BỘ recharts + các thư viện barcode
 * bị đưa vào bundle khởi động dù màn hình đầu không dùng tới.
 *
 * ⇒ Các hàm phục vụ luồng khởi động được đặt ở đây (không import UI).
 *   `utilService.tsx` vẫn re-export để ~151 call site cũ không phải sửa.
 */
import Swal from "sweetalert2";
import type { MutableRefObject } from "react";

export const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

/** Chỉ cho phép chữ/số/gạch dưới — dùng cho validate username & password ở màn Login. */
export const isValidInput = (input: string) => {
  const regex = /^[a-zA-Z0-9_]*$/;
  return regex.test(input);
};

export const requestFullScreen = (
  elementRef: MutableRefObject<null>,
  full_screen: number
) => {
  if (elementRef.current && full_screen === 1) {
    const element = elementRef.current as HTMLElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ("mozRequestFullScreen" in element) {
      (element as any).mozRequestFullScreen();
    } else if ("webkitRequestFullscreen" in element) {
      (element as any).webkitRequestFullscreen();
    } else if ("msRequestFullscreen" in element) {
      (element as any).msRequestFullscreen();
    }
  }
};

export async function encryptData(
  publicKey: string,
  data: object
): Promise<{ encryptedData: string; encryptedKey: string; iv: string }> {
  try {
    if (!window.isSecureContext || !window.crypto || !window.crypto.subtle) {
      Swal.fire("Thống báo", "Crypto API is not available. Please use HTTPS or localhost.", "error");
      throw new Error(
        'Crypto API is not available. Please use HTTPS or localhost.'
      );
    }
    const dataString = JSON.stringify(data);
    const aesKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(dataString);
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      encodedData
    );
    const exportedKey = await crypto.subtle.exportKey("raw", aesKey);
    const publicKeyBuffer = pemToArrayBuffer(publicKey);
    const importedKey = await crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );
    const encryptedKey = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      importedKey,
      exportedKey
    );
    return {
      encryptedData: arrayBufferToBase64(encryptedData),
      encryptedKey: arrayBufferToBase64(encryptedKey),
      iv: arrayBufferToBase64(iv),
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Encryption error:", error);
    throw new Error(`Failed to encrypt data: ${errorMessage}`);
  }
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  try {
    const b64 = pem
      .replace(/-----BEGIN PUBLIC KEY-----/, "")
      .replace(/-----END PUBLIC KEY-----/, "")
      .replace(/\s/g, "");
    const binary = atob(b64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
  } catch (error: unknown) {
    throw new Error("Invalid public key format");
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
