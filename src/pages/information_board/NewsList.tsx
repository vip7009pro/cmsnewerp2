import React from "react";

interface NewsItem {
  thumbnail: string;
  imageSrc: string;
  title: string;
}

interface NewsListProps {
  newsItems: NewsItem[];
  onNewsClick: (newsItem: NewsItem) => void;
}

const NewsList: React.FC<NewsListProps> = ({ newsItems, onNewsClick }) => {
  return (
    <div className="news-list">
      {newsItems.map((item, index) => (
        <div
          className="news-item"
          key={index}
          onClick={() => onNewsClick(item)} // Gọi hàm khi click vào tin
        >
          <img src={item.thumbnail} alt={`Thumbnail ${index + 1}`}/>
          <div className="news-imagelist-footer">
          <div style={{ fontSize: "1.0rem", }}>{item.title}</div>
          <div style={{ fontSize: "0.7rem" }}>
            <span style={{ fontSize: "0.7rem", color: "#09a9b4" }}>EHS</span> 
            <span style={{ fontSize: "0.7rem",}}> {` `}2025-01-22</span>
          </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
