"use client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface IButtonPrintDispoProps {
  id: string | null;
}

const ButtonPrintDispo = ({ id }: IButtonPrintDispoProps) => {
  const handleClick = () => {
    if (!id) return;
    console.log("Print Disposisi");
    // open new tab and print
    const printWindow = window.open(
      "/eximcux/inbox/lembar-disposisi/" + id,
      "_blank"
    );
    if (!printWindow) {
      return;
    }
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  return (
    <Button variant={"outline"} className="gap-2" onClick={handleClick}>
      <Printer />
      <span>Disposisi</span>
    </Button>
  );
};

export default ButtonPrintDispo;
