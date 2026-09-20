import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../../api/Api";
import { UserData } from "../../../../api/GlobalInterface";
import { SaveExcel } from "../../../../api/services/excelService";
import { checkBP } from "../../../../api/services/permissionService";
import { RootState } from "../../../../redux/store";
import { BOM_AMAZON as BOM_AMAZON_DATA, CODE_INFO, CODEPHOI, LIST_BOM_AMAZON } from "../../interfaces/rndInterface";
import { SidebarTabMode, UseBomAmazonDataReturn } from "./bomAmazonTypes";

export const useBomAmazonData = (): UseBomAmazonDataReturn => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [codephoilist, setCodePhoiList] = useState<CODEPHOI[]>([]);
  const [listamazontable, setListBomAmazonTable] = useState<LIST_BOM_AMAZON[]>([]);
  const [bomamazontable, setBOMAMAZONTable] = useState<BOM_AMAZON_DATA[]>([]);
  const [G_CODE_MAU, setG_CODE_MAU] = useState("7A07994A");
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [enableEdit, setEnableEdit] = useState(false);
  const [rows, setRows] = useState<CODE_INFO[]>([]);
  const [codeinfoCMS, setcodeinfoCMS] = useState<string>("");
  const [codeinfoKD, setcodeinfoKD] = useState<string>("");
  const [amz_country, setAMZ_COUNTRY] = useState<string>("");
  const [amz_prod_name, setAMZ_PROD_NAME] = useState<string>("");
  const [isBomExist, setIsBomExist] = useState<boolean>(false);

  // UI state
  const [sidebarTab, setSidebarTab] = useState<SidebarTabMode>("EXISTING");
  const [sidebarSearch, setSidebarSearch] = useState<string>("");
  const [quickSearchBom, setQuickSearchBom] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // LOAD CODE PHÔI
  const loadCodePhoi = useCallback(() => {
    generalQuery("loadcodephoi", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODEPHOI[] = response.data.data.map(
            (element: CODEPHOI, index: number) => ({
              ...element,
              id: index,
            })
          );
          setCodePhoiList(loadeddata);
          if (loadeddata.length > 0) {
            setG_CODE_MAU(loadeddata[0].G_CODE_MAU);
          }
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // LOAD DANH SÁCH MÃ ĐÃ CÓ BOM AMAZON
  const handleGETLISTBOMAMAZON = useCallback((G_NAME: string) => {
    setisLoading(true);
    generalQuery("listAmazon", {
      G_NAME: G_NAME,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: LIST_BOM_AMAZON[] = response.data.data.map(
            (element: LIST_BOM_AMAZON, index: number) => ({
              ...element,
              id: index.toString(),
            })
          );
          setListBomAmazonTable(loadeddata);
          setisLoading(false);
        } else {
          setListBomAmazonTable([]);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setisLoading(false);
      });
  }, []);

  // LOAD CHI TIẾT BOM AMAZON CỦA 1 MÃ ĐÃ CÓ
  const handleGETBOMAMAZON = useCallback((G_CODE: string) => {
    setisLoading(true);
    generalQuery("getBOMAMAZON", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const loadeddata: BOM_AMAZON_DATA[] = response.data.data.map(
            (element: BOM_AMAZON_DATA, index: number) => ({
              ...element,
              G_NAME:
                getAuditMode() === 0
                  ? element.G_NAME
                  : element.G_NAME?.search("CNDB") === -1
                  ? element.G_NAME
                  : "TEM_NOI_BO",
              DOITUONG_NAME2: element.DOITUONG_NAME2 ?? "",
              id: index.toString(),
            })
          );
          setAMZ_COUNTRY(loadeddata[0].AMZ_COUNTRY ?? "");
          setAMZ_PROD_NAME(loadeddata[0].AMZ_PROD_NAME ?? "");
          setBOMAMAZONTable(loadeddata);
          setcodeinfoCMS(loadeddata[0].G_CODE ?? G_CODE);
          setcodeinfoKD(loadeddata[0].G_NAME ?? "");
          setIsBomExist(true);
          setisLoading(false);
        } else {
          setBOMAMAZONTable([]);
          setIsBomExist(false);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setisLoading(false);
      });
  }, []);

  // LOAD TEMPLATE BOM PHÔI RỖNG
  const handleGETBOMAMAZONEMPTY = useCallback(
    (G_CODE: string, G_NAME: string, codeMau: string) => {
      setisLoading(true);
      generalQuery("getBOMAMAZON_EMPTY", {
        G_CODE_MAU: codeMau,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            const loadeddata: BOM_AMAZON_DATA[] = response.data.data.map(
              (element: any, index: number) => ({
                G_CODE: G_CODE,
                G_NAME: G_NAME,
                ...element,
                GIATRI: "",
                REMARK: "",
                id: index.toString(),
              })
            );
            setBOMAMAZONTable(loadeddata);
            setIsBomExist(false);
            setisLoading(false);
          } else {
            setBOMAMAZONTable([]);
            setisLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
          setisLoading(false);
        });
    },
    []
  );

  // RESET LẠI TỪ PHÔI MẪU CHO MÃ HIỆN TẠI
  const handleResetToTemplate = useCallback(() => {
    if (!codeinfoCMS) {
      Swal.fire("Thông báo", "Vui lòng chọn mã sản phẩm trước", "warning");
      return;
    }
    handleGETBOMAMAZONEMPTY(codeinfoCMS, codeinfoKD, G_CODE_MAU);
    Swal.fire("Thông báo", "Đã nạp lại cấu trúc BOM từ phôi " + G_CODE_MAU, "info");
  }, [codeinfoCMS, codeinfoKD, G_CODE_MAU, handleGETBOMAMAZONEMPTY]);

  // TRA CỨU ALL CODE
  const handleCODEINFO = useCallback(() => {
    setisLoading(true);
    generalQuery("codeinfo", {
      G_NAME: codeCMS,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODE_INFO[] = response.data.data.map(
            (element: CODE_INFO, index: number) => ({
              ...element,
              id: index,
            })
          );
          setRows(loadeddata);
          setisLoading(false);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setisLoading(false);
      });
  }, [codeCMS]);

  const handleSearchCodeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCODEINFO();
      }
    },
    [handleCODEINFO]
  );

  // CHECK TỒN TẠI BOM — KHÔNG nuốt lỗi kết nối (ném ra cho caller xử lý),
  // tránh trường hợp mất kết nối bị hiểu nhầm là "chưa tồn tại" rồi insert trùng.
  const checkExistBOMAMAZON = useCallback(async (G_CODE: string): Promise<boolean> => {
    const response = await generalQuery("checkExistBOMAMAZON", {
      G_CODE: G_CODE,
    });
    if (response.data?.tk_status !== "NG") {
      return (response.data?.data?.length ?? 0) > 0;
    }
    return false;
  }, []);

  // LƯU BOM AMAZON (INSERT HOẶC UPDATE) — tổng hợp err_code theo từng dòng
  const addBOMAMAZON = useCallback(async () => {
    if (!codeinfoCMS) return;

    // Nếu chính bước kiểm tra tồn tại lỗi (mất kết nối) thì DỪNG, không insert mù.
    let bomAmazonExist = false;
    try {
      bomAmazonExist = await checkExistBOMAMAZON(codeinfoCMS);
    } catch (error: any) {
      console.error(error);
      Swal.fire(
        "Lỗi",
        "Không kiểm tra được BOM đã tồn tại: " + (error?.message ?? "lỗi kết nối"),
        "error"
      );
      return;
    }

    const isInsert = !bomAmazonExist;

    let err_code = "";
    let successCount = 0;

    for (let i = 0; i < bomamazontable.length; i++) {
      const row = bomamazontable[i];
      const rowLabel = `DOITUONG_NO ${row.DOITUONG_NO}`;
      try {
        const response = isInsert
          ? await generalQuery("insertAmazonBOM", {
              G_CODE: codeinfoCMS,
              G_CODE_MAU: G_CODE_MAU,
              DOITUONG_NO: row.DOITUONG_NO,
              GIATRI: row.GIATRI,
              REMARK: row.REMARK,
              AMZ_PROD_NAME: amz_prod_name,
              AMZ_COUNTRY: amz_country,
            })
          : await generalQuery("updateAmazonBOM", {
              G_CODE: codeinfoCMS,
              G_CODE_MAU: row.G_CODE_MAU,
              DOITUONG_NO: row.DOITUONG_NO,
              GIATRI: row.GIATRI,
              REMARK: row.REMARK,
              AMZ_PROD_NAME: amz_prod_name,
              AMZ_COUNTRY: amz_country,
              DOITUONG_NAME2: row.DOITUONG_NAME2,
            });

        if (response.data?.tk_status === "NG") {
          err_code += `\n| ${rowLabel}: ${response.data?.message ?? "không rõ lỗi"}`;
        } else {
          successCount++;
        }
      } catch (error: any) {
        err_code += `\n| ${rowLabel}: ${error?.message ?? "lỗi kết nối"}`;
      }
    }

    handleGETLISTBOMAMAZON("");

    if (err_code !== "") {
      // Ghi một phần vẫn có ích: giữ trạng thái "đã tồn tại" nếu là update
      // hoặc đã có ít nhất 1 dòng insert thành công.
      setIsBomExist(!isInsert || successCount > 0);
      Swal.fire(
        "Lưu BOM chưa hoàn tất",
        `Đã lưu ${successCount}/${bomamazontable.length} dòng. Các dòng lỗi:${err_code}`,
        "error"
      );
    } else {
      setIsBomExist(true);
      Swal.fire(
        "Thành công",
        `Đã lưu BOM Amazon hoàn tất (${successCount} dòng)!`,
        "success"
      );
    }
  }, [
    checkExistBOMAMAZON,
    codeinfoCMS,
    bomamazontable,
    G_CODE_MAU,
    amz_prod_name,
    amz_country,
    handleGETLISTBOMAMAZON,
  ]);

  const confirmSaveBOMAMAZON = useCallback(() => {
    checkBP(userData, ["RND"], ["ALL"], ["ALL"], () => {
      Swal.fire({
        title: "Chắc chắn muốn lưu BOM AMAZON ?",
        text: `Mã sản phẩm: ${codeinfoCMS}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Vẫn lưu!",
        cancelButtonText: "Hủy bỏ",
      }).then((result) => {
        if (result.isConfirmed) {
          addBOMAMAZON();
        }
      });
    });
  }, [userData, codeinfoCMS, addBOMAMAZON]);

  // BẬT / TẮT SỬA VỚI PHÂN QUYỀN RND
  const handleToggleEdit = useCallback(() => {
    checkBP(userData, ["RND"], ["ALL"], ["ALL"], () => {
      setEnableEdit((prev) => {
        const nextState = !prev;
        Swal.fire(
          "Thông báo",
          nextState ? "Đã BẬT chế độ chỉnh sửa BOM" : "Đã TẮT chế độ chỉnh sửa (Chỉ đọc)",
          "info"
        );
        return nextState;
      });
    });
  }, [userData]);

  // CẬP NHẬT THÔNG TIN PHỤ (ẢNH / TÊN / THỊ TRƯỜNG)
  const handle_saveAMAZONCODEINFO = useCallback(async () => {
    const { value: pass1 } = await Swal.fire({
      title: "Xác nhận cập nhật thông tin phụ",
      input: "password",
      inputLabel: "Nhập mật mã xác nhận",
      inputValue: "",
      inputPlaceholder: "Mật mã",
      showCancelButton: true,
      cancelButtonText: "Hủy bỏ",
      confirmButtonText: "Xác nhận",
    });

    if (pass1 === "okema") {
      if (codeinfoCMS !== "") {
        generalQuery("updateAmazonBOMCodeInfo", {
          G_CODE: codeinfoCMS,
          AMZ_PROD_NAME: amz_prod_name,
          AMZ_COUNTRY: amz_country,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Update data thành công", "success");
            } else {
              Swal.fire("Thông báo", "Update data thất bại: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        Swal.fire("Thông báo", "Chọn code trước đã !", "error");
      }
    } else {
      Swal.fire("Thông báo", "Đã nhập sai mật mã !", "error");
    }
  }, [codeinfoCMS, amz_prod_name, amz_country]);

  // XUẤT EXCEL
  const handleExportExcel = useCallback(() => {
    if (bomamazontable.length > 0) {
      SaveExcel(bomamazontable, `BOM_AMAZON_${codeinfoCMS || "DATA"}`);
    } else {
      Swal.fire("Thông báo", "Không có dữ liệu BOM để xuất", "warning");
    }
  }, [bomamazontable, codeinfoCMS]);

  // FILTERED BOM DATA (QUICK SEARCH)
  const filteredBomData = useMemo(() => {
    if (!quickSearchBom.trim()) return bomamazontable;
    const kw = quickSearchBom.toLowerCase().trim();
    return bomamazontable.filter((row) => {
      return (
        row.G_CODE?.toLowerCase().includes(kw) ||
        row.G_NAME?.toLowerCase().includes(kw) ||
        row.DOITUONG_NO?.toLowerCase().includes(kw) ||
        row.DOITUONG_NAME?.toLowerCase().includes(kw) ||
        row.GIATRI?.toLowerCase().includes(kw) ||
        row.REMARK?.toLowerCase().includes(kw) ||
        row.DOITUONG_NAME2?.toLowerCase().includes(kw)
      );
    });
  }, [bomamazontable, quickSearchBom]);

  // FILTERED LIST BOM AMAZON (SIDEBAR SEARCH "ĐÃ CÓ BOM")
  const filteredListBomAmazon = useMemo(() => {
    if (!sidebarSearch.trim()) return listamazontable;
    const kw = sidebarSearch.toLowerCase().trim();
    return listamazontable.filter((row) => {
      return (
        row.G_CODE?.toLowerCase().includes(kw) ||
        row.G_NAME?.toLowerCase().includes(kw) ||
        row.G_NAME_KD?.toLowerCase().includes(kw)
      );
    });
  }, [listamazontable, sidebarSearch]);

  // INITIAL LOAD
  useEffect(() => {
    handleGETLISTBOMAMAZON("");
    loadCodePhoi();
  }, [handleGETLISTBOMAMAZON, loadCodePhoi]);

  return {
    codephoilist,
    listamazontable,
    filteredListBomAmazon,
    bomamazontable,
    filteredBomData,
    G_CODE_MAU,
    setG_CODE_MAU,
    isLoading,
    codeCMS,
    setCodeCMS,
    enableEdit,
    setEnableEdit,
    rows,
    codeinfoCMS,
    codeinfoKD,
    amz_country,
    setAMZ_COUNTRY,
    amz_prod_name,
    setAMZ_PROD_NAME,
    sidebarTab,
    setSidebarTab,
    sidebarSearch,
    setSidebarSearch,
    quickSearchBom,
    setQuickSearchBom,
    isSidebarOpen,
    setIsSidebarOpen,
    isInfoPanelOpen,
    setIsInfoPanelOpen,
    isFullscreen,
    toggleFullscreen,
    handleSearchCodeKeyDown,
    handleCODEINFO,
    handleGETLISTBOMAMAZON,
    handleGETBOMAMAZON,
    handleGETBOMAMAZONEMPTY,
    handleResetToTemplate,
    handleToggleEdit,
    confirmSaveBOMAMAZON,
    handle_saveAMAZONCODEINFO,
    handleExportExcel,
    isBomExist,
  };
};
