# README

## CLONE

```sh
git clone https://github.com/vatoer/eoffice-perwakilan-docker.git
cd eoffice-perwakilan-docker
cp .env.dist .env
nano .env
```

ubah sesuai kebutuhan

```env
NODE_ENV="testing"

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
# https://www.prisma.io/docs/orm/reference/connection-urls
# https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding
# P@ssword become P%40ssword

DATABASE_URL_EDISPO="mysql://cuximporter:Cuxedisposisi2023@192.168.45.9:3306/db_edisposisi?schema=public"
DATABASE_URL_PENOMORAN="mysql://eoffice:e6cbea3ffd41c28643562eae22173f1c@192.168.45.110:3306/db_peminjaman?"

# sesuaikan dengan tabel di database
EDISPO_JENIS_KD_R=8
EDISPO_JENIS_KD_B=1

FILESERVER_URL="https://edispo.ambparis.local/fileserver"
FILESERVER_JWT="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZWRpc3BvLmFtYnBhcmlzLmxvY2FsIiwiYXVkIjoiaHR0cHM6XC9cL2ZpbGUtZWRpc3BvLmFtYnBhcmlzLmxvY2FsIiwiaWF0IjoxNzE3NzUxNjcyLCJuYmYiOjE3MTc3NTE2NzIsImV4cCI6MTc0OTI4NzY3MiwiZGF0YSI6eyJ1c2VybmFtZSI6ImVvZmZpY2UifX0.yMl9RCgSfN5eAiawSM43S-xAkIZvg6oApqIkOqbD3M4"

BASE_PATH_UPLOAD="/UPLOAD"
TMP_UPLOAD_PATH="/UPLOAD//TMP"
LEGACY_EDISPO_ENABLED=true
```

## CREATE FOLDER FOR UPLOADS

```sh
sudo mkdir /UPLOAD
sudo chmod -R 755 /UPLOAD
sudo chown -R komunikasi:komunikasi /UPLOAD
```

```sh
bash deploy.sh
```
