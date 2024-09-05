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
import { ILicenseType } from "@/types/user"; // Import the LicenseType interface
import { GET } from "@/lib/client/client";
import { tokenFromSession } from "@/lib/tokenFromSession";

type Props = {
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

const LicenseTypeSelect = (props: Props) => {
  const token = tokenFromSession();
  const { onChange, value, placeholder, disabled } = props;

  const {
    data: licenseTypeResponse,
    isLoading,
    isError,
  } = useQuery<ILicenseType[]>({
    queryKey: ["licenseTypes"],
    queryFn: () => GET("/license-type/list",{},token),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading license types</div>;

  return (
    <Select
      onValueChange={onChange}
      value={value}
      disabled={disabled}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder ?? "Select a License type"}>
            {licenseTypeResponse?.find((licenseType) => licenseType.id === value)?.name ?? placeholder ?? "Select a License type"}
          </SelectValue>
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {licenseTypeResponse?.map((licenseType) => (
          <SelectItem key={licenseType.id} value={licenseType.id}>
            {licenseType.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { LicenseTypeSelect };
