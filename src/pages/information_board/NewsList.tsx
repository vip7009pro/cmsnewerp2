import React from "react";
import moment from "moment";
import { POST_DATA } from "./interfaces/infoInterface";

interface NewsListProps {
  newsItems: POST_DATA[];
  selectedPostId?: number;
  onNewsClick: (newsItem: POST_DATA) => void;
}

const NewsList: React.FC<NewsListProps> = ({ newsItems, selectedPostId, onNewsClick }) => {
  return (
    <div className="news-list">
      {newsItems.map((item, index) => (
        <div
          className={`news-item ${selectedPostId === item.POST_ID ? 'isSelected' : ''}`}
          key={item.POST_ID ?? index}
          onClick={() => onNewsClick(item)}
        >
          <div className="news-item__thumb">
            <img src={encodeURI(`/informationboard/${item.FILE_NAME}`)} alt={`Thumbnail ${index + 1}`} />
          </div>
          <div className="news-item__body">
            <div className="news-item__meta">
              <span className="news-item__dept">{item.SUBDEPT}</span>
              <span className="news-item__date">{moment.utc(item.INS_DATE).format('YYYY-MM-DD')}</span>
            </div>
            <div className="news-item__title">
              {item.TITLE}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
