"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import TableCellCheckbox from "@/components/datatable/table-cell-checkbox";
import TableCellSelect from "@/components/datatable/table-cell-select";
import TableCellTextarea from "@/components/datatable/table-cell-textarea";
import TableHeaderCheckbox from "@/components/datatable/table-header-checkbox";
import TableHeaderSelect from "@/components/datatable/table-header-select";

export type BeritaMasuk = {
  ID: string;
  KD_BERITA: string;
  PERIHAL_BERITA: string;
  DERAJAT: string;
  TANGGAL: string;
  NAMA_PERWAKILAN: string;
  IDDISTRIBUSI: string;
  KODE_PENGIRIM: string;
  NOMOR_KONSEP: string;
  NO_AGENDA: string;
  RAHASIA: string;
  IS_DISPOSISI: boolean;
  PENDISPO: string | number;
};

export const columns: ColumnDef<BeritaMasuk>[] = [
  {
    header: "Line",
    accessorKey: "ID",
  },
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="hidden xl:flex items-center justify-between gap-x-1 ">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         //onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //       <span>Impor?</span>
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div
  //       className="hidden xl:flex  h-[70px] w-[70px] -mx-2 px-2 cursor-pointer hover:bg-blue-700 hover:rounded-full hover:text-white hover:opacity-75 items-center text-start justify-start gap-x-1"
  //       onClick={() => row.toggleSelected()}
  //     >
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         //onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //       {row.getIsSelected() ? "Ya" : "Tidak"}
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    header: "NOMOR",
    accessorKey: "KD_BERITA",
  },
  {
    header: "PERIHAL",
    accessorKey: "PERIHAL_BERITA",
    cell: ({ getValue, row, column, table }) =>
      TableCellTextarea({ getValue, row, column, table, rows: 3, cols: 50 }),
  },

  {
    header: ({ column, table }) =>
      TableHeaderCheckbox({ column, table, label: "Disposisi?" }),
    accessorKey: "IS_DISPOSISI",
    cell: ({ getValue, row, column, table }) =>
      TableCellCheckbox({
        getValue,
        row,
        column,
        table,
        label: ["Dispo", "Tidak"],
      }),
  },
  {
    header: ({ column, table }) =>
      TableHeaderSelect({
        column,
        table,
        getOptionsUrl: "/api/edispo/pendispo",
        label: "Pilih Pendispo",
      }),
    accessorKey: "PENDISPO",
    cell: ({ getValue, row, column, table }) => {
      return TableCellSelect({
        getValue,
        row,
        column,
        table,
        label: "Pendispo",
        getOptionsUrl: "/api/edispo/pendispo",
      });
    },
  },

  // {
  //   header: "DERAJAT",
  //   accessorKey: "DERAJAT",
  // },
  // {
  //   header: "TANGGAL",
  //   accessorKey: "TANGGAL",
  // },
  {
    accessorKey: "NAMA_PERWAKILAN",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PENGIRIM
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      );
    },
  },
  // {
  //   header: "IDDISTRIBUSI",
  //   accessorKey: "IDDISTRIBUSI",
  // },
  // {
  //   header: "KODE_PENGIRIM",
  //   accessorKey: "KODE_PENGIRIM",
  // },
  // {
  //   header: "NOMOR_KONSEP",
  //   accessorKey: "NOMOR_KONSEP",
  // },
  // {
  //   accessorKey: "NO_AGENDA",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant={"ghost"}
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         AGENDA
  //         <ArrowUpDown className="w-4 h-4" />
  //       </Button>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "RAHASIA",
  //   cell: ({ row }) => {
  //     if (row.original.RAHASIA == "1") {
  //       return "Rahasia";
  //     } else return "Biasa";
  //   },
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant={"ghost"}
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         RAHASIA
  //         <ArrowUpDown className="w-4 h-4" />
  //       </Button>
  //     );
  //   },
  // },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex flex-row space-x-2">
  //         <Button
  //           className="btn btn-sm btn-primary"
  //           onClick={() => {
  //             console.log(row.original);
  //           }}
  //         >
  //           <Edit2 className="w-4 h-4" />
  //         </Button>
  //         {/* <Button
  //           variant="destructive"
  //           onClick={() => {
  //             console.log(row.original);
  //           }}
  //         >
  //           <Trash2 className="w-4 h-4" />
  //         </Button> */}
  //       </div>
  //     );
  //   },
  // },
];
