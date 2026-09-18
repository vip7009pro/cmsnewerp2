import React, { useState } from "react";
import "./PrecisionPostManager/PrecisionPostManager.scss";
import { usePostManagerData } from "./PrecisionPostManager/usePostManagerData";
import PrecisionPostManagerHeader from "./PrecisionPostManager/PrecisionPostManagerHeader";
import PrecisionPostManagerToolbar from "./PrecisionPostManager/PrecisionPostManagerToolbar";
import PrecisionPostManagerKpi from "./PrecisionPostManager/PrecisionPostManagerKpi";
import PrecisionPostManagerCharts from "./PrecisionPostManager/PrecisionPostManagerCharts";
import PrecisionPostManagerGrid from "./PrecisionPostManager/PrecisionPostManagerGrid";
import PrecisionPostManagerAddModal from "./PrecisionPostManager/PrecisionPostManagerAddModal";
import PrecisionPostManagerViewModal from "./PrecisionPostManager/PrecisionPostManagerViewModal";

const PostManager: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const {
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
  } = usePostManagerData();

  const showGrid = activeTab === "all" || activeTab === "table";
  const showCharts = activeTab === "all" || activeTab === "analytics";

  return (
    <div className={`precision-postmanager ${isFullScreen ? "is-fullscreen" : ""}`}>
      {/* 1. Header Bar Công Nghiệp Telemetry */}
      <PrecisionPostManagerHeader
        totalPosts={postList.length}
        filteredCount={filteredPosts.length}
        onRefresh={fetchPostList}
        isFullScreen={isFullScreen}
        onToggleFullScreen={() => setIsFullScreen((prev) => !prev)}
      />

      {/* 2. Action Toolbar: Lọc ngày & Segment Navigation Tabs */}
      <PrecisionPostManagerToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fromDate={fromdate}
        onFromDateChange={setFromDate}
        toDate={todate}
        onToDateChange={setToDate}
        allTime={alltime}
        onAllTimeChange={setAllTime}
        onOpenAddModal={() => setShowAddModal(true)}
        totalPosts={postList.length}
      />

      {/* 3. Dashboard Scrollable Body */}
      <div className="precision-postmanager__body">
        {/* KPI Micro-cards Grid Realtime */}
        <PrecisionPostManagerKpi data={kpiData} />

        {/* Phân hệ 4 Biểu Đồ Recharts Executive Dashboard Chuẩn KDReport */}
        {showCharts && (
          <PrecisionPostManagerCharts
            deptChartData={deptChartData}
            trendChartData={trendChartData}
            topAuthorsData={topAuthorsData}
            deptMediaData={deptMediaData}
          />
        )}

        {/* Phân hệ Bảng Danh Sách AGTable Quản Lý & Biên Tập Bài Viết */}
        {showGrid && (
          <PrecisionPostManagerGrid
            data={filteredPosts}
            totalDataCount={postList.length}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            onSelectionChange={(selected) => {
              selectedPostList.current = selected;
            }}
            onOpenAddModal={() => setShowAddModal(true)}
            onUpdatePosts={updatePost}
            onDeletePosts={deletePost}
            onViewPost={(post) => setViewingPost(post)}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
          />
        )}
      </div>

      {/* 4. Modal Đăng Tin Mới (Add Information Modal) */}
      <PrecisionPostManagerAddModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          fetchPostList();
        }}
      />

      {/* 5. Modal Xem Nhanh Bài Viết & Ảnh Lớn */}
      <PrecisionPostManagerViewModal
        post={viewingPost}
        onClose={() => setViewingPost(null)}
      />
    </div>
  );
};

export default PostManager;