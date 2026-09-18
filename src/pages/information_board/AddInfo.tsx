import React, { useState } from "react";
import "./PrecisionAddInfo/PrecisionAddInfo.scss";
import { useAddInfoData } from "./PrecisionAddInfo/useAddInfoData";
import PrecisionAddInfoHeader from "./PrecisionAddInfo/PrecisionAddInfoHeader";
import PrecisionAddInfoToolbar from "./PrecisionAddInfo/PrecisionAddInfoToolbar";
import PrecisionAddInfoKpi from "./PrecisionAddInfo/PrecisionAddInfoKpi";
import PrecisionAddInfoStudio from "./PrecisionAddInfo/PrecisionAddInfoStudio";
import PrecisionAddInfoCharts from "./PrecisionAddInfo/PrecisionAddInfoCharts";
import PrecisionAddInfoRecentFeed from "./PrecisionAddInfo/PrecisionAddInfoRecentFeed";
import PrecisionAddInfoViewModal from "./PrecisionAddInfo/PrecisionAddInfoViewModal";

const AddInfo: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    userData,
    deptList,
    postList,
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
  } = useAddInfoData();

  const showStudio = activeTab === "all" || activeTab === "studio";
  const showCharts = activeTab === "all" || activeTab === "analytics";
  const showFeed = activeTab === "all" || activeTab === "feed";

  return (
    <div className={`precision-addinfo ${isFullScreen ? "is-fullscreen" : ""}`}>
      {/* 1. Header Bar Công Nghiệp Telemetry */}
      <PrecisionAddInfoHeader
        totalPosts={postList.length}
        totalDepts={deptList.length}
        onRefresh={initData}
        isFullScreen={isFullScreen}
        onToggleFullScreen={() => setIsFullScreen((prev) => !prev)}
      />

      {/* 2. Toolbar Compact & Segment Navigation Tabs */}
      <PrecisionAddInfoToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalPosts={postList.length}
      />

      {/* 3. Vùng Dashboard Scrollable Body */}
      <div className="precision-addinfo__body">
        {/* KPI Micro-cards Realtime */}
        <PrecisionAddInfoKpi data={kpiData} />

        {/* Phân hệ Soạn Thảo Đăng Tin Studio & Live Preview */}
        {showStudio && (
          <PrecisionAddInfoStudio
            deptList={deptList}
            selectedDept={selectedDept}
            onDeptChange={setSelectedDept}
            title={title}
            onTitleChange={setTitle}
            content={content}
            onContentChange={setContent}
            isPinned={isPinned}
            onPinnedChange={setIsPinned}
            file={file}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
            onSubmit={handlePublishPost}
            isSubmitting={isSubmitting}
            authorName={userData?.EMPL_NAME || userData?.EMPL_NO || "Admin"}
          />
        )}

        {/* Phân hệ 4 Biểu Đồ Recharts Executive Dashboard Chuẩn KDReport */}
        {showCharts && (
          <PrecisionAddInfoCharts
            deptChartData={deptChartData}
            trendChartData={trendChartData}
            topAuthorsData={topAuthorsData}
            deptMediaData={deptMediaData}
          />
        )}

        {/* Phân hệ Danh Sách Bài Viết Đã Phát Hành Gần Đây */}
        {showFeed && (
          <PrecisionAddInfoRecentFeed
            posts={filteredFeedPosts}
            totalCount={postList.length}
            searchTerm={feedSearch}
            onSearchChange={setFeedSearch}
            onSelectPost={setViewingPost}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
          />
        )}
      </div>

      {/* Modal Đọc Nhanh Bài Viết & Xem Ảnh Lớn */}
      <PrecisionAddInfoViewModal
        post={viewingPost}
        onClose={() => setViewingPost(null)}
      />
    </div>
  );
};

export default AddInfo;
