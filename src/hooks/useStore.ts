import { create } from "zustand";
import { Row } from "../types";
import { persist } from "zustand/middleware";

export interface StoreState {
  rows: Row[];
  setRows: (newRows: Row[]) => void;
  editRow: (editedRow: Row) => void;
  deleteRows: (idsToDelete: string[]) => void;
}

const useRowsStore = create<StoreState>()(
  persist(
    (set, get) => ({
      rows: [],
      setRows: (newRows) => {
        set({ rows: newRows });
      },

      editRow: (editedRow: Row) =>
        set((state) => ({
          rows: state.rows.map((row) =>
            row.id === editedRow.id ? editedRow : row
          ),
        })),

      deleteRows: (idsToDelete) =>
        set((state) => ({
          rows: state.rows.filter((row) => !idsToDelete.includes(row.id)),
        })),
    }),
    {
      name: "fincat-rows",
    }
  )
);

export default useRowsStore;
