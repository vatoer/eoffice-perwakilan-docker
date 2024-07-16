SELECT * FROM tbl_cux tc WHERE tc.pendispo =""

UPDATE tbl_cux set pendispo = null 
WHERE pendispo =""

ALTER TABLE tbl_cux MODIFY COLUMN pendispo INT NULL;

-- pastikan selalu regenerate schema setiap ada perubahan di database
-- pnpm prisma generate --schema ./prisma/db-edispo/schema.prisma
