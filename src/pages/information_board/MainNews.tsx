import React from "react";

interface MainNewsProps {
  imageSrc: string;
  title: string;
  dept: string;
  date: string;
  onClick: () => void;
}

const MainNews: React.FC<MainNewsProps> = ({ imageSrc, title, dept, date, onClick }) => {
  return (
    <div className="main-news" onClick={onClick}>
      <div className="main-news__media">
        <img src={imageSrc} alt="Main News" />
      </div>
      <div className="main-news__footer">
        <div className="main-news__title">{title}</div>
        <div className="main-news__meta">
          <span className="main-news__dept">{dept}</span>
          <span className="main-news__date">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default MainNews;
