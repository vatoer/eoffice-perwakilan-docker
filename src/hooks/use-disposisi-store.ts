import type { InboxDisposisi } from "@/data/disposisi";
import { create } from "zustand";

interface InboxDisposisiStore {
  inboxDisposisi: InboxDisposisi | null;
  setInboxDisposisi: (
    inboxDisposisi:
      | InboxDisposisi
      | ((prevState: InboxDisposisi | null) => InboxDisposisi)
  ) => void;
}

export const useInboxDisposisiStore = create<InboxDisposisiStore>((set) => ({
  inboxDisposisi: null,
  setInboxDisposisi: (inboxDisposisi) =>
    set((state) => ({
      inboxDisposisi:
        typeof inboxDisposisi === "function"
          ? inboxDisposisi(state.inboxDisposisi)
          : inboxDisposisi,
    })),
}));
