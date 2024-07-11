"use client";
import { Outbox } from "@/data/outbox";
import { useSearchTerm } from "@/hooks/use-search-term";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  VariableSizeList as List,
  ListChildComponentProps,
} from "react-window";
import OutboxListItem from "./outbox-list-item";

interface OutboxListProps {
  outbox: Outbox[];
  userRole: string;
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

const OutboxList = ({ outbox, userRole }: OutboxListProps) => {
  const { searchTerm } = useSearchTerm();
  const listRef = useRef<List>(null);
  const listHeight = useWindowHeight(82);

  const filteredOutbox = outbox.filter((mail) => {
    if (!searchTerm || searchTerm === "") return true;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const searchWords = lowercasedSearchTerm.split(" ").filter(Boolean);

    return searchWords.every(
      (word) =>
        mail.berita_kd?.toLowerCase().includes(word) ||
        mail.perihal_berita?.toLowerCase().includes(word) ||
        mail.arsip_kd?.toLowerCase().includes(word)
    );
  });

  // Reference to store the dynamic heights of each item
  const itemHeights = useRef(new Map<number, number>());

  const getItemSize = (index: number) => {
    // Return the height of the item, or a default value if the height is not known
    return itemHeights.current.get(index) || 100;
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const mail = filteredOutbox[index];

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
          <OutboxListItem key={mail.arsip_kd} mail={mail} userRole={userRole} />
        </div>
      </div>
    );
  };

  // This effect triggers a re-render when the searchTerm changes
  useEffect(() => {
    listRef.current?.resetAfterIndex(0);
  }, [searchTerm]);

  return (
    <div className="overflow-y-auto overflow-x-hidden h-[calc(100vh-82px)]">
      <List
        ref={listRef}
        height={listHeight} // Full viewport height minus header
        itemCount={filteredOutbox.length}
        itemSize={getItemSize}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};

export default OutboxList;
