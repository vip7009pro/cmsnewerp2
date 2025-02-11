import React from "react";
import { POST_DATA } from "../../api/GlobalInterface";
import moment from "moment";

interface NewsItem {
  thumbnail: string;
  imageSrc: string;
  title: string;
}

interface NewsListProps {
  newsItems: POST_DATA[];
  onNewsClick: (newsItem: POST_DATA) => void;
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
          <div className="thumbnail" style={{ fontSize: "1.0rem" }}>
            <img src={encodeURI(`/informationboard/${item.FILE_NAME}`)} alt={`Thumbnail ${index + 1}`} />
            <div className="deptinfo" style={{ fontSize: "0.7rem" }}>
              <span style={{ fontSize: "0.7rem", color: "#09a9b4" }}>{item.SUBDEPT}</span>
              <span style={{ fontSize: "0.7rem" }}> {` `}{moment.utc(item.INS_DATE).format('YYYY-MM-DD')}</span>
            </div>
          </div>
          <div className="news-imagelist-footer" style={{ fontSize: "0.8rem", height: "100%" }}>
            <div className="element_title" style={{ fontSize: "1.2rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {item.TITLE}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
