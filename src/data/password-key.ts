import { dbEdispo } from "@/lib/db-edispo";
export interface EncKey {
  user_key: string;
  admin_key: string;
}
export const getActiveKeyForToday = async (): Promise<EncKey | null> => {
  const today = new Date();
  try {
    const activeKey = await dbEdispo.tbl_enc_key.findFirst({
      where: {
        AND: [
          {
            start_date: {
              lte: today, // start_date is less than or equal to today
            },
          },
          {
            end_date: {
              gte: today, // end_date is greater than or equal to today
            },
          },
        ],
      },
    });

    if (!activeKey) {
      //console.error("No active key found for today");
      return null;
    }

    if (!activeKey.user_key || !activeKey.admin_key) {
      console.error("User or admin key not found");
      return null;
    }

    const { user_key, admin_key } = activeKey;

    return { user_key, admin_key };
  } catch (error) {
    console.error("Error retrieving active key:", error);
    throw error;
  } finally {
    await dbEdispo.$disconnect();
  }
};
