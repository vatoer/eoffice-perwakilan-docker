"use client";
import { tbl_instruksi } from "@prisma-dbedispo/client";
import { Dispatch, SetStateAction, useState } from "react";
import { Checkbox, TICK_STATES } from "./checkbox";

interface DisposisiInstruksiProps {
  instruksi: tbl_instruksi[];
  checkedItems: { [key: string]: number };
  setCheckedItems: Dispatch<
    SetStateAction<{
      [key: string]: number;
    }>
  >;
}

const DisposisiInstruksi = ({
  instruksi,
  checkedItems,
  setCheckedItems,
}: DisposisiInstruksiProps) => {
  // const [checkedItems, setCheckedItems] = useState<{ [key: string]: number }>(
  //   {}
  // );

  const handleCheckboxChange = (id: string, value: number) => {
    const newValue =
      value === TICK_STATES.UNCHECKED
        ? TICK_STATES.CHECKED
        : TICK_STATES.UNCHECKED;
    setCheckedItems({
      ...checkedItems,
      [id]: newValue,
    });
    console.log("handleCheckboxChange", id, newValue);
  };

  return (
    <div>
      {instruksi.map((element) => (
        <div
          key={element.instruksi_kd}
          className="flex flex-row justify-start items-start border"
        >
          <Checkbox
            id={"instruksi_" + element.instruksi_kd}
            value={checkedItems["instruksi_" + element.instruksi_kd] || 0}
            label={element.instruksi_nama}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      ))}
    </div>
  );
};

export default DisposisiInstruksi;
