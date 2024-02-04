import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { CustomResponsiveContainer } from "../../api/GlobalFunction";

const Chart3 = () => {
  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <div>
      <CustomResponsiveContainer>
        <PieChart width={800} height={800}>
          <Legend />
          <Tooltip />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </CustomResponsiveContainer>
    </div>
  );
};
export default Chart3;
