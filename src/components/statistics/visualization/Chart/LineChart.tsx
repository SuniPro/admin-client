import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "212회차",
    EVEN: 4000,
    ODD: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    EVEN: 3000,
    ODD: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    EVEN: 2000,
    ODD: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    EVEN: 2780,
    ODD: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    EVEN: 1890,
    ODD: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    EVEN: 2390,
    ODD: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    EVEN: 3490,
    ODD: 4300,
    amt: 2100,
  },
];

export function SimpleLineChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20 }} accessibilityLayer>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="ODD"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="EVEN" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MovingAverageChart() {
  const data = [
    { round: 219, result: 0, movingAvg: 0.2 },
    { round: 218, result: 1, movingAvg: 0.4 },
    { round: 217, result: 0, movingAvg: 0.3 },
    { round: 216, result: 0, movingAvg: 0.25 },
    { round: 215, result: 0, movingAvg: 0.2 },
    { round: 214, result: 0, movingAvg: 0.15 },
  ];
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="round" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="result" stroke="#8884d8" />
      <Line type="monotone" dataKey="movingAvg" stroke="#82ca9d" />
    </LineChart>
  );
}
