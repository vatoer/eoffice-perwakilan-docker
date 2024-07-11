import { dbEdispo } from "@/lib/db-edispo";
import { Prisma, tbl_fungsi, tbl_user } from "@prisma-dbedispo/client";

export interface User extends tbl_user, tbl_fungsi {
  id: string;
  username: string;
  name: string;
  email?: string;
  password: string;
  image: string;
  fungsi_kd: number;
  role: string;
}

export const getUser = async (user_kd: number) => {
  const query = Prisma.sql`
  SELECT CAST(tu.user_kd AS CHAR) as id, 
    tu.user_kd as user_kd,
    tu.user_nama as username,
    tu.user_email as email,
    tu.user_namalengkap as name,
    tu.user_password as password,
    tu.user_foto as image,
    tf.nama_fungsi as role,
    tf.*, tu.*
  FROM tbl_user tu 
  INNER JOIN tbl_fungsi tf ON tu.fungsi_kd = tf.fungsi_kd 
  WHERE tu.user_kd = ${user_kd}`;
  const users = await dbEdispo.$queryRaw<User[]>(query);

  if (users.length === 0) {
    return null;
  }

  return users[0];
};

export const getUserByUsername = async (username: string) => {
  const query = Prisma.sql`
  SELECT CAST(tu.user_kd AS CHAR) as id, 
    tu.user_kd as user_kd,
    tu.user_nama as username,
    tu.user_email as email,
    tu.user_namalengkap as name,
    tu.user_password as password,
    tu.user_foto as image,
    tf.nama_fungsi as role,
    tf.*, tu.*
  FROM tbl_user tu 
  INNER JOIN tbl_fungsi tf ON tu.fungsi_kd = tf.fungsi_kd 
  WHERE tu.user_nama = ${username}`;
  const users = await dbEdispo.$queryRaw<User[]>(query);

  if (users.length === 0) {
    return null;
  }

  return users[0];
};

export const getUsers = async () => {
  const query = Prisma.sql`
  SELECT CAST(tu.user_kd AS CHAR) as id, 
    tu.user_kd as user_kd,
    tu.user_nama as username,
    tu.user_email as email,
    tu.user_namalengkap as name,
    tu.user_password as password,
    tu.user_foto as image,
    tf.nama_fungsi as role,
    tf.*, tu.*
  FROM tbl_user tu 
  INNER JOIN tbl_fungsi tf ON tu.fungsi_kd = tf.fungsi_kd`;
  const users = await dbEdispo.$queryRaw<User[]>(query);

  return users;
};
