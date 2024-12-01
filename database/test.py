import pandas as pd
import psycopg2
import numpy as np
from dotenv import load_dotenv
import os

# Load environment variables from .env
success = load_dotenv("/app/database/.env")

# Jika gagal, coba muat .env lokal
if not success:
    print("Menggunakan .env lokal")
    load_dotenv()

# Mengambil data koneksi dari file .env
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")

print ("DB_HOST: ", DB_HOST)

# Koneksi ke database PostgreSQL
conn = psycopg2.connect(
    user=DB_USER,
    password=DB_PASSWORD,
    port=DB_PORT,
    database=DB_NAME,
    host=DB_HOST
)

# Membuat objek cursor untuk eksekusi query
cursor = conn.cursor()

# Print semua tabel yang ada di database
cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")

# Query untuk menambah kolom
add_columns_query = """
ALTER TABLE users
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_token VARCHAR(5),
ADD COLUMN verification_token_expiration TIMESTAMP,
ADD COLUMN reset_password_token VARCHAR(5),
ADD COLUMN reset_token_expiration TIMESTAMP;
"""

# Eksekusi query untuk menambah kolom
cursor.execute(add_columns_query)
print("Kolom berhasil ditambahkan.")

# Query untuk menghapus user dengan user_id antara 1002 dan 1006
delete_users_query = """
DELETE FROM users
WHERE user_id BETWEEN 1002 AND 1006;
"""

# Eksekusi query untuk menghapus user
cursor.execute(delete_users_query)
print("User dengan ID antara 1002 dan 1006 berhasil dihapus.")

# Menyimpan perubahan
conn.commit()

# Menutup cursor dan koneksi
cursor.close()
conn.close()
