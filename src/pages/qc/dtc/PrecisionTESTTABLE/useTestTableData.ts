import { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { DTC_TEST_POINT, TestListTable } from "../../interfaces/qcInterface";
import {
  f_addTestItem,
  f_addTestPoint,
  f_loadDTC_TestList,
  f_loadDTC_TestPointList,
} from "../../utils/qcUtils";
import { SaveExcel } from "../../../../api/services/excelService";

export const useTestTableData = () => {
  const [testList, setTestList] = useState<TestListTable[]>([]);
  const [testPointList, setTestPointList] = useState<DTC_TEST_POINT[]>([]);
  const [selectedTestItem, setSelectedTestItem] = useState<TestListTable | null>(null);

  const [itemSearch, setItemSearch] = useState<string>("");
  const [pointSearch, setPointSearch] = useState<string>("");

  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [loadingPoints, setLoadingPoints] = useState<boolean>(false);

  const [openAddItemModal, setOpenAddItemModal] = useState<boolean>(false);
  const [openAddPointModal, setOpenAddPointModal] = useState<boolean>(false);

  // Tải danh sách Hạng Mục Test
  const loadTestList = useCallback(async () => {
    setLoadingItems(true);
    try {
      const data = await f_loadDTC_TestList();
      setTestList(data || []);
      // Nếu chưa chọn item nào hoặc item cũ không còn trong list, chọn item đầu tiên
      if (data && data.length > 0) {
        setSelectedTestItem((prev) => {
          if (!prev) return data[0];
          const exists = data.find((d) => d.TEST_CODE === prev.TEST_CODE);
          return exists || data[0];
        });
      } else {
        setSelectedTestItem(null);
      }
    } catch (err) {
      console.error("Error loading test list:", err);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  // Tải danh sách Điểm Đo theo TEST_CODE
  const loadTestPointList = useCallback(async (testCode: number) => {
    if (!testCode && testCode !== 0) {
      setTestPointList([]);
      return;
    }
    setLoadingPoints(true);
    try {
      const data = await f_loadDTC_TestPointList(testCode);
      setTestPointList(data || []);
    } catch (err) {
      console.error("Error loading test point list:", err);
      setTestPointList([]);
    } finally {
      setLoadingPoints(false);
    }
  }, []);

  // Effect tải ban đầu
  useEffect(() => {
    loadTestList();
  }, [loadTestList]);

  // Effect khi selectedTestItem thay đổi
  useEffect(() => {
    if (selectedTestItem?.TEST_CODE !== undefined) {
      loadTestPointList(selectedTestItem.TEST_CODE);
    } else {
      setTestPointList([]);
    }
  }, [selectedTestItem, loadTestPointList]);

  // Chọn Hạng Mục Test khi click dòng
  const handleSelectTestItem = useCallback(
    (item: TestListTable) => {
      setSelectedTestItem(item);
      loadTestPointList(item.TEST_CODE);
    },
    [loadTestPointList]
  );

  // Gợi ý mã TEST_CODE tiếp theo
  const suggestedNextTestCode = useMemo(() => {
    if (!testList || testList.length === 0) return 1;
    const max = testList.reduce((acc, curr) => {
      const val = Number(curr.TEST_CODE) || 0;
      return val > acc ? val : acc;
    }, 0);
    return max + 1;
  }, [testList]);

  // Gợi ý mã POINT_CODE tiếp theo
  const suggestedNextPointCode = useMemo(() => {
    if (!testPointList || testPointList.length === 0) return 1;
    const max = testPointList.reduce((acc, curr) => {
      const val = Number(curr.POINT_CODE) || 0;
      return val > acc ? val : acc;
    }, 0);
    return max + 1;
  }, [testPointList]);

  // Lọc tìm kiếm Test Items
  const filteredItems = useMemo(() => {
    if (!itemSearch.trim()) return testList;
    const q = itemSearch.toLowerCase().trim();
    return testList.filter(
      (item) =>
        String(item.TEST_CODE).toLowerCase().includes(q) ||
        (item.TEST_NAME && item.TEST_NAME.toLowerCase().includes(q)) ||
        (item.TEST_TIME && String(item.TEST_TIME).toLowerCase().includes(q))
    );
  }, [testList, itemSearch]);

  // Lọc tìm kiếm Test Points
  const filteredPoints = useMemo(() => {
    if (!pointSearch.trim()) return testPointList;
    const q = pointSearch.toLowerCase().trim();
    return testPointList.filter(
      (p) =>
        String(p.POINT_CODE).toLowerCase().includes(q) ||
        (p.POINT_NAME && p.POINT_NAME.toLowerCase().includes(q)) ||
        String(p.TEST_CODE).toLowerCase().includes(q)
    );
  }, [testPointList, pointSearch]);

  // Thêm mới Hạng Mục Test
  const handleCreateTestItem = useCallback(
    async (code: number, name: string) => {
      if (!name.trim()) {
        Swal.fire("Lỗi nhập liệu", "Vui lòng nhập tên hạng mục kiểm tra", "warning");
        return false;
      }
      try {
        await f_addTestItem(code, name.trim());
        await loadTestList();
        setOpenAddItemModal(false);
        return true;
      } catch (err) {
        console.error("Error adding test item:", err);
        Swal.fire("Thất bại", "Không thể thêm hạng mục test", "error");
        return false;
      }
    },
    [loadTestList]
  );

  // Thêm mới Điểm Đo Test
  const handleCreateTestPoint = useCallback(
    async (pointCode: number, pointName: string) => {
      if (!selectedTestItem) {
        Swal.fire("Chưa chọn hạng mục", "Vui lòng chọn một hạng mục test trước khi thêm điểm đo", "warning");
        return false;
      }
      if (!pointName.trim()) {
        Swal.fire("Lỗi nhập liệu", "Vui lòng nhập tên điểm đo (Point Name)", "warning");
        return false;
      }
      try {
        await f_addTestPoint(selectedTestItem.TEST_CODE, pointCode, pointName.trim());
        await loadTestPointList(selectedTestItem.TEST_CODE);
        setOpenAddPointModal(false);
        return true;
      } catch (err) {
        console.error("Error adding test point:", err);
        Swal.fire("Thất bại", "Không thể thêm điểm đo", "error");
        return false;
      }
    },
    [selectedTestItem, loadTestPointList]
  );

  // Xuất Excel Test Items
  const handleExportItems = useCallback(() => {
    if (filteredItems.length === 0) {
      Swal.fire("Không có dữ liệu", "Danh sách hạng mục hiện tại rỗng", "info");
      return;
    }
    SaveExcel(
      filteredItems,
      `DTC_TEST_ITEMS_${moment().format("YYYYMMDD_HHmm")}`
    );
  }, [filteredItems]);

  // Xuất Excel Test Points
  const handleExportPoints = useCallback(() => {
    if (filteredPoints.length === 0) {
      Swal.fire("Không có dữ liệu", "Danh sách điểm đo hiện tại rỗng", "info");
      return;
    }
    const testCodePrefix = selectedTestItem ? `TEST_${selectedTestItem.TEST_CODE}_` : "";
    SaveExcel(
      filteredPoints,
      `DTC_TEST_POINTS_${testCodePrefix}${moment().format("YYYYMMDD_HHmm")}`
    );
  }, [filteredPoints, selectedTestItem]);

  // Realtime KPIs
  const kpis = useMemo(() => {
    return {
      totalItems: testList.length,
      selectedItemName: selectedTestItem ? selectedTestItem.TEST_NAME : "Chưa chọn",
      selectedItemCode: selectedTestItem ? selectedTestItem.TEST_CODE : null,
      totalPoints: testPointList.length,
    };
  }, [testList, testPointList, selectedTestItem]);

  return {
    testList,
    testPointList,
    selectedTestItem,
    itemSearch,
    setItemSearch,
    pointSearch,
    setPointSearch,
    loadingItems,
    loadingPoints,
    openAddItemModal,
    setOpenAddItemModal,
    openAddPointModal,
    setOpenAddPointModal,
    suggestedNextTestCode,
    suggestedNextPointCode,
    filteredItems,
    filteredPoints,
    kpis,
    loadTestList,
    loadTestPointList: () =>
      selectedTestItem ? loadTestPointList(selectedTestItem.TEST_CODE) : Promise.resolve(),
    handleSelectTestItem,
    handleCreateTestItem,
    handleCreateTestPoint,
    handleExportItems,
    handleExportPoints,
  };
};
