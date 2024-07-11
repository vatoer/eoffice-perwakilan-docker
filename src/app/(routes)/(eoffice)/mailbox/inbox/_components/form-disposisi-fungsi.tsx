// DisposisiFungsi.tsx
"use client";
import { Button } from "@/components/ui/button";
import { FungsiGroup } from "@/data/fungsi";
import {
  tbl_fungsi,
  tbl_fungsi_group,
  tbl_fungsi_group_anggota,
} from "@prisma-dbedispo/client";
import { Dispatch, SetStateAction, useState } from "react";
import { Checkbox, TICK_STATES } from "./checkbox";

interface DisposisiFungsiProps {
  fungsi: tbl_fungsi[];
  fungsiGroup: FungsiGroup[];
  checkedItems: { [key: string]: number };
  setCheckedItems: Dispatch<
    SetStateAction<{
      [key: string]: number;
    }>
  >;
  show?: string;
}

const DisposisiFungsi = ({
  fungsi,
  fungsiGroup,
  checkedItems,
  setCheckedItems,
  show,
}: DisposisiFungsiProps) => {
  const [displayFungsi, setDisplayFungsi] = useState(show ?? "fungsi");
  // const [checkedItems, setCheckedItems] = useState<{ [key: string]: number }>(
  //   {}
  // );

  const handleCheckboxChange = (id: string, value: number) => {
    const newValue =
      value === TICK_STATES.DOUBLE_CHECKED ? TICK_STATES.UNCHECKED : value + 1;
    setCheckedItems({
      ...checkedItems,
      [id]: newValue,
    });
    console.log("handleCheckboxChange", id, newValue);
  };

  // Function to get anggota from a specific group based on its id
  function getAnggotaById(groups: FungsiGroup[], groupId: number) {
    // Find the group with the specified id
    const group: FungsiGroup | undefined = groups.find(
      (group) => group.id === groupId
    );
    // Return anggota array of the group if found, otherwise return an empty array
    return group ? group.anggota : [];
  }

  //The setCheckedItems function is called with a callback, ensuring that we're working with the most up-to-date state. This approach prevents potential issues related to stale closures capturing the old state.
  const handleCheckboxChangeGroup = (id: string, value: number) => {
    // Find anggota fungsi from fungsiGroup
    const anggota = getAnggotaById(fungsiGroup, parseInt(id.split("_")[1]));
    //console.log("anggota", anggota);

    const newValue =
      value === TICK_STATES.DOUBLE_CHECKED ? TICK_STATES.UNCHECKED : value + 1;

    // Update the state of the group checkbox
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [id]: newValue,
    }));

    // Update the state of the anggota checkboxes
    anggota.forEach((anggotaItem) => {
      setCheckedItems((prevCheckedItems) => ({
        ...prevCheckedItems,
        ["f_" + anggotaItem.id_fungsi]: newValue,
      }));
    });

    console.log("handleCheckboxChangeGroup", id, newValue);
  };

  return (
    <div>
      <div className="flex flex-row gap-2">
        <Button
          variant={"ghost"}
          onClick={() => {
            setDisplayFungsi("group");
          }}
          className="rounded-none"
        >
          Group
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            setDisplayFungsi("fungsi");
          }}
          className="rounded-none"
        >
          Individu
        </Button>
      </div>
      <div>
        {displayFungsi === "fungsi" &&
          fungsi.map((element) => (
            <div key={element.fungsi_kd} className="flex flex-row border">
              <Checkbox
                id={"f_" + element.fungsi_kd.toString()}
                value={checkedItems["f_" + element.fungsi_kd] || 0}
                label={element.nama_fungsi}
                handleCheckboxChange={handleCheckboxChange}
              />
            </div>
          ))}
        {displayFungsi === "group" &&
          fungsiGroup.map((element) => (
            <div key={element.id} className="flex flex-row  border">
              <Checkbox
                id={"fg_" + element.id.toString()}
                value={checkedItems["fg_" + element.id.toString()] || 0}
                label={element.nama}
                handleCheckboxChange={handleCheckboxChangeGroup}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default DisposisiFungsi;
