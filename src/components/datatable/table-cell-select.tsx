"use client";
import { Select } from "@/components/ui/select";
import { usePendispo } from "@/hooks/use-pendispo";
import { cn } from "@/lib/utils";
import { CellContext, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFetch } from "@/hooks/use-fetch";
import { Check, ChevronsUpDown } from "lucide-react";
import { any } from "zod";

export const TableCellSelect = ({
  getValue,
  row,
  column,
  table,
  getOptionsUrl,
}: any) => {
  const initialValue = getValue();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const { data, isLoading } = useFetch(getOptionsUrl);
  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  const onSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    table.options.meta?.updateData(row.index, column.id, currentValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data.find((option: any) => option.value === value)?.label
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search option..." />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {data.map((option: any) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={onSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TableCellSelect;
