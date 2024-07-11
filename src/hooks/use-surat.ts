import { Inbox } from "@/data/inbox";
import { create } from "zustand";

interface InboxStore {
  inbox: Inbox | null;
  setInbox: (inbox: Inbox | null) => void;
}

export const useInbox = create<InboxStore>((set) => ({
  inbox: null,
  setInbox: (inbox) => set({ inbox }),
}));
