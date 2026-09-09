import React, { useState, ReactNode, Suspense } from 'react';
import './MyTab.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { IconButton } from '@mui/material';
import { AiOutlineCloseCircle } from 'react-icons/ai';

// Định nghĩa kiểu cho props của Tab
interface TabProps {
  title: string;
  children: ReactNode;
  showClose?: boolean;
  onClose?: () => void;
  shouldRender?: boolean; // Thêm prop để kiểm soát re-render
}

// Component Tab
const Tab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};

// Định nghĩa kiểu cho props của MyTabs
interface MyTabsProps {
  children: ReactNode;
  defaultActiveTab?: number;
}

// Component MyTabs chính
const MyTabs: React.FC<MyTabsProps> & { Tab: React.FC<TabProps> } = ({
  children,
  defaultActiveTab = 0,
}) => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [activeTab, setActiveTab] = useState<number>(defaultActiveTab);
  // State để theo dõi tab nào đã được render
  const [renderedTabs, setRenderedTabs] = useState<{ [key: number]: boolean }>({});

  // Lấy danh sách các tab từ children
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  // Hàm xử lý khi nhấp vào tab
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    // Chỉ đánh dấu tab là đã render nếu shouldRender = true
    if (tabs[index].props.shouldRender !== false) {
      setRenderedTabs((prev) => ({ ...prev, [index]: true }));
    }
  };

  // Hàm xử lý khi click nút close
  const handleCloseClick = (index: number, e: React.MouseEvent) => {
   /*  e.stopPropagation();
    onTabClose?.(index);
    if (activeTab === index) {
      setActiveTab(Math.max(index - 1, 0));
    }
    // Xóa trạng thái render của tab bị đóng nếu muốn
    setRenderedTabs((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    }); */
  };

  return (
    <div className="tabs-container">
      {/* Danh sách tab (TabList) chuẩn Stitch */}
      <div className="tab-list">
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            className={`tab-item ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {activeTab === index && <span className="active-dot" />}
            <span className="tab-title">{tab.props.title}</span>
            {tab.props.showClose && (
              <span
                className="close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  tab.props.onClose?.();
                }}
              >
                &times;
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Nội dung của tab hiện tại */}
      <div className="tab-content">
        {tabs.map((tab, index) => {
          const shouldRenderTab =
            tab.props.shouldRender === false
              ? activeTab === index
              : renderedTabs[index] || activeTab === index;

          return (
            <div
              key={index}
              className={`tab-pane ${activeTab === index ? 'active' : ''}`}
              style={{
                display: activeTab === index ? 'flex' : 'none',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                height: '100%',
                maxHeight: '100%',
                flex: '1 1 auto',
                minHeight: 0,
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              <Suspense fallback={<div style={{ padding: 12 }}>Đang tải tab...</div>}>
                {shouldRenderTab ? tab.props.children : null}
              </Suspense>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Gắn Tab vào MyTabs
MyTabs.Tab = Tab;

export default MyTabs;