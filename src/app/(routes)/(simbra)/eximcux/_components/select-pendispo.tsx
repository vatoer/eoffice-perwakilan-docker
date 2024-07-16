import { getFungsiPendispo } from "@/data/fungsi";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { v4 as uuidv4 } from "uuid";

interface Option {
  value: number;
  label: string;
}

interface SelectPendispoProps {
  onChange: (value: number | null) => void;
  defaultValue: number | null;
}

export const SelectPendispo = ({
  onChange,
  defaultValue,
}: SelectPendispoProps) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const optionsPendispo = await getFungsiPendispo();
      if (optionsPendispo) {
        const mappedOptions = optionsPendispo.map((pendispo) => ({
          value: pendispo.fungsi_kd,
          label: pendispo.nama_fungsi,
        }));
        setOptions(mappedOptions);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div>
      <Select
        instanceId={uuidv4()}
        options={options}
        isClearable
        onChange={(option: SingleValue<Option>) =>
          //onChange(option ? option.value : null)
          {
            console.log(option ? option.value : null);
            onChange(option ? option.value : null);
          }
        }
        value={options.find((option) => option.value === defaultValue) || null}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value.toString()}
        filterOption={(option, inputValue) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
    </div>
  );
};

export default SelectPendispo;
