"use client";
import { useEffect, useState } from "react";

import { useFetch } from "@/hooks/use-fetch";
import SelectPendispo from "@simbra/eximcux/_components/select-pendispo";

export const TableCellSelect = ({
  getValue,
  row,
  column,
  table,
  getOptionsUrl,
}: any) => {
  const initialValue = getValue();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    console.log("initialValue", initialValue);
    setValue(initialValue);
  }, [initialValue]);

  const { data, isLoading } = useFetch(getOptionsUrl);
  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  const onSelect = (currentValue: number | null) => {
    setValue(currentValue);
    setOpen(false);
    table.options.meta?.updateData(row.index, column.id, currentValue);
  };

  return <SelectPendispo defaultValue={value} onChange={onSelect} />;
};

export default TableCellSelect;
