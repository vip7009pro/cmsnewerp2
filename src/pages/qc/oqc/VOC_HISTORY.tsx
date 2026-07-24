import { Button, Checkbox, FormControlLabel } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { uploadQuery } from "../../../api/Api";
import { RootState } from "../../../redux/store";
import { f_checkG_CODE_From_PROCESS_LOT_NO, f_loadQTRData } from "../utils/qcUtils";
import { QTR_DATA } from "./QTR_DATA";
import "./VOC_HISTORY.scss";

const VOC_VISIBLE_LIMIT = 6;
const VOC_DEFAULT_FROM_DATE = "2020-01-01";
const VOC_IMAGE_CACHE = new Map<string, string | null>();

const getCacheKey = (managementNumber: string, preferredExt?: string, version?: number) => {
  return `${(managementNumber ?? "").trim()}|${preferredExt ?? ""}|${version ?? 0}`;
};

const normalizeImageExtension = (fileName: string, mimeType?: string) => {
  const rawExtension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (rawExtension === "jpeg") {
    return "jpg";
  }
  if (rawExtension === "jpg" || rawExtension === "png") {
    return rawExtension;
  }
  if (mimeType === "image/png") {
    return "png";
  }
  return "jpg";
};

const buildImageCandidates = (managementNumber: string, preferredExt?: string, version?: number) => {
  const normalized = (managementNumber ?? "").trim();
  if (!normalized) {
    return ["/SAMPLE.png"];
  }
  const cacheBust = version ? `?v=${version}` : "";
  const preferredCandidates = preferredExt
    ? [`/qtrimage/${normalized}.${preferredExt}${cacheBust}`]
    : [];
  return [
    ...preferredCandidates,
    `/qtrimage/${normalized}.jpg${cacheBust}`,
    `/qtrimage/${normalized}.png${cacheBust}`,
    `/qtrimage/${normalized.toUpperCase()}.jpg${cacheBust}`,
    `/qtrimage/${normalized.toUpperCase()}.png${cacheBust}`,
  ];
};

const probeImage = (src: string) =>
  new Promise<string>((resolve, reject) => {
    const probe = new Image();
    probe.onload = () => resolve(src);
    probe.onerror = () => reject(new Error(`Image not found: ${src}`));
    probe.src = src;
  });

const resolveVocImage = async (managementNumber: string, preferredExt?: string, version?: number) => {
  const cacheKey = getCacheKey(managementNumber, preferredExt, version);
  if (VOC_IMAGE_CACHE.has(cacheKey)) {
    return VOC_IMAGE_CACHE.get(cacheKey) ?? null;
  }

  const candidates = buildImageCandidates(managementNumber, preferredExt, version);
  const resolved = await Promise.any(candidates.map((candidate) => probeImage(candidate))).catch(() => null);
  VOC_IMAGE_CACHE.set(cacheKey, resolved);
  return resolved;
};

