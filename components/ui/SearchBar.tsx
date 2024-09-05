"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface Props {
  onSearch: (value: string | undefined) => void;
}

export function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState<string | undefined>();
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
      />
      <Button size="sm" onClick={() => onSearch(value)}>
        Search <Search className=" w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
