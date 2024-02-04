import React from "react";
import "./CIRCLE_COMPONENT.scss";
import { FcBusinessman } from "react-icons/fc";
const CIRCLE_COMPONENT = ({
  type,
  value,
  title,
  color,
}: {
  type?: string;
  value?: string;
  title?: string;
  color?: string;
}) => {
  if (type === "workforce") {
    return (
      <div className="circlecomponent">
        <div className="value" style={{ color: color }}>
          {value}
          <FcBusinessman />
        </div>
        <div className="title" style={{ color: color }}>
          {title}
        </div>
      </div>
    );
  } else if (type === "machine") {
    return (
      <div className="machinecirclecomponent">
        <div className="title" style={{ color: color }}>
          {title}
        </div>
        <div className="value" style={{ color: color }}>
          {value}{" "}
          <img alt="running" src="/blink.gif" width={40} height={20}></img>
        </div>
      </div>
    );
  } else if (type === "rate") {
    return (
      <div className="machinecirclecomponent">
        <div className="title" style={{ color: color }}>
          {value}
        </div>
      </div>
    );
  } else if (type === "loss") {
    return (
      <div className="losscirclecomponent">
        <div className="title" style={{ color: color }}>
          {title}
        </div>
        <div className="value" style={{ color: color }}>
          {value}
        </div>
      </div>
    );
  } else if (type === "time") {
    return (
      <div className="timeefficiency">
        <div className="title" style={{ color: color }}>
          {title}
        </div>
        <div className="value" style={{ color: color }}>
          {value}
        </div>
      </div>
    );
  } else if (type === "timesummary") {
    return (
      <div className="timeefficiencysummary">
        <div className="title" style={{ color: color }}>
          {title}
        </div>
        <div className="value" style={{ color: color }}>
          {value}
        </div>
      </div>
    );
  } else {
    return (
      <div className="circlecomponent">
        <div className="value" style={{ color: color }}>
          {value}
          <FcBusinessman />
        </div>
        <div className="title" style={{ color: color }}>
          {title}
        </div>
      </div>
    );
  }
};
export default CIRCLE_COMPONENT;
