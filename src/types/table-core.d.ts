import { RowData } from "@tanstack/react-table";
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData?: (rowIndex: number, columnId: string, value: string) => void;
    toggleAllBoolean?: (columnId: string, value: boolean) => void;
    changeAllOptions?: (columnId: string, value: string | number) => void;
    getIsAllTrue?: (columnId: string) => boolean;
    getIsSomeTrue?: (columnId: string) => boolean;
  }
}
