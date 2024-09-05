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
import { Iaxis } from "./Linechart";

export interface IGraphProps {
  title?: string;
  data: Iaxis[];
  x_axis_title?: string;
  y_axis_title?: string;
}

const BarChartComponent = (props: IGraphProps) => {
  const { title, data, x_axis_title, y_axis_title } = props;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" h-[350px] w-full  ">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
              <Legend className=" bg-primary" />
              <Bar dataKey="value" className=" fill-primary" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;
