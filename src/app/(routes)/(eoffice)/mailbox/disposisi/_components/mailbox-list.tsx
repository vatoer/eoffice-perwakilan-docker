"use client";
import { InboxDisposisi } from "@/data/disposisi";
import { useSearchTerm } from "@/hooks/use-search-term";
import { useToggleFormDispo } from "@/hooks/use-toggle-form-dispo";
import { cn } from "@/lib/utils";
import { tbl_fungsi, tbl_instruksi } from "@prisma-dbedispo/client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  VariableSizeList as List,
  ListChildComponentProps,
} from "react-window";
import LembarDisposisi from "./lembar-disposisi";
import MailListItem from "./mail-list-item";
import ModalLembarDistribusi from "./modal-lembar-disposisi";

interface MailboxListProps {
  user_fungsi_kd: number;
  inbox: InboxDisposisi[];
  fungsi: tbl_fungsi[];
  instruksi: tbl_instruksi[];
}

// Custom hook to handle window resize and list height calculation
const useWindowHeight = (offset: number) => {
  const [height, setHeight] = useState(0);

  const updateHeight = useCallback(() => {
    if (typeof window !== "undefined") {
      setHeight(window.innerHeight - offset);
    }
  }, [offset]);

  useEffect(() => {
    updateHeight();
  }, [updateHeight]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateHeight);
      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, [updateHeight]);

  return height;
};

const MailboxList = ({
  user_fungsi_kd,
  inbox,
  fungsi,
  instruksi,
}: MailboxListProps) => {
  const { searchTerm } = useSearchTerm();
  const listRef = useRef<List>(null);
  const listHeight = useWindowHeight(82);
  const { onOff, toggle } = useToggleFormDispo();

  // Filter the inbox based on the search term
  const filteredInbox = inbox.filter((mail) => {
    if (!searchTerm || searchTerm === "") return true;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const searchWords = lowercasedSearchTerm.split(" ").filter(Boolean);

    return searchWords.every(
      (word) =>
        mail.berita_kd?.toLowerCase().includes(word) ||
        mail.perihal_berita?.toLowerCase().includes(word) ||
        mail.arsip_kd?.toLowerCase().includes(word) ||
        mail.perwakilan_nama?.toLowerCase().includes(word)
    );
  });

  // Reference to store the dynamic heights of each item
  const itemHeights = useRef(new Map<number, number>());

  const getItemSize = (index: number) => {
    // Return the height of the item, or a default value if the height is not known
    return itemHeights.current.get(index) || 100;
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const mail = filteredInbox[index];

    // Callback to measure the height of the item
    const measureRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (node !== null) {
          const height = node.getBoundingClientRect().height;
          itemHeights.current.set(index, height);
          listRef.current?.resetAfterIndex(index);
        }
      },
      [index]
    );

    return (
      <div style={style}>
        <div ref={measureRef}>
          <MailListItem key={mail.arsip_kd} mail={mail} />
        </div>
      </div>
    );
  };

  // This effect triggers a re-render when the searchTerm changes
  useEffect(() => {
    listRef.current?.resetAfterIndex(0);
  }, [searchTerm]);

  return (
    <>
      <ModalLembarDistribusi onOff={onOff} toggle={toggle}>
        <LembarDisposisi
          user_fungsi_kd={user_fungsi_kd}
          fungsi={fungsi}
          instruksi={instruksi}
          className={cn(
            "md:hidden p-4",
            "top-1/2 left-1/2",
            "transform -translate-x-1/2 -translate-y-1/2",
            "overflow-y-auto overflow-x-hidden",
            "h-[calc(100vh-200px)]", // Adjust height calculation if necessary
            "bg-slate-200",
            "w-[calc(100vw-100px)]", // Adjust width calculation if necessary
            "z-60 absolute"
          )}
        />
      </ModalLembarDistribusi>
      <div className="overflow-y-auto overflow-x-hidden h-[calc(100vh-82px)]">
        <Suspense fallback={<div>Loading...</div>}>
          <List
            ref={listRef}
            height={listHeight} // Full viewport height minus header
            itemCount={filteredInbox.length}
            itemSize={getItemSize}
            width="100%"
          >
            {Row}
          </List>
        </Suspense>
      </div>
    </>
  );
};

export default MailboxList;
