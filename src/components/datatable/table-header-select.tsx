"use client";
import { cn } from "@/lib/utils";
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

interface IOption {
  value: string | undefined;
  label: string;
}

export const TableHeaderSelect = ({
  column,
  table,
  getOptionsUrl,
  label = "Options",
}: any) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | number>();

  const { data, isLoading } = useFetch(getOptionsUrl);
  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  const onSelect = (currentValue: string | number) => {
    console.log("currentValue", currentValue);
    console.log("value", value);
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);
    table.options.meta?.changeAllOptions(column.id, newValue);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? data.find((option: IOption) => option.value === value)?.label
              : label}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search option..." />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {data.map((option: IOption) => (
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
    </div>
  );
};

export default TableHeaderSelect;
