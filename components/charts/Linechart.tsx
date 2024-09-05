import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export interface Iaxis {
  item: number | string;
  value: number;
}

export interface IGraphProps {
  title?: string;
  data: Iaxis[];
  x_axis_title?: string;
  y_axis_title?: string;
}

const LinechartComponent = (props: IGraphProps) => {
  const { title, data, x_axis_title, y_axis_title } = props;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" h-[350px]   ">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis dataKey="item" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="value"
                activeDot={{
                  r: 6,
                }}
                stroke="hsl(var(--primary))"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinechartComponent;
