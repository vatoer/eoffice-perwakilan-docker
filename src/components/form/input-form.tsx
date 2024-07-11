import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

export interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  register: UseFormRegister<any>;
  name: string;
  error: FieldError | undefined;
  className?: string;
}

const InputForm = ({
  label,
  register,
  name,
  error,
  type = "text",
  className,
  ...rest
}: InputFormProps) => {
  return (
    <>
      <div className={cn("flex flex-col w-full mb-2", className && className)}>
        <label htmlFor={name} className="text-sm">
          {label}
        </label>
        <input
          type={type}
          id={name}
          {...register(name)}
          className={cn(
            "form-control block w-full px-1 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none peer"
          )}
          {...rest}
        />

        {error && <span className="text-red-500">{error.message}</span>}
      </div>
    </>
  );
};

export default InputForm;
