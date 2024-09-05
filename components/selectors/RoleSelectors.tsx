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
import { IRole } from "@/types/user"; // Import the Role interface
import { GET } from "@/lib/client/client";

type Props = {
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

const RoleSelect = (props: Props) => {
  // const token = tokenFromSession();
  const { onChange, value, placeholder, disabled } = props;


 // Hard-coded roles
const roleResponse: IRole[] = [
  { id: 1, name: "ADMIN" },
  { id: 2, name: "CEO" },
  { id: 3, name: "DLAE" },
  { id: 4, name: "MLAE" },
  { id: 5, name: "SLO" },
  { id: 6, name: "SFA" },
  { id: 7, name: "SICTO" },
  { id: 8, name: "FO" },
  { id: 9, name: "REGISTRY" },
];

  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder ?? "Select a Role"}>
            {roleResponse?.find((role) => role.name === value)?.name ?? ""}
          </SelectValue>
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {roleResponse?.map((role, i) => ( // Iterate through roleResponse correctly
          <SelectItem key={i} value={role.name}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};


export { RoleSelect };
