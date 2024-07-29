SELECT * FROM tbl_cux tc WHERE tc.pendispo =""

UPDATE tbl_cux set pendispo = null 
WHERE pendispo =""

ALTER TABLE tbl_cux MODIFY COLUMN pendispo INT NULL;

-- pastikan selalu regenerate schema setiap ada perubahan di database
-- pnpm prisma generate --schema ./prisma/db-edispo/schema.prisma


ALTER TABLE db_edisposisi.tbl_berita_keluar MODIFY COLUMN berita_kd varchar(50) NOT NULL;

ALTER TABLE db_edisposisi.tbl_berita_keluar MODIFY COLUMN perihal_berita varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL NULL;