const VOCHistoryCard = ({ item }: { item: QTR_DATA }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageClickCountRef = useRef(0);
  const imageClickTimerRef = useRef<number | null>(null);
  const [imageVersion, setImageVersion] = useState(0);
  const [preferredExt, setPreferredExt] = useState<string | undefined>(undefined);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isResolvingImage, setIsResolvingImage] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const clickUploadFile = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setPreferredExt(undefined);
    setImageFailed(false);
    setIsUploading(false);
    setImageVersion(0);
    setImageSrc(null);
    setIsResolvingImage(true);
  }, [item.MANAGEMENT_NUMBER]);

  useEffect(() => {
    let cancelled = false;
    setIsResolvingImage(true);
    setImageFailed(false);
    setImageSrc(null);

    void resolveVocImage(item.MANAGEMENT_NUMBER, preferredExt, imageVersion)
      .then((resolvedSrc) => {
        if (cancelled) {
          return;
        }
        if (resolvedSrc) {
          setImageSrc(resolvedSrc);
          setImageFailed(false);
        } else {
          setImageFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setImageFailed(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsResolvingImage(false);
        }
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
    if (!selectedFile) {
      return;
    }
    const normalizedExt = normalizeImageExtension(selectedFile.name, selectedFile.type);
    const filename = `${item.MANAGEMENT_NUMBER}.${normalizedExt}`;
    setIsUploading(true);
    try {
      const response = await uploadQuery(selectedFile, filename, "qtrimage");
      if (response.data.tk_status !== "NG") {
        setPreferredExt(normalizedExt);
        setImageVersion((prev) => prev + 1);
        setImageSrc(null);
        setImageFailed(false);
        setIsResolvingImage(true);
        setTimeout(() => {
          void resolveVocImage(item.MANAGEMENT_NUMBER, normalizedExt, imageVersion + 1)
            .then((resolvedSrc) => {
              if (resolvedSrc) {
                setImageSrc(resolvedSrc);
                setImageFailed(false);
              } else {
                setImageFailed(true);
              }
            })
            .finally(() => {
              setIsResolvingImage(false);
            });
        }, 0);
        Swal.fire("Thông báo", "Upload ảnh VOC thành công", "success");
      } else {
        Swal.fire("Thông báo", "Upload ảnh thất bại: " + response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Thông báo", "Upload ảnh thất bại", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const rateText = Number.isFinite(Number(item.DEFECT_RATE))
    ? Number(item.DEFECT_RATE).toLocaleString("en-US", {
      style: "decimal",
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    })
    : "0.0";

  return (
    <article className="voc-history-card">
      <div
        className="voc-history-card__imagewrap"
        onClick={() => {
          imageClickCountRef.current += 1;
          if (imageClickTimerRef.current) {
            window.clearTimeout(imageClickTimerRef.current);
          }
          imageClickTimerRef.current = window.setTimeout(() => {
            imageClickCountRef.current = 0;
          }, 420);
          if (imageClickCountRef.current >= 3) {
            imageClickCountRef.current = 0;
            if (imageClickTimerRef.current) {
              window.clearTimeout(imageClickTimerRef.current);
            }
            clickUploadFile();
          }
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.MANAGEMENT_NUMBER}
            className="voc-history-card__image"
          />
        ) : isResolvingImage ? (
          <div className="voc-history-card__missing voc-history-card__missing--loading">
            <div className="voc-history-card__missing-title">Đang tải ảnh VOC...</div>
            <div className="voc-history-card__missing-subtitle">Kiểm tra ảnh chạy nền, không chặn giao diện.</div>
          </div>
        ) : (
          <div className="voc-history-card__missing">
            <div className="voc-history-card__missing-title">Ảnh VOC chưa tồn tại</div>
            <div className="voc-history-card__missing-subtitle">Hãy upload ảnh theo tên {item.MANAGEMENT_NUMBER}.jpg hoặc .png</div>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={(e) => {
                e.stopPropagation();
                clickUploadFile();
              }}
              disabled={isUploading}
            >
              {isUploading ? "Đang upload..." : "Upload ảnh"}
            </Button>
          </div>
        )}
        <div className="voc-history-card__badge">{item.MANAGEMENT_NUMBER}</div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="voc-history-card__fileinput"
          onChange={handleUploadImage}
        />
      </div>
      <div className="voc-history-card__body">
        <div className="voc-history-card__left-col">
          <div className="voc-history-card__left-row">
            <span className="meta-date">{item.REGISTERED_DATE}</span>
            <span className="meta-plant">{item.PLANT}</span>
          </div>
          <div className="voc-history-card__left-row">
            <span className="meta-partcode">{item.PART_CODE || item.G_CODE}</span>
            <span className="meta-defect">DEFECT: {item.DEFECT_QTY?.toLocaleString("en-US")} EA</span>
          </div>
        </div>
        <div className="voc-history-card__right-col">
          <span className="voc-history-card__defect-desc">{item.DEFECT_DETAILS || item.TITLE || "N/A"}</span>
        </div>
      </div>
    </article>
  );
};

const VOC_HISTORY = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [appliedSearchValue, setAppliedSearchValue] = useState("");
  const [useMachineScan, setUseMachineScan] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [allVocData, setAllVocData] = useState<QTR_DATA[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const focusSearchInput = () => {
    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select?.();
    });
  };

  const loadVocHistoryData = async () => {
    setIsLoading(true);
    const loadedData = await f_loadQTRData({
      FROM_DATE: VOC_DEFAULT_FROM_DATE,
      TO_DATE: moment().format("YYYY-MM-DD"),
    });
    const sortedData = [...loadedData].sort((left, right) => {
      const rightTime = moment(right.REGISTERED_DATE, "YYYY-MM-DD", true).valueOf();
      const leftTime = moment(left.REGISTERED_DATE, "YYYY-MM-DD", true).valueOf();
      return rightTime - leftTime;
    });
    setAllVocData(sortedData);
    setIsLoading(false);
    if (sortedData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu VOC trong khoảng thời gian này", "info");
    }
  };

  useEffect(() => {
    void loadVocHistoryData();
    focusSearchInput();
  }, []);

  const commitSearch = async () => {
    const rawInput = searchInputValue.trim();
    if (!rawInput) {
      focusSearchInput();
      return;
    }

    let targetSearchTerm = rawInput;

    if (useMachineScan) {
      setIsLoading(true);
      try {
        const fetchedGNameKd = await f_checkG_CODE_From_PROCESS_LOT_NO(rawInput);
        if (!fetchedGNameKd) {
          Swal.fire({
            title: "Thông báo",
            text: `Không tìm thấy G_NAME_KD từ PROCESS_LOT_NO "${rawInput}"`,
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
          });
          focusSearchInput();
          setIsLoading(false);
          return;
        }
        targetSearchTerm = fetchedGNameKd;
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Thông báo",
          text: "Lỗi khi gọi API truy vấn G_NAME_KD",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
        });
        focusSearchInput();
        setIsLoading(false);
        return;
      } finally {
        setIsLoading(false);
      }
    }

    const normalizedQuery = targetSearchTerm.toLowerCase();
    const matchedData = allVocData.filter((item) => {
      const searchableFields = [
        item.MANAGEMENT_NUMBER,
        item.PART_CODE,
        item.PART_NAME,
        item.G_CODE,
        item.G_NAME,
        item.TITLE,
        item.PROJECT,
        item.BASIC_MODEL,
        item.MAIN_CATEGORY,
      ];
      return searchableFields.some((field) => (field ?? "").toString().toLowerCase().includes(normalizedQuery));
    });

    if (matchedData.length === 0) {
      const errorMsg = useMachineScan
        ? `Không tìm thấy VOC phù hợp với G_NAME_KD "${targetSearchTerm}" (scanned: "${rawInput}")`
        : `Không tìm thấy VOC phù hợp với "${targetSearchTerm}"`;
      Swal.fire({
        title: "Thông báo",
        text: errorMsg,
        icon: "info",
        ...(useMachineScan ? { timer: 3000, timerProgressBar: true } : {}),
      });
      focusSearchInput();
      return;
    }

    setAppliedSearchValue(normalizedQuery);
    setSearchInputValue("");
    window.requestAnimationFrame(() => {
      focusSearchInput();
    });
  };

  const normalizedAppliedSearch = appliedSearchValue.trim().toLowerCase();

  const visibleData = useMemo(() => {
    if (!normalizedAppliedSearch) {
      if (showAll) {
        return allVocData;
      }
      return allVocData.slice(0, VOC_VISIBLE_LIMIT);
    }
    return allVocData.filter((item) => {
      const searchableFields = [
        item.MANAGEMENT_NUMBER,
        item.PART_CODE,
        item.PART_NAME,
        item.G_CODE,
        item.G_NAME,
        item.TITLE,
        item.PROJECT,
        item.BASIC_MODEL,
        item.MAIN_CATEGORY,
      ];
      return searchableFields.some((field) => (field ?? "").toString().toLowerCase().includes(normalizedAppliedSearch));
    });
  }, [allVocData, normalizedAppliedSearch, showAll]);

  const isSearchMode = normalizedAppliedSearch.length > 0;

  return (
    <div
      className="voc-history"
      style={{
        backgroundImage: theme.CMS.backgroundImage,
        position: fullScreen ? "fixed" : "relative",
        top: fullScreen ? 0 : 0,
        left: fullScreen ? 0 : 0,
        width: fullScreen ? "100vw" : "100%",
        height: fullScreen ? "100vh" : "auto",
        zIndex: fullScreen ? 99999 : 9,
      }}
    >
      <div className="voc-history__toolbar">
        <div className="voc-history__titleblock">
          <div className="voc-history__title">VOC History</div>
          <div className="voc-history__subtitle">
            {isSearchMode
              ? `Đang lọc theo "${appliedSearchValue.trim()}" - ${visibleData.length} kết quả`
              : `Hiển thị ${Math.min(VOC_VISIBLE_LIMIT, allVocData.length)} VOC mới nhất từ ${VOC_DEFAULT_FROM_DATE} đến ${moment().format("YYYY-MM-DD")}`}
          </div>
        </div>
        <div className="voc-history__actions">
          <FormControlLabel
            className="voc-history__scanmode"
            control={
              <Checkbox
                checked={useMachineScan}
                onChange={(e) => {
                  setUseMachineScan(e.target.checked);
                  focusSearchInput();
                }}
              />
            }
            label="Dùng máy scan"
          />
          <label className="voc-history__search">
            <span>Tìm kiếm sản phẩm</span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Nhập tên hoặc mã sản phẩm"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void commitSearch();
                }
              }}
            />
          </label>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={async () => {
              await loadVocHistoryData();
              if (appliedSearchValue.trim()) {
                window.requestAnimationFrame(() => {
                  focusSearchInput();
                });
              } else {
                focusSearchInput();
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? "Đang tải..." : "Reload"}
          </Button>
          <FormControlLabel
            className="voc-history__showall"
            control={
              <Checkbox
                checked={showAll}
                onChange={(e) => {
                  setShowAll(e.target.checked);
                  focusSearchInput();
                }}
              />
            }
            label="Show all"
          />
          <FormControlLabel
            className="voc-history__fullscreen"
            control={
              <Checkbox
                checked={fullScreen}
                onChange={(e) => {
                  setFullScreen(e.target.checked);
                  focusSearchInput();
                }}
              />
            }
            label="Full Screen"
          />
        </div>
      </div>

      <div className="voc-history__content">
        {visibleData.length > 0 ? (
          <div className="voc-history__grid">
            {visibleData.map((item) => (
              <VOCHistoryCard key={item.MANAGEMENT_NUMBER + item.REGISTERED_DATE} item={item} />
            ))}
          </div>
        ) : (
          <div className="voc-history__empty">Không có VOC phù hợp với bộ lọc hiện tại.</div>
        )}
      </div>
    </div>
  );
};

export default VOC_HISTORY;