import moment from "moment";
import React, { PureComponent, useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
  Label,
} from "recharts";
import Swal from "sweetalert2";
import { generalQuery } from "../../api/Api";
import { CustomResponsiveContainer } from "../../api/GlobalFunction";
interface SamSungFCSTData {
  WEEKNO: string;
  SEVT1: number;
  SEV1: number,
  SAMSUNG_ASIA1: number,
  TT_SS1: number,
  SEVT2: number;
  SEV2: number,
  SAMSUNG_ASIA2: number,
  TT_SS2: number,
}
const ChartFCSTSamSung = () => {
  const [runningPOData, setSamSungFCSTData] = useState<Array<SamSungFCSTData>>([]);
  const formatCash = (n: number) => {
    if (n < 1e3) return n;
    if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K$";
  };
  const labelFormatter = (value: number) => {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  };
  const CustomTooltip = ({ active, payload, label } : {active?:any, payload?:any, label?: any}) => {
    if (active && payload && payload.length) {
      return (
        <div className='custom-tooltip' style={{backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)", padding: 20, borderRadius: 5}}>
          <p>{label}:</p>
          <p className='label'>QTY Tuần Trước: {`${(payload[0].value + payload[1].value+payload[2].value).toLocaleString("en-US")}`} EA</p>          
          <p className='label'>QTY Tuần Này: {`${(payload[3].value + payload[4].value + payload[5].value).toLocaleString("en-US")}`} EA</p>          
        </div>
      );
    }
    return null;
}
//console.log(moment().add(1,'days').isoWeek());
  const handleGetDailyClosing = () => {
    let fcstweek2:number = moment().add(1,'days').isoWeek();
    let fcstyear2: number = moment().year(); 
    let fcstweek1:number = moment().add(1,'days').isoWeek()-1;
    let fcstyear1: number = moment().year();
    if(fcstweek2 ===1)
    {
        fcstweek1 = 52;
        fcstyear1 = fcstyear2 -1;
    }
    
    generalQuery("baocaofcstss", {FCSTYEAR1: fcstyear1, FCSTYEAR2: fcstyear2, FCSTWEEKNUM1: fcstweek1, FCSTWEEKNUM2: fcstweek2 })
      .then((response) => {
        //console.log(response.data.data)
        if (response.data.tk_status !== "NG") {
          const loadeddata: SamSungFCSTData[] = response.data.data.map(
            (element: SamSungFCSTData, index: number) => {
              return {
                ...element,
                WEEKNO: (fcstweek2 + index) > 52 ? 'W'+ ((fcstweek2 + index-52-1===0)? 52:1) + '_W'+ (fcstweek2 + index-52): 'W'+ (fcstweek2 + index-1) + '_W'+ (fcstweek2 + index)
              };
            }
          );
          if(loadeddata[0].TT_SS1 !== null && loadeddata[0].TT_SS2 !== null)
          {
              setSamSungFCSTData(loadeddata.splice(0,15));
          }
          else
          {
            generalQuery("baocaofcstss", {FCSTYEAR1: fcstyear1, FCSTYEAR2: fcstyear2, FCSTWEEKNUM1: fcstweek1-1, FCSTWEEKNUM2: fcstweek2-1 })
            .then((response) => {
              //console.log(response.data.data)
              if (response.data.tk_status !== "NG") {
                const loadeddata: SamSungFCSTData[] = response.data.data.map(
                  (element: SamSungFCSTData, index: number) => {
                    return {
                      ...element,
                      WEEKNO: (fcstweek2 + index) > 52 ? 'W'+ ((fcstweek2 + index-52-1===0)? 52:1) + '_W'+ (fcstweek2 + index-52): 'W'+ (fcstweek2 + index-1) + '_W'+ (fcstweek2 + index)
                    };
                  }
                );
                setSamSungFCSTData(loadeddata.splice(0,15));
                //console.log(loadeddata);
              } else {
                Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });

          }
          //console.log(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handleGetDailyClosing();
  }, []);
  return (
    <CustomResponsiveContainer>
      <ComposedChart
        width={500}
        height={300}
        data={runningPOData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {" "}
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='WEEKNO'>
          {" "}
          <Label value='Tuần' offset={0} position='insideBottom' />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "Số lượng",
            angle: -90,
            position: "insideLeft",
          }}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
          tickCount={12}
        />
        <Tooltip content={<CustomTooltip/>}/>
        <Legend />
        <Bar
          yAxisId='left-axis'
          type='monotone'
          dataKey='SEVT1'
          stroke='white'
          fill='#44cc00'
          stackId='ss1'
          
        ></Bar>
        <Bar
          yAxisId='left-axis'
          type='monotone'
          dataKey='SEV1'
          stroke='white'
          fill='#ff80ff'
          stackId='ss1'
          
        ></Bar>
        <Bar
          yAxisId='left-axis'
          type='monotone'
          dataKey='SAMSUNG_ASIA1'
          stroke='white'
          fill='#4d94ff'
          stackId='ss1'
          label={{ position: "top", formatter: labelFormatter }}
        ></Bar>
        <Bar
          yAxisId='left-axis'
          type='monotone'
          dataKey='SEVT2'
          stroke='white'
          fill='#44cc00'
          stackId='ss2'
          
        ></Bar>
        <Bar
          yAxisId='left-axis'
          type='monotone'
          dataKey='SEV2'
          stroke='white'
          fill='#ff80ff'
          stackId='ss2'
          
        ></Bar>
        <Bar
          yAxisId='left-axis'
          type='monotone'
          dataKey='SAMSUNG_ASIA2'
          stroke='white'
          fill='#4d94ff'
          stackId='ss2'
          label={{ position: "top", formatter: labelFormatter }}
        ></Bar>

        

        
        
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default ChartFCSTSamSung;