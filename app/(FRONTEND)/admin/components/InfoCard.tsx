import { CustomIcon } from "@/components/Icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export interface IcardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: string;
}
const InfoCard = (props: IcardProps) => {
  const { title, description, value, icon } = props;
  return (
    <Card className=" ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CustomIcon icon={icon} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
