import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import { generalQuery, getCtrCd, uploadQuery } from "../../../api/Api";
import { SaveExcel } from "../../../api/services/excelService";
import { DEPARTMENT_DATA, POST_DATA } from "../interfaces/infoInterface";
import { f_fetchPostListAll, f_getDepartmentList } from "../utils/infoUtils";

export interface DeptChartItem {
  name: string;
  code: number | string;
  value: number;
  pct: number;
}

export interface TrendChartItem {
  month: string;
  count: number;
  cumulative: number;
}

export interface AuthorChartItem {
  author: string;
  total: number;
  mediaCount: number;
  textCount: number;
}

export interface DeptMediaChartItem {
  dept: string;
  mediaCount: number;
  textCount: number;
  pinnedCount: number;
}

export const useAddInfoData = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // States danh mục & dữ liệu
  const [deptList, setDeptList] = useState<DEPARTMENT_DATA[]>([]);
  const [postList, setPostList] = useState<POST_DATA[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "studio" | "analytics" | "feed">("all");

  // Form states
  const [selectedDept, setSelectedDept] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Feed & Modal states
  const [feedSearch, setFeedSearch] = useState<string>("");
  const [viewingPost, setViewingPost] = useState<POST_DATA | null>(null);

  // Nạp danh sách phòng ban
  const loadDepartments = async () => {
    try {
      const data = await f_getDepartmentList();
      if (data && data.length > 0) {
        setDeptList(data);
        if (!selectedDept || selectedDept === 1) {
          setSelectedDept(data[0].DEPT_CODE);
        }
      }
    } catch (err) {
      console.error("Lỗi tải phòng ban:", err);
    }
  };

  // Nạp toàn bộ bài viết đã đăng
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const posts = await f_fetchPostListAll();
      setPostList(posts || []);
    } catch (err) {
      console.error("Lỗi tải danh sách bài đăng:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const initData = async () => {
    await Promise.all([loadDepartments(), loadPosts()]);
  };

  useEffect(() => {
    initData();
  }, []);

  // Xử lý chọn file ảnh và tạo Live Preview URL
  const handleFileChange = (newFile: File | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (newFile) {
      setFile(newFile);
      setPreviewUrl(URL.createObjectURL(newFile));
    } else {
      setFile(null);
      setPreviewUrl("");
    }
  };

  // Đăng bài viết mới
  const handlePublishPost = async () => {
    if (!title.trim()) {
      Swal.fire("Lưu ý", "Vui lòng nhập tiêu đề bài viết!", "warning");
      return;
    }
    if (!content.trim()) {
      Swal.fire("Lưu ý", "Vui lòng nhập nội dung bài viết!", "warning");
      return;
    }

    setIsSubmitting(true);
    const ctrCd = getCtrCd();
    const fileName = file ? `${ctrCd}_${selectedDept}_${file.name}` : "";

    const insertData = {
      DEPT_CODE: selectedDept,
      TITLE: title.trim(),
      CONTENT: content.trim(),
      FILE_NAME: fileName,
      IS_PINNED: isPinned ? "Y" : "N",
    };

    try {
      const res = await generalQuery("insert_information", insertData);
      if (res.data.tk_status !== "NG") {
        if (file) {
          try {
            await uploadQuery(file, fileName, "informationboard");
          } catch (uploadErr) {
            console.error("Lỗi upload file:", uploadErr);
          }
        }
        Swal.fire("Thành Công", "Đã đăng bài viết mới lên bảng tin nội bộ!", "success");
        // Reset form
        setTitle("");
        setContent("");
        setIsPinned(false);
        handleFileChange(null);
        // Tải lại danh sách
        await loadPosts();
      } else {
        Swal.fire("Thất Bại", res.data.message || "Không thể đăng bài viết", "error");
      }
    } catch (err: any) {
      Swal.fire("Lỗi Hệ Thống", err.message || "Đã xảy ra lỗi khi đăng bài", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Tính toán 6 chỉ số KPI Realtime
  const kpiData = useMemo(() => {
    const total = postList.length;
    const currentMonthStr = moment().format("YYYY-MM");
    const sevenDaysAgo = moment().subtract(7, "days");

    let thisMonthCount = 0;
    let mediaCount = 0;
    let pinnedCount = 0;
    let last7DaysCount = 0;
    const deptCountMap: Record<string, number> = {};
    const authorCountMap: Record<string, number> = {};

    postList.forEach((p) => {
      // Đếm bài trong tháng
      if (p.INS_DATE && p.INS_DATE.startsWith(currentMonthStr)) {
        thisMonthCount++;
      }
      // Đếm bài trong 7 ngày qua
      if (p.INS_DATE && moment(p.INS_DATE).isAfter(sevenDaysAgo)) {
        last7DaysCount++;
      }
      // Đếm bài có ảnh
      if (p.FILE_NAME && p.FILE_NAME.trim().length > 0 && !p.FILE_NAME.endsWith("_undefined")) {
        mediaCount++;
      }
      // Đếm bài ghim
      if (p.IS_PINNED === "Y" || p.IS_PINNED === "1") {
        pinnedCount++;
      }
      // Thống kê phòng ban
      const deptName = p.SUBDEPT || "Khác";
      deptCountMap[deptName] = (deptCountMap[deptName] || 0) + 1;

      // Thống kê tác giả
      const author = p.INS_EMPL || "Ẩn danh";
      authorCountMap[author] = (authorCountMap[author] || 0) + 1;
    });

    // Tìm top dept
    let topDeptName = "Chưa có";
    let topDeptCount = 0;
    Object.entries(deptCountMap).forEach(([dept, cnt]) => {
      if (cnt > topDeptCount) {
        topDeptCount = cnt;
        topDeptName = dept;
      }
    });

    // Tìm top author
    let topAuthorName = "Chưa có";
    let topAuthorCount = 0;
    Object.entries(authorCountMap).forEach(([author, cnt]) => {
      if (cnt > topAuthorCount) {
        topAuthorCount = cnt;
        topAuthorName = author;
      }
    });

    const mediaRate = total > 0 ? ((mediaCount / total) * 100).toFixed(1) : "0";

    return {
      total,
      thisMonthCount,
      mediaCount,
      mediaRate,
      pinnedCount,
      last7DaysCount,
      topDeptName,
      topDeptCount,
      topAuthorName,
      topAuthorCount,
    };
  }, [postList]);

  // 2. Biểu đồ 1: Cơ Cấu Bài Đăng Theo Phòng Ban (Donut)
  const deptChartData = useMemo<DeptChartItem[]>(() => {
    const total = postList.length;
    if (total === 0) return [];

    const map: Record<string, { code: string | number; count: number }> = {};
    postList.forEach((p) => {
      const dName = p.SUBDEPT || "Khác";
      if (!map[dName]) {
        map[dName] = { code: p.DEPT_CODE || 0, count: 0 };
      }
      map[dName].count++;
    });

    return Object.entries(map)
      .map(([name, item]) => ({
        name,
        code: item.code,
        value: item.count,
        pct: Number(((item.count / total) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [postList]);

  // 3. Biểu đồ 2: Xu Hướng Đăng Tin Theo Tháng (ComposedChart)
  const trendChartData = useMemo<TrendChartItem[]>(() => {
    if (postList.length === 0) return [];

    // Nhóm bài theo tháng YYYY-MM
    const map: Record<string, number> = {};
    postList.forEach((p) => {
      if (p.INS_DATE) {
        const m = p.INS_DATE.slice(0, 7);
        map[m] = (map[m] || 0) + 1;
      }
    });

    const sortedMonths = Object.keys(map).sort();
    // Lấy tối đa 8 tháng gần nhất
    const recentMonths = sortedMonths.slice(-8);

    let cumulative = 0;
    return recentMonths.map((m) => {
      const cnt = map[m] || 0;
      cumulative += cnt;
      return {
        month: m,
        count: cnt,
        cumulative,
      };
    });
  }, [postList]);

  // 4. Biểu đồ 3: Top Tác Giả Đóng Góp Bài Viết (BarChart)
  const topAuthorsData = useMemo<AuthorChartItem[]>(() => {
    if (postList.length === 0) return [];

    const map: Record<string, { media: number; text: number }> = {};
    postList.forEach((p) => {
      const author = p.INS_EMPL || "Ẩn danh";
      if (!map[author]) {
        map[author] = { media: 0, text: 0 };
      }
      const hasMedia = p.FILE_NAME && p.FILE_NAME.trim().length > 0 && !p.FILE_NAME.endsWith("_undefined");
      if (hasMedia) {
        map[author].media++;
      } else {
        map[author].text++;
      }
    });

    return Object.entries(map)
      .map(([author, counts]) => ({
        author,
        total: counts.media + counts.text,
        mediaCount: counts.media,
        textCount: counts.text,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [postList]);

  // 5. Biểu đồ 4: Phân Bổ Định Dạng Theo Bộ Phận (Stacked BarChart)
  const deptMediaData = useMemo<DeptMediaChartItem[]>(() => {
    if (postList.length === 0) return [];

    const map: Record<string, { media: number; text: number; pinned: number }> = {};
    postList.forEach((p) => {
      const dept = p.SUBDEPT || "Khác";
      if (!map[dept]) {
        map[dept] = { media: 0, text: 0, pinned: 0 };
      }
      const hasMedia = p.FILE_NAME && p.FILE_NAME.trim().length > 0 && !p.FILE_NAME.endsWith("_undefined");
      if (hasMedia) map[dept].media++;
      else map[dept].text++;

      if (p.IS_PINNED === "Y" || p.IS_PINNED === "1") {
        map[dept].pinned++;
      }
    });

    return Object.entries(map)
      .map(([dept, c]) => ({
        dept,
        mediaCount: c.media,
        textCount: c.text,
        pinnedCount: c.pinned,
      }))
      .sort((a, b) => (b.mediaCount + b.textCount) - (a.mediaCount + a.textCount))
      .slice(0, 8);
  }, [postList]);

  // Danh sách bài viết được lọc tìm kiếm
  const filteredFeedPosts = useMemo(() => {
    const q = feedSearch.trim().toLowerCase();
    if (!q) return postList;
    return postList.filter(
      (p) =>
        p.TITLE?.toLowerCase().includes(q) ||
        p.SUBDEPT?.toLowerCase().includes(q) ||
        p.INS_EMPL?.toLowerCase().includes(q) ||
        p.CONTENT?.toLowerCase().includes(q)
    );
  }, [postList, feedSearch]);

  // Xuất Excel
  const handleExportEX1 = () => {
    SaveExcel(filteredFeedPosts, "BaiDang_DangLoc");
  };

  const handleExportEX2 = () => {
    SaveExcel(postList, "TatCa_BaiDang_BangTin");
  };

  return {
    userData,
    deptList,
    postList,
    isLoading,
    activeTab,
    setActiveTab,
    selectedDept,
    setSelectedDept,
    title,
    setTitle,
    content,
    setContent,
    isPinned,
    setIsPinned,
    file,
    previewUrl,
    isSubmitting,
    handleFileChange,
    handlePublishPost,
    initData,
    kpiData,
    deptChartData,
    trendChartData,
    topAuthorsData,
    deptMediaData,
    feedSearch,
    setFeedSearch,
    filteredFeedPosts,
    viewingPost,
    setViewingPost,
    handleExportEX1,
    handleExportEX2,
  };
};
