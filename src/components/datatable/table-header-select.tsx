"use client";
import { useState } from "react";

import { useFetch } from "@/hooks/use-fetch";
import SelectPendispo from "@simbra/eximcux/_components/select-pendispo";

interface Option {
  value: number | string;
  label: string;
}

export const TableHeaderSelect = ({
  column,
  table,
  getOptionsUrl,
  label = "Options",
}: any) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | null>(null);

  const { data, isLoading } = useFetch(getOptionsUrl);
  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  const onChange = (currentValue: number | null) => {
    console.log("selected", currentValue);
    console.log("current value", value);
    //const newValue = currentValue === value ? "" : currentValue;
    setValue(currentValue);
    setOpen(false);
    table.options.meta?.changeAllOptions(column.id, currentValue);
  };

  return (
    <div>
      <SelectPendispo defaultValue={value} onChange={onChange} />
    </div>
  );
};

export default TableHeaderSelect;
