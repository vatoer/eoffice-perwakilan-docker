"use client";
import { Button } from "@/components/ui/button";
import { User } from "@/data/user";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// Define columns for the table
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "user_nama",
    header: "Username",
  },
  {
    accessorKey: "user_status",
    header: "Status",
  },
  {
    accessorKey: "user_namalengkap",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Lengkap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "fungsi.nama_fungsi",
    header: "Fungsi",
  },
  {
    accessorKey: "koordinator_fungsi",
    header: "Korfung",
  },
  {
    accessorKey: "user_menerima_disposisi",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Terima Disposisi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "user_email",
    header: "Email",
  },

  {
    accessorKey: "user_notifikasi_email",
    header: "Notifikasi Email",
  },
];
