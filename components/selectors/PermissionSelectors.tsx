import { GET } from "@/lib/client/client";
import { Permissions } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { MultiSelect, Option } from "react-multi-select-component";

type Props = {
  onChange: (value: string[]) => void;
  value?: Option[];
  placeholder?: string;
  disabled?: boolean;
};
const PermissionSelector = (props: Props) => {
  const { onChange, value, placeholder, disabled } = props;
  const [selected, setSelected] = useState<Option[]>([]);
  const {
    data: Permissions,
    isPending: isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["Permissions"],
    queryFn: () => GET("/users/list-permissions"),
  });

  const onSelect = (value: Option[]) => {
    setSelected(value);
    const newArray = value.map((option) => option.value);
    onChange(newArray);
  };
  const Options = Permissions?.map((item: Permissions, _: any) => {
    return {
      label: item.name,
      value: item.name,
    };
  });

  return (
    <>
      {Options && (
        <MultiSelect
          className="   fill-none"
          options={Options}
          value={selected}
          onChange={onSelect}
          labelledBy="Select"
          disabled={disabled}
        />
      )}
    </>
  );
};

export default PermissionSelector;
