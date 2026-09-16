import React, { useRef, useState, useEffect, ChangeEvent } from "react";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Swal from "sweetalert2";
import { uploadQuery } from "../../../../api/Api";
import { QTR_DATA } from "../QTR_DATA";
import { normalizeImageExtension, resolveVocImage } from "./vocImageHelpers";

interface Props {
  item: QTR_DATA;
}

export const PrecisionVOCHistoryCard: React.FC<Props> = ({ item }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageClickCountRef = useRef(0);
  const imageClickTimerRef = useRef<number | null>(null);
  const [imageVersion, setImageVersion] = useState(0);
  const [preferredExt, setPreferredExt] = useState<string | undefined>(undefined);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isResolvingImage, setIsResolvingImage] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const clickUploadFile = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setPreferredExt(undefined);
    setIsUploading(false);
    setImageVersion(0);
    setImageSrc(null);
    setIsResolvingImage(true);
  }, [item.MANAGEMENT_NUMBER]);

  useEffect(() => {
    let cancelled = false;
    setIsResolvingImage(true);
    setImageSrc(null);

    void resolveVocImage(item.MANAGEMENT_NUMBER, preferredExt, imageVersion)
      .then((resolvedSrc) => {
        if (cancelled) return;
        setImageSrc(resolvedSrc);
      })
      .catch(() => {
        if (!cancelled) setImageSrc(null);
      })
      .finally(() => {
        if (!cancelled) setIsResolvingImage(false);
      });

    return () => {
      cancelled = true;
    };
  }, [imageVersion, item.MANAGEMENT_NUMBER, preferredExt]);

  useEffect(() => {
    return () => {
      if (imageClickTimerRef.current) {
        window.clearTimeout(imageClickTimerRef.current);
      }
    };
  }, []);

  const handleUploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";
    if (!selectedFile) return;

    const normalizedExt = normalizeImageExtension(selectedFile.name, selectedFile.type);
    const filename = `${item.MANAGEMENT_NUMBER}.${normalizedExt}`;
    setIsUploading(true);

    try {
      const response = await uploadQuery(selectedFile, filename, "qtrimage");
      if (response.data.tk_status !== "NG") {
        setPreferredExt(normalizedExt);
        setImageVersion((prev) => prev + 1);
        setImageSrc(null);
        setIsResolvingImage(true);

        setTimeout(() => {
          void resolveVocImage(item.MANAGEMENT_NUMBER, normalizedExt, imageVersion + 1)
            .then((resolvedSrc) => {
              if (resolvedSrc) setImageSrc(resolvedSrc);
            })
            .finally(() => {
              setIsResolvingImage(false);
            });
        }, 50);

        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: `Đã tải lên ảnh VOC [${item.MANAGEMENT_NUMBER}]`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi tải ảnh",
          text: response.data.message || "Tải ảnh thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi hệ thống",
        text: "Không thể kết nối đến máy chủ upload ảnh",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = () => {
    imageClickCountRef.current += 1;
    if (imageClickTimerRef.current) {
      window.clearTimeout(imageClickTimerRef.current);
    }
    imageClickTimerRef.current = window.setTimeout(() => {
      imageClickCountRef.current = 0;
    }, 400);

    if (imageClickCountRef.current >= 3) {
      imageClickCountRef.current = 0;
      if (imageClickTimerRef.current) {
        window.clearTimeout(imageClickTimerRef.current);
      }
      clickUploadFile();
    }
  };

  return (
    <article className="pvoc-card">
      {/* 16:9 Image Area */}
      <div className="pvoc-card__imagewrap" onClick={handleImageClick} title="Nhấn 3 lần để tải lên / đổi ảnh">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.MANAGEMENT_NUMBER}
            className="pvoc-card__image"
            loading="lazy"
          />
        ) : isResolvingImage ? (
          <div className="pvoc-card__missing">
            <div className="pvoc-card__missing-title">Đang dò tìm ảnh VOC...</div>
            <div className="pvoc-card__missing-subtitle">Kiểm tra bộ đệm & tệp ảnh nền</div>
          </div>
        ) : (
          <div className="pvoc-card__missing">
            <ImageNotSupportedIcon className="pvoc-card__missing-icon" />
            <div className="pvoc-card__missing-title">Chưa có ảnh sự cố VOC</div>
            <div className="pvoc-card__missing-subtitle">
              Tên file chuẩn: {item.MANAGEMENT_NUMBER}.jpg / .png
            </div>
            <Button
              variant="contained"
              size="small"
              startIcon={<CloudUploadIcon />}
              onClick={(e) => {
                e.stopPropagation();
                clickUploadFile();
              }}
              disabled={isUploading}
              style={{
                marginTop: 6,
                backgroundColor: "#7c3aed",
                fontSize: "0.72rem",
                textTransform: "none",
              }}
            >
              {isUploading ? "Đang tải..." : "Tải ảnh lên"}
            </Button>
          </div>
        )}

        {/* Top Badges */}
        <div className="pvoc-card__badge-mng">{item.MANAGEMENT_NUMBER}</div>
        {item.PLANT && <div className="pvoc-card__badge-plant">{item.PLANT}</div>}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="pvoc-card__fileinput"
          onChange={handleUploadImage}
        />
      </div>

      {/* Card Details Body */}
      <div className="pvoc-card__body">
        <div className="pvoc-card__row-header">
          <span className="pvoc-card__partcode" title={item.PART_CODE || item.G_CODE}>
            {item.PART_CODE || item.G_CODE || "CHƯA RÕ MÃ"}
          </span>
          <span className="pvoc-card__date">{item.REGISTERED_DATE}</span>
        </div>

        <div className="pvoc-card__row-details">
          <span className="text-slate-500 font-semibold truncate max-w-[200px]" title={item.G_NAME || item.PART_NAME}>
            {item.G_NAME || item.PART_NAME || item.PROJECT || "Dự án N/A"}
          </span>
          <span className="pvoc-card__defect-qty">
            {(item.DEFECT_QTY ?? 0).toLocaleString()} EA
          </span>
        </div>

        <div className="pvoc-card__defect-desc" title={item.DEFECT_DETAILS || item.TITLE}>
          {item.DEFECT_DETAILS || item.TITLE || "Chưa có mô tả chi tiết lỗi phát sinh."}
        </div>
      </div>
    </article>
  );
};
