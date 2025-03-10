import React, { useState, ReactNode } from 'react';
import './MyTab.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// Định nghĩa kiểu cho props của Tab
interface TabProps {
  title: string;
  children: ReactNode;
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
  // State để theo dõi tab đang active
  const [activeTab, setActiveTab] = useState<number>(defaultActiveTab);

  // Lấy danh sách các tab từ children
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  // Hàm xử lý khi nhấp vào tab
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="tabs-container">
      {/* Danh sách tab (TabList) */}
      <div className="tab-list" style={{ backgroundImage: theme.CMS.backgroundImage }}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-item ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.props.title}
          </button>
        ))}
      </div>

      {/* Nội dung của tab hiện tại */}
      <div className="tab-content">
        {tabs[activeTab]?.props.children}
      </div>
    </div>
  );
};

// Gắn Tab vào MyTabs để sử dụng như một thành phần con
MyTabs.Tab = Tab;

export default MyTabs;