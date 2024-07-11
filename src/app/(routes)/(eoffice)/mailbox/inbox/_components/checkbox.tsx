// Checkbox.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BiCheck, BiCheckDouble } from "react-icons/bi";

interface CheckboxProps {
  id: string;
  value: number;
  label: string;
  handleCheckboxChange?: (id: string, value: number) => void;
  className?: string;
}

export const TICK_STATES = {
  UNCHECKED: 0,
  CHECKED: 1,
  DOUBLE_CHECKED: 2,
};

export const Checkbox = ({
  id,
  value,
  label,
  handleCheckboxChange,
  className,
}: CheckboxProps) => {
  const handleClick = () => {
    handleCheckboxChange && handleCheckboxChange(id, value);
  };

  return (
    <Button
      className={cn(
        "flex flex-row w-full justify-start items-start rounded-none pl-1 h-auto",
        className && className
      )}
      variant={"ghost"}
      onClick={handleClick}
    >
      <div
        className={cn(
          "flex border w-6 h-6 bg-gray-100 border-gray-400 rounded-sm cursor-pointer flex-shrink-0 justify-start items-start",
          value > TICK_STATES.UNCHECKED && "bg-blue-500 text-white"
        )}
      >
        {value === TICK_STATES.CHECKED && <BiCheck className="w-full h-full" />}
        {value === TICK_STATES.DOUBLE_CHECKED && (
          <BiCheckDouble className="w-full h-full" />
        )}
      </div>

      <span className="text-sm text-wrap text-left items-start px-1">
        {label}
      </span>
    </Button>
  );
};

export default Checkbox;
