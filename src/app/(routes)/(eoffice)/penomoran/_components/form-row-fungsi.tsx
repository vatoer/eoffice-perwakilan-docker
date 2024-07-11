import FormRow from "@/components/form/form-row";
import { getFungsi } from "@/data/penomoran/fungsi";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, { ActionMeta, SingleValue } from "react-select";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique IDs

interface FormRowFungsiProps {
  fullKey: string;
  label: string;
}

interface Option {
  value: number;
  label: string;
}

export const FormRowFungsi = ({ fullKey, label }: FormRowFungsiProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState(""); // Step 1: Add state for input value
  const [instanceId] = useState(uuidv4()); // Generate a unique instanceId

  useEffect(() => {
    const fetchOptions = async () => {
      const optionFungsiPengirim = await getFungsi();
      if (optionFungsiPengirim) {
        const mappedOptions = optionFungsiPengirim.map((fungsi) => ({
          value: fungsi.id_fungsi,
          label: fungsi.nama_fungsi,
        }));
        setOptions(mappedOptions);
      }
    };

    fetchOptions();
  }, []);

  // suppress exhaustive-deps warning

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log(`Component with fullKey ${fullKey} has options:`, options);
    console.log(
      `Component with fullKey ${fullKey} has instanceId:`,
      instanceId
    );
  }, [options, instanceId, fullKey]);

  return (
    <FormRow errors={errors} fullKey={fullKey} label={label} ignoreFor>
      <Controller
        name={fullKey}
        control={control}
        render={({ field }) => (
          <Select
            instanceId={instanceId}
            options={options}
            isClearable
            closeMenuOnSelect
            onChange={(
              option: SingleValue<Option>,
              actionMeta: ActionMeta<Option>
            ) => {
              const newValue = option?.value || null;
              field.onChange(newValue);
              setInputValue(""); // Optionally reset input value on select for single select
            }}
            onInputChange={(value, actionMeta) => {
              if (actionMeta.action === "input-change") {
                setInputValue(value); // Step 2: Update input value on change
              }
            }}
            inputValue={inputValue} // Step 3: Control input value
            value={
              options.find((option) => option.value === field.value) || null
            }
            filterOption={(option, inputValue) =>
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            onBlur={() => setInputValue("")} // Step 4: Reset input on dropdown close
          />
        )}
      />
    </FormRow>
  );
};

export default FormRowFungsi;
