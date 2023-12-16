import React from "react";
import "./FallBackComponent.scss";
import styled from "styled-components";
const FallBackComponent = () => {
  return <div className="fallback">
    <div className="title">
      Loading
    </div>
    <div className="loading">
    </div>
  </div>;
};
export default FallBackComponent;
