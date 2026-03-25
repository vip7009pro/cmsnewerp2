import Swal from "sweetalert2";

/**
 * File download service - extracted from GlobalFunction.tsx
 */
export const f_downloadFile2 = async (
  fileURL: string,
  fileName: string,
  onProgress: (percentage: number) => void
) => {
  try {
    const response = await fetch(fileURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "no-cache",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to download file");
    }
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader");
    }
    const contentLength = Number(response.headers.get("Content-Length")) || 0;
    let receivedLength = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        receivedLength += value.length;
        if (contentLength > 0) {
          const percentage = Math.round((receivedLength * 100) / contentLength);
          onProgress(percentage);
        }
      }
    }
    const blob = new Blob(chunks as BlobPart[]);
    const tempUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = tempUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(tempUrl);
    document.body.removeChild(a);
    onProgress(0);
  } catch (error) {
    console.error("Error downloading file:", error);
    Swal.fire("Thống báo", "Download file thất bại !", "error");
    onProgress(0);
  }
};

export const f_downloadFile = async (fileURL: string, fileName: string) => {
  try {
    const response = await fetch(fileURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to download file");
    }
    const blob = await response.blob();
    const tempUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = tempUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(tempUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
    Swal.fire("Thống báo", "Download file thất bại !", "error");
  }
};
