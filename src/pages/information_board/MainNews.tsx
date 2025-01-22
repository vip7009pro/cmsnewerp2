import React from "react";

interface MainNewsProps {
  imageSrc: string;
  title: string;
}

const MainNews: React.FC<MainNewsProps> = ({ imageSrc, title }) => {
  return (
    <div className="main-news">
      <img src={imageSrc} alt="Main News" width={"100%"} height="200px"/>
      <div className="main-news-footer">
      <span style={{ fontSize: "3.0rem" }}>{title}</span>
      <div className="deptinfo">
      <span style={{ fontSize: "2.0rem", color: "#09a9b4" }}>EHS</span>
      <span style={{ fontSize: "1.5rem", }}>  2025-01-22</span>
      </div>
      </div>
    </div>
  );
};

export default MainNews;
