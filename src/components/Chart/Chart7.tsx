import React from "react";
import { Chart } from "react-google-charts";

const Chart7 = () => {
  
  const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];

  const options = {
    title: "Doanh thu theo khách hàng",
    is3D: true,
    /* sliceVisibilityThreshold: 0.1 */
  };

  return (
    <div>
      <Chart
        chartType='PieChart'
        data={data}
        options={options}
        width={"100%"}
        height={"100%"}
      />
    </div>
  );
};

export default Chart7;
