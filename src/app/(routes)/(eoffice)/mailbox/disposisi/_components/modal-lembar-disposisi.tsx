import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ModalLembarDistribusiProps {
  onOff: boolean;
  toggle: () => void;
  children: React.ReactNode;
}

const ModalLembarDistribusi = ({
  onOff,
  toggle,
  children,
}: ModalLembarDistribusiProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true); // Once data is loaded or component renders, set isLoaded to true
  }, [children]); // Assuming children is what triggers the content change

  return (
    <div
      className={cn(
        "md:hidden absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-gray-900 bg-opacity-85 z-50 flex justify-center items-center",
        !onOff && "hidden"
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative bg-white rounded-lg",
          "overflow-y-auto overflow-x-hidden",
          "h-[calc(100vh-200px)]",
          "w-[calc(100vw-100px)]",
          "z-60 absolute",
          !isLoaded && "hidden" // Hide the modal until the content is loaded
        )}
      >
        <div className="md:hidden p-4">{children}</div>
        <Button
          onClick={toggle}
          className="absolute top-1 right-1 text-gray-700 border-gray-300 p-2 bg-white z-50 border-2"
        >
          <X size={24} />
        </Button>
      </div>
    </div>
  );
};

export default ModalLembarDistribusi;
