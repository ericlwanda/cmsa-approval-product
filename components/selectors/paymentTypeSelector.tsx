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

const PaymentTypeSelect = (props: Props) => {
  const token = tokenFromSession();
  const { onChange, value, placeholder, disabled } = props;

  const {
    data: paymentTypeResponse,
    isLoading,
    isError,
  } = useQuery<ILicenseType[]>({
    queryKey: ["paymentTypes"],
    queryFn: () => GET("/payment-type/list",token),
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
            {paymentTypeResponse?.find((paymentType) => paymentType.id === value)?.name ?? placeholder ?? "Select a License type"}
          </SelectValue>
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {paymentTypeResponse?.map((paymentType) => (
          <SelectItem key={paymentType.id} value={paymentType.id}>
            {paymentType.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { PaymentTypeSelect };
