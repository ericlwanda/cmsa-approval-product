import * as React from "react";

import { FormControl } from "../ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

import { useQuery } from "@tanstack/react-query";
import { Role } from "@/types/user";
import { GET } from "@/lib/client/client";
import { SurveyCategory, SurveySubCategory } from "@/types/survey";

type Props = {
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

const SubCategorySelect = (props: Props) => {
  const { onChange, value, placeholder, disabled } = props;

  //query to get roles
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categoryList"],
    queryFn: () => GET("/subcategories"),
  });

  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder ?? "Select a SubCategory"}>
            {categories?.content.find(
              (category: SurveySubCategory) => category.id.toString() === value
            )?.title ?? ""}
          </SelectValue>
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {categories?.content.map((category: SurveySubCategory, i: any) => {
          return (
            <SelectItem key={i} value={category.id.toString()}>
              {category.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

SubCategorySelect.displayName = "SubCategorySelect";

export { SubCategorySelect };
