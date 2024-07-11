import FormRow from "@/components/form/form-row";
import { Controller, useFormContext } from "react-hook-form";
import Select, { SingleValue } from "react-select";

interface FormRowJenisProps {
  fullKey: string;
}

interface Option {
  value: string;
  label: string;
}

const FormRowJenis = ({ fullKey }: FormRowJenisProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const options: Option[] = [
    { value: "bapk", label: "BAPK" },
    { value: "nodin", label: "Nota Dinas - nodin" },
    { value: "nodip", label: "Nota Diplomatik - nodip" },
    { value: "sk", label: "Surat Keputusan - SK" },
    { value: "sppd", label: "Surat Perintah Perjalanan Dinas - SPPD" },
    { value: "suket", label: "Surat keterangan - suket" },
    { value: "surat-keluar", label: "Surat Keluar" },
    { value: "surtug", label: "Surat Tugas - surtug" },
  ];

  return (
    <FormRow errors={errors} fullKey={fullKey} label="Jenis Dokumen" ignoreFor>
      <Controller
        name={fullKey}
        control={control}
        render={({ field }) => (
          <Select
            instanceId={fullKey}
            {...field}
            options={options}
            isClearable
            onChange={(option: SingleValue<Option>) =>
              field.onChange(option ? option.value : null)
            }
            value={
              options.find((option) => option.value === field.value) || null
            }
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value.toString()}
            filterOption={(option, inputValue) =>
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        )}
      />
    </FormRow>
  );
};

export default FormRowJenis;
