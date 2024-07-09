import moment from "moment";
import React, { PureComponent, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Label,
  LabelList,
  Line,
} from "recharts";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import {
  COLORS,
  CustomResponsiveContainer,
  ERR_TABLE,
  dynamicSort,
  nFormatter,
} from "../../../api/GlobalFunction";
import { DEFECT_TRENDING_DATA, DailyData, FcostData } from "../../../api/GlobalInterface";
const PQCDailyDefectTrending = ({ dldata, onClick }: { dldata: DEFECT_TRENDING_DATA[], onClick: (e: any) => void }) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };
  const labelFormatter = (value: number) => {
    return value.toLocaleString('en-US', { style: 'percent' });
  };
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: any;
    payload?: any;
    label?: any;
  }) => {
    if (active && payload && payload.length) {
      let newPayLoad = payload.sort(dynamicSort("-value"));
      //console.log(newPayLoad); 
      return (
        <div className="custom-tooltip">
          <p className="label">{`Date: ${label}`}</p>
          {newPayLoad.map((entry: any, index: number) => {
            let err_name_vn = ERR_TABLE.filter((ele: any, index: number) => entry.dataKey === ele.ERR_CODE)[0].ERR_NAME_VN;
            let err_name_kr = ERR_TABLE.filter((ele: any, index: number) => entry.dataKey === ele.ERR_CODE)[0].ERR_NAME_KR;
            return (
              entry.value !== 0 && (
                <p key={index} className={`value ${entry.dataKey}`} style={{ fontSize: '0.7rem' }}>
                  {`${err_name_vn}(${err_name_kr}): ${entry.value.toLocaleString('en-US', {
                    style: "percent",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}`}
                </p>
              ))
          })}
        </div>
      );
    }
    return null;
  };
  const handleClick = (e: any) => {
    // console.log(e)
    onClick(e);
  }
  useEffect(() => { }, []);
  return (
    <CustomResponsiveContainer>
      <ComposedChart
        onClick={(e) => { handleClick(e) }}
        width={500}
        height={300}
        data={dldata}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='INSPECT_DATE' height={40} tick={{ fontSize: '0.7rem' }}>
          <Label value='Ngày' offset={0} position='insideBottom' style={{ fontWeight: 'normal', fontSize: '0.7rem' }} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "NG Rate",
            angle: -90,
            position: "insideLeft",
            fontSize: '0.7rem'
          }}
          tick={{ fontSize: '0.7rem' }}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
          tickCount={7}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="center"
          iconSize={15}
          iconType="diamond"
          formatter={(value, entry) => {
            let err_name_vn = (ERR_TABLE.filter((ele: any, index: number) => value === ele.ERR_CODE)[0].ERR_NAME_VN);
            let err_name_kr = (ERR_TABLE.filter((ele: any, index: number) => value === ele.ERR_CODE)[0].ERR_NAME_KR);
            return (
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{`${err_name_vn}(${err_name_kr})`}</span>
            )
          }} />
        {
          Object.entries(dldata[0] ?? []).map((ele: any, index: number) => {
            if (['INSPECT_DATE', 'INSPECT_TOTAL_QTY', 'INSPECT_OK_QTY', 'INSPECT_NG_QTY', 'id', 'ERR1', 'ERR2', 'ERR3', 'ERR32'].indexOf(ele[0]) < 0)
              return (
                <Line
                  key={`chart-${index}`}
                  yAxisId='left-axis'
                  type='monotone'
                  dataKey={`${ele[0]}`}
                  stroke={COLORS[((2 * index) % COLORS.length) * 2]}
                  label={{ position: "top", formatter: labelFormatter, fontSize: '0.7rem', fontWeight: 'bold', color: 'black' }}
                  fill={COLORS[((Math.floor(Math.random() * 32) * index) % COLORS.length) * 2]}
                >
                  <LabelList dataKey={`${ele[0]}`} fill="black" position="top" formatter={labelFormatter} fontSize={"0.7rem"} />
                </Line>
              )
          })
        }
        {/* <Bar
          stackId='a'
          yAxisId='left-axis'
          type='monotone'
          dataKey='P_NG_AMOUNT'
          stroke='white'                 
        >
          <LabelList dataKey="P_NG_AMOUNT" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>
        <Bar
          stackId='a'
          yAxisId='left-axis'
          type='monotone'
          dataKey='M_NG_AMOUNT'
          stroke='white'                   
        >
          <LabelList dataKey="M_NG_AMOUNT" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar> */}
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default PQCDailyDefectTrending;
