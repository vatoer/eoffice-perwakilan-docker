"use server";
import { User } from "./user";

// apakah nantinya perlu dari database ?

export const extractPermissions = async (user: User) => {
  const permissions: string[] = [];

  permissions.push("read:penomoran");
  permissions.push("write:penomoran");
  permissions.push("read:api-files"); // sehingga perlu di apinya di check ulang untuk setiap akses file

  if (user.user_menerima_disposisi === "Y") {
    permissions.push("read:disposisi");
  }

  if (user.home_staff === "Y") {
    permissions.push("read:outbox");
  }

  if (user.fungsi_input === "Y") {
    permissions.push("read:inbox");
    permissions.push("write:inbox");
  }

  if (user.disposisi_fungsi === "Y") {
    permissions.push("read:inbox");
  }

  return permissions;
};

export const getAdminPermissions = async () => {
  const permissions: string[] = [];
  permissions.push("read:penomoran");
  permissions.push("write:penomoran");
  permissions.push("read:inbox");
  permissions.push("write:inbox");
  permissions.push("read:disposisi");
  permissions.push("read:outbox");
  permissions.push("write:outbox");
  permissions.push("read:simbra");
  permissions.push("write:simbra");
  permissions.push("read:api-files");
  return permissions;
};
