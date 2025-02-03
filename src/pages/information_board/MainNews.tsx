import React from "react";

interface MainNewsProps {
  imageSrc: string;
  title: string;
  dept: string;
  date: string;
  onClick: () => void;
}

const MainNews: React.FC<MainNewsProps> = ({ imageSrc, title,dept, date, onClick }) => {
  console.log(date);
  return (
    <div className="main-news" onClick={onClick}>
      <img src={imageSrc} alt="Main News" width={"100%"} height="200px" />
      <div className="main-news-footer">
        <span style={{ fontSize: "3.0rem" }}>{title}</span>
        <div className="deptinfo">
          <span style={{ fontSize: "2.0rem", color: "#09a9b4" }}>{dept}</span> {` `}
          <span style={{ fontSize: "1.5rem" }}>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default MainNews;
