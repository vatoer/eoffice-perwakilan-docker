import { dbEdispo } from "@/lib/db-edispo";
import { Prisma, tbl_fungsi, tbl_user } from "@prisma-dbedispo/client";

interface User extends tbl_user, tbl_fungsi {
  id: string;
  username: string;
  email?: string;
  password: string;
  image: string;
  fungsi_kd: number;
  role: string;
  name: string;
  nama_lengkap: string;
}

export const getUser = async (username: string) => {
  const query = Prisma.sql`
  SELECT CAST(tu.user_kd AS CHAR) as id, 
    tu.user_kd as user_kd,
    tu.user_nama as username,
    tu.user_email as email,
    tu.user_namalengkap as nama_lengkap,
    tu.user_namalengkap as name,
    tu.user_password as password,
    tu.user_foto as image,
    tf.nama_fungsi as role,
    tf.*, tu.*
  FROM tbl_user tu 
  INNER JOIN tbl_fungsi tf ON tu.fungsi_kd = tf.fungsi_kd 
  WHERE tu.user_nama = ${username}`;
  const user = await dbEdispo.$queryRaw<User[]>(query);

  if (user.length === 0) {
    return null;
  }

  return user[0];
};
