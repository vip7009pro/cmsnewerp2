import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import { SaveExcel } from "../../../api/services/excelService";
import { POST_DATA } from "../interfaces/infoInterface";
import { f_deletePostData, f_fetchPostListAll, f_updatePostData } from "../utils/infoUtils";

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

export const usePostManagerData = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // States bộ lọc ngày & alltime
  const [fromdate, setFromDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [alltime, setAllTime] = useState<boolean>(true);

  // States phân hệ tab & UI
  const [activeTab, setActiveTab] = useState<"all" | "table" | "analytics">("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [viewingPost, setViewingPost] = useState<POST_DATA | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Dữ liệu posts
  const [postList, setPostList] = useState<POST_DATA[]>([]);
  const selectedPostList = useRef<POST_DATA[]>([]);

  // Tải danh sách bài viết từ backend
  const fetchPostList = async () => {
    setIsLoading(true);
    try {
      const kq = await f_fetchPostListAll();
      if (kq && kq.length > 0) {
        Swal.fire("Thông báo", `Đã tải ${kq.length} bài viết`, "success");
      } else {
        Swal.fire("Thông báo", "Không có dữ liệu bài viết", "info");
      }
      setPostList(kq || []);
    } catch (err: any) {
      console.error("Lỗi fetch bài viết:", err);
      Swal.fire("Lỗi", "Không thể tải danh sách bài viết", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật bài viết
  const updatePost = async () => {
    if (selectedPostList.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng bài viết để cập nhật!", "warning");
      return;
    }

    const currentEmpl = userData?.EMPL_NO;
    let successCount = 0;
    for (let i = 0; i < selectedPostList.current.length; i++) {
      const p = selectedPostList.current[i];
      if (currentEmpl === p.INS_EMPL || userData?.SUBDEPT === "IT" || userData?.ROLE === "ADMIN") {
        await f_updatePostData(p);
        successCount++;
      } else {
        Swal.fire("Từ chối", `Bạn không có quyền cập nhật bài viết ID ${p.POST_ID} của ${p.INS_EMPL}`, "error");
      }
    }

    if (successCount > 0) {
      await fetchPostList();
      Swal.fire("Thông báo", `Đã cập nhật thành công ${successCount} bài viết`, "success");
    }
  };

  // Xóa bài viết
  const deletePost = async () => {
    if (selectedPostList.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng bài viết để xóa!", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc muốn xóa ${selectedPostList.current.length} bài viết đã chọn?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    const currentEmpl = userData?.EMPL_NO;
    let deletedCount = 0;

    for (let i = 0; i < selectedPostList.current.length; i++) {
      const p = selectedPostList.current[i];
      if (currentEmpl === p.INS_EMPL || userData?.SUBDEPT === "IT" || userData?.ROLE === "ADMIN") {
        await f_deletePostData(p);
        deletedCount++;
      } else {
        Swal.fire("Từ chối", `Bạn không có quyền xóa bài viết ID ${p.POST_ID} của ${p.INS_EMPL}`, "error");
      }
    }

    if (deletedCount > 0) {
      await fetchPostList();
      Swal.fire("Thông báo", `Đã xóa thành công ${deletedCount} bài viết`, "success");
    }
  };

  useEffect(() => {
    fetchPostList();
  }, []);

  // Lọc bài viết theo ngày tháng (nếu không chọn All Time)
  const dateFilteredPosts = useMemo(() => {
    if (alltime) return postList;
    const start = moment(fromdate, "YYYY-MM-DD").startOf("day");
    const end = moment(todate, "YYYY-MM-DD").endOf("day");

    return postList.filter((p) => {
      if (!p.INS_DATE) return false;
      const m = moment(p.INS_DATE);
      return m.isBetween(start, end, undefined, "[]");
    });
  }, [postList, alltime, fromdate, todate]);

  // Lọc nhanh theo từ khóa Search
  const filteredPosts = useMemo(() => {
    const q = searchKeyword.trim().toLowerCase();
    if (!q) return dateFilteredPosts;

    return dateFilteredPosts.filter((p) => {
      const id = String(p.POST_ID || "").toLowerCase();
      const title = (p.TITLE || "").toLowerCase();
      const content = (p.CONTENT || "").toLowerCase();
      const dept = (p.SUBDEPT || "").toLowerCase();
      const author = (p.INS_EMPL || "").toLowerCase();
      return (
        id.includes(q) ||
        title.includes(q) ||
        content.includes(q) ||
        dept.includes(q) ||
        author.includes(q)
      );
    });
  }, [dateFilteredPosts, searchKeyword]);

  // 1. Tính toán 6 chỉ số KPI Realtime
  const kpiData = useMemo(() => {
    const total = dateFilteredPosts.length;
    const currentMonthStr = moment().format("YYYY-MM");
    const sevenDaysAgo = moment().subtract(7, "days");

    let thisMonthCount = 0;
    let mediaCount = 0;
    let pinnedCount = 0;
    let last7DaysCount = 0;
    const deptCountMap: Record<string, number> = {};
    const authorCountMap: Record<string, number> = {};

    dateFilteredPosts.forEach((p) => {
      if (p.INS_DATE && p.INS_DATE.startsWith(currentMonthStr)) {
        thisMonthCount++;
      }
      if (p.INS_DATE && moment(p.INS_DATE).isAfter(sevenDaysAgo)) {
        last7DaysCount++;
      }
      if (p.FILE_NAME && p.FILE_NAME.trim().length > 0 && !p.FILE_NAME.endsWith("_undefined")) {
        mediaCount++;
      }
      if (p.IS_PINNED === "Y" || p.IS_PINNED === "1") {
        pinnedCount++;
      }
      const deptName = p.SUBDEPT || "Khác";
      deptCountMap[deptName] = (deptCountMap[deptName] || 0) + 1;
      const authorName = p.INS_EMPL || "Admin";
      authorCountMap[authorName] = (authorCountMap[authorName] || 0) + 1;
    });

    let topDeptName = "Chưa có";
    let topDeptCount = 0;
    Object.entries(deptCountMap).forEach(([dept, count]) => {
      if (count > topDeptCount) {
        topDeptCount = count;
        topDeptName = dept;
      }
    });

    let topAuthorName = "Chưa có";
    let topAuthorCount = 0;
    Object.entries(authorCountMap).forEach(([author, count]) => {
      if (count > topAuthorCount) {
        topAuthorCount = count;
        topAuthorName = author;
      }
    });

    const mediaRate = total > 0 ? ((mediaCount / total) * 100).toFixed(1) : "0.0";

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
  }, [dateFilteredPosts]);

  // 2. Biểu đồ 1: Cơ Cấu Bài Viết Theo Phòng Ban
  const deptChartData: DeptChartItem[] = useMemo(() => {
    const total = dateFilteredPosts.length;
    if (total === 0) return [];

    const map: Record<string, number> = {};
    dateFilteredPosts.forEach((p) => {
      const dept = p.SUBDEPT || "Khác";
      map[dept] = (map[dept] || 0) + 1;
    });

    return Object.entries(map)
      .map(([name, value], idx) => ({
        name,
        code: idx,
        value,
        pct: Number(((value / total) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [dateFilteredPosts]);

  // 3. Biểu đồ 2: Xu Hướng Phát Hành Theo Tháng
  const trendChartData: TrendChartItem[] = useMemo(() => {
    if (dateFilteredPosts.length === 0) return [];

    const monthMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const m = moment().subtract(i, "months").format("YYYY-MM");
      monthMap[m] = 0;
    }

    dateFilteredPosts.forEach((p) => {
      if (p.INS_DATE) {
        const m = p.INS_DATE.slice(0, 7);
        if (monthMap[m] !== undefined) {
          monthMap[m]++;
        }
      }
    });

    let cumulative = 0;
    return Object.entries(monthMap).map(([month, count]) => {
      cumulative += count;
      return {
        month: moment(month, "YYYY-MM").format("MM/YY"),
        count,
        cumulative,
      };
    });
  }, [dateFilteredPosts]);

  // 4. Biểu đồ 3: Top Tác Giả Đóng Góp
  const topAuthorsData: AuthorChartItem[] = useMemo(() => {
    const map: Record<string, { total: number; media: number; text: number }> = {};

    dateFilteredPosts.forEach((p) => {
      const author = p.INS_EMPL || "Admin";
      if (!map[author]) {
        map[author] = { total: 0, media: 0, text: 0 };
      }
      map[author].total++;
      const hasMedia = p.FILE_NAME && p.FILE_NAME.trim().length > 0 && !p.FILE_NAME.endsWith("_undefined");
      if (hasMedia) {
        map[author].media++;
      } else {
        map[author].text++;
      }
    });

    return Object.entries(map)
      .map(([author, val]) => ({
        author,
        total: val.total,
        mediaCount: val.media,
        textCount: val.text,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [dateFilteredPosts]);

  // 5. Biểu đồ 4: Phân Bổ Định Dạng Theo Phòng Ban
  const deptMediaData: DeptMediaChartItem[] = useMemo(() => {
    const map: Record<string, { media: number; text: number; pinned: number }> = {};

    dateFilteredPosts.forEach((p) => {
      const dept = p.SUBDEPT || "Khác";
      if (!map[dept]) {
        map[dept] = { media: 0, text: 0, pinned: 0 };
      }
      const hasMedia = p.FILE_NAME && p.FILE_NAME.trim().length > 0 && !p.FILE_NAME.endsWith("_undefined");
      if (hasMedia) map[dept].media++;
      else map[dept].text++;
      if (p.IS_PINNED === "Y" || p.IS_PINNED === "1") map[dept].pinned++;
    });

    return Object.entries(map)
      .map(([dept, val]) => ({
        dept,
        mediaCount: val.media,
        textCount: val.text,
        pinnedCount: val.pinned,
      }))
      .sort((a, b) => (b.mediaCount + b.textCount) - (a.mediaCount + a.textCount))
      .slice(0, 7);
  }, [dateFilteredPosts]);

  // Xuất Excel EX1 (Đang lọc) & EX2 (Toàn bộ)
  const handleExportEX1 = () => {
    SaveExcel(filteredPosts, `BangTin_DangLoc_${moment().format("YYYYMMDD_HHmm")}`);
  };

  const handleExportEX2 = () => {
    SaveExcel(postList, `BangTin_TatCa_${moment().format("YYYYMMDD_HHmm")}`);
  };

  return {
    userData,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    alltime,
    setAllTime,
    activeTab,
    setActiveTab,
    showAddModal,
    setShowAddModal,
    viewingPost,
    setViewingPost,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    postList,
    selectedPostList,
    filteredPosts,
    fetchPostList,
    updatePost,
    deletePost,
    kpiData,
    deptChartData,
    trendChartData,
    topAuthorsData,
    deptMediaData,
    handleExportEX1,
    handleExportEX2,
  };
};
