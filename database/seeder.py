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

# Menentukan DB_HOST yang sesuai dengan lingkungan
if 'DOCKER' in os.environ:  # Misalnya cek variabel lingkungan DOCKER
    DB_HOST = "db"  # Gunakan nama kontainer database dalam Docker
else:
    DB_HOST = os.getenv("DB_HOST", "localhost")  # Jika di lokal, gunakan localhost

print ("DB_HOST: ", DB_HOST)
# Mengatur koneksi ke PostgreSQL
conn = None
cursor = None
try:
    # Koneksi ke PostgreSQL (tanpa database untuk membuatnya)
    conn = psycopg2.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    conn.autocommit = True

    # Membuat cursor
    cursor = conn.cursor()

    # Membuat database 
    cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}';")
    exists = cursor.fetchone()
    if exists:
        cursor.execute(f"DROP DATABASE {DB_NAME};")
        print(f"Database '{DB_NAME}' telah dihapus.")

    # Membuat database baru
    cursor.execute(f"CREATE DATABASE {DB_NAME};")
    print(f"Database '{DB_NAME}' berhasil dibuat.")

    # Menutup cursor dan koneksi awal
    cursor.close()
    conn.close()

    # Koneksi ke database baru
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    conn.autocommit = True
    print(f"Berhasil terhubung ke database '{DB_NAME}'.")

    # Membuat cursor
    cursor = conn.cursor()

    # Membuat sequence
    sequences = [
        'genres_genre_id_seq',
        'awards_award_id_seq',
        'actors_actor_id_seq',
        'users_user_id_seq',
        'movies_movie_id_seq',
        'comments_comment_id_seq'
    ]

    for sequence in sequences:
        cursor.execute(f"CREATE SEQUENCE IF NOT EXISTS {sequence};")

    # Membuat tipe data enum
    cursor.execute("CREATE TYPE role_enum AS ENUM ('USER', 'ADMIN');")
    cursor.execute("CREATE TYPE approval_status_enum AS ENUM ('UNAPPROVED', 'APPROVED');")
    cursor.execute("CREATE TYPE release_status_enum AS ENUM ('ONGOING', 'COMPLETED', 'UPCOMING');")

    # Membuat tabel-tabel
    tables = {
        "countries": """
        CREATE TABLE countries (
            country_id VARCHAR(10) PRIMARY KEY,
            country_name VARCHAR(255) NOT NULL,
            flag_url TEXT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );
        """,
        "genres": """
        CREATE TABLE genres (
            genre_id INT PRIMARY KEY DEFAULT nextval('genres_genre_id_seq'),
            genre_name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );
        """,
        "awards": """
        CREATE TABLE awards (
            award_id INT PRIMARY KEY DEFAULT nextval('awards_award_id_seq'),
            award_name VARCHAR(255) NOT NULL,
            year INT NOT NULL,
            country_id VARCHAR(10),
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE RESTRICT
        );
        """,
        "actors": """
        CREATE TABLE actors (
            actor_id INT PRIMARY KEY DEFAULT nextval('actors_actor_id_seq'),
            actor_name VARCHAR(255) NOT NULL,
            birth_date DATE,
            foto_url TEXT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );
        """,
        "platforms": """
        CREATE TABLE platforms (
            platform_id VARCHAR(10) PRIMARY KEY,
            platform_name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );
        """,
        "users": """
        CREATE TABLE users (
            user_id INT PRIMARY KEY DEFAULT nextval('users_user_id_seq'),
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password TEXT,
            role role_enum NOT NULL,
            foto_profil_url TEXT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            is_suspended BOOLEAN DEFAULT FALSE
        );
        """,
        "movies": """
        CREATE TABLE movies (
            movie_id INT PRIMARY KEY DEFAULT nextval('movies_movie_id_seq'),
            poster_url TEXT,
            title VARCHAR(255) NOT NULL,
            alternative_title VARCHAR(255),
            movie_rate NUMERIC(3, 1),
            views INT,
            year INT NOT NULL,
            synopsis TEXT,
            release_status release_status_enum,
            approval_status approval_status_enum,
            link_trailer TEXT,
            country_id VARCHAR(10),
            user_id INT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE RESTRICT,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT
        );
        """,
        "acted_in": """
        CREATE TABLE acted_in (
            movie_id INT,
            actor_id INT,
            PRIMARY KEY (movie_id, actor_id),
            FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE RESTRICT,
            FOREIGN KEY (actor_id) REFERENCES actors(actor_id) ON DELETE RESTRICT
        );
        """,
        "awarded": """
        CREATE TABLE awarded (
            movie_id INT,
            award_id INT,
            PRIMARY KEY (movie_id, award_id),
            FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE RESTRICT,
            FOREIGN KEY (award_id) REFERENCES awards(award_id) ON DELETE RESTRICT
        );
        """,
        "categorized_as": """
        CREATE TABLE categorized_as (
            movie_id INT,
            genre_id INT,
            PRIMARY KEY (movie_id, genre_id),
            FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE RESTRICT,
            FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE RESTRICT
        );
        """,
        "available_on": """
        CREATE TABLE available_on (
            movie_id INT,
            platform_id VARCHAR(10),
            PRIMARY KEY (movie_id, platform_id),
            FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE RESTRICT,
            FOREIGN KEY (platform_id) REFERENCES platforms(platform_id) ON DELETE RESTRICT
        );
        """,
        "comments": """
        CREATE TABLE comments (
            comment_id INT PRIMARY KEY DEFAULT nextval('comments_comment_id_seq'),
            comment_rate NUMERIC(3, 1) NOT NULL,
            detail_comment TEXT,
            approval_status approval_status_enum,
            created_time TIMESTAMP,
            updated_at TIMESTAMP,
            user_id INT,
            movie_id INT,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
            FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE RESTRICT
        );
        """,
        "wishlists": """
        CREATE TABLE wishlists (
            movie_id INT,
            user_id INT,
            PRIMARY KEY (movie_id, user_id),
            FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE RESTRICT,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT
        );
        """
    }

    # Eksekusi perintah pembuatan tabel
    for table_name, create_statement in tables.items():
        cursor.execute(create_statement)
    
    # Menambahkan fungsi trigger untuk menghitung ulang movie_rate
    cursor.execute("""
    CREATE OR REPLACE FUNCTION update_movie_rate()
    RETURNS TRIGGER AS $$
    BEGIN
        -- Update movie_rate dengan rata-rata comment_rate dari semua komentar untuk movie_id yang bersangkutan
        UPDATE movies
        SET movie_rate = (
            SELECT AVG(comment_rate) 
            FROM comments 
            WHERE movie_id = NEW.movie_id
        )
        WHERE movie_id = NEW.movie_id;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    """)

    # Membuat trigger yang memanggil fungsi update_movie_rate setiap kali ada insert pada comments
    cursor.execute("""
    CREATE TRIGGER trigger_update_movie_rate
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_movie_rate();
    """)

    print("Tables and trigger successfully created.")

    # Menambahkan indexing untuk kolom yang sering diakses
    cursor.execute("CREATE INDEX idx_movies_year ON movies(year);")
    cursor.execute("CREATE INDEX idx_movies_country_id ON movies(country_id);")
    cursor.execute("CREATE INDEX idx_movies_user_id ON movies(user_id);")
    cursor.execute("CREATE INDEX idx_movies_title ON movies(title);")
    cursor.execute("CREATE INDEX idx_awards_year ON awards(year);")
    cursor.execute("CREATE INDEX idx_comments_movie_id ON comments(movie_id);")
    cursor.execute("CREATE INDEX idx_users_username ON users(username);")
    cursor.execute("CREATE INDEX idx_countries_country_name ON countries(country_name);")
    cursor.execute("CREATE INDEX idx_genres_genre_name ON genres(genre_name);")
    cursor.execute("CREATE INDEX idx_actors_actor_name ON actors(actor_name);")
    cursor.execute("CREATE INDEX idx_platforms_platform_name ON platforms(platform_name);")
    cursor.execute("CREATE INDEX idx_awarded_award_id ON awarded(award_id);")
    cursor.execute("CREATE INDEX idx_acted_in_actor_id ON acted_in(actor_id);")
    cursor.execute("CREATE INDEX idx_categorized_as_genre_id ON categorized_as(genre_id);")
    cursor.execute("CREATE INDEX idx_available_on_platform_id ON available_on(platform_id);")
    cursor.execute("CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);")

    # Membaca data dari file Excel
    file_path = 'data.xlsx'  # Ganti dengan path file Excel yang sesuai

    # Membaca masing-masing sheet dan insert data
    sheets = [
        'countries', 'genres', 'awards', 'platforms', 'users', 'movies', 'actors',
        'acted_in', 'awarded', 'categorized_as', 'available_on', 'comments', 'wishlists'
    ]

    for sheet in sheets:
        df = pd.read_excel(file_path, sheet_name=sheet)

        # Mengganti NaN dengan None
        df = df.replace({np.nan: None})

        # Mengonversi tipe data numerik ke tipe Python standar
        for col in df.select_dtypes([np.int64, np.float64]).columns:
            df[col] = df[col].astype(object)

        for index, row in df.iterrows():
            if sheet == 'countries':
                cursor.execute("INSERT INTO countries (country_id, country_name, flag_url, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)",
                               (row['country_id'], row['country_name'], row['flag_url'], row['created_at'], row['updated_at']))
            elif sheet == 'genres':
                cursor.execute("INSERT INTO genres (genre_id, genre_name, created_at, updated_at) VALUES (%s, %s, %s, %s)",
                               (row['genre_id'], row['genre_name'], row['created_at'], row['updated_at']))
            elif sheet == 'awards':
                cursor.execute("INSERT INTO awards (award_id, award_name, year, country_id, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s)",
                               (row['award_id'], row['award_name'], row['year'], row['country_id'], row['created_at'], row['updated_at']))
            elif sheet == 'actors':
                cursor.execute("INSERT INTO actors (actor_id, actor_name, birth_date, foto_url, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s)",
                               (row['actor_id'], row['actor_name'], row['birth_date'], row['foto_url'], row['created_at'], row['updated_at']))
            elif sheet == 'platforms':
                cursor.execute("INSERT INTO platforms (platform_id, platform_name, created_at, updated_at) VALUES (%s, %s, %s, %s)",
                               (row['platform_id'], row['platform_name'], row['created_at'], row['updated_at']))
            elif sheet == 'users':
                cursor.execute("INSERT INTO users (user_id, username, email, password, role, foto_profil_url, created_at, updated_at, is_suspended) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                               (row['user_id'], row['username'], row['email'], row['password'], row['role'], row['foto_profil_url'], row['created_at'], row['updated_at'], row['is_suspended']))
            elif sheet == 'movies':
                cursor.execute("INSERT INTO movies (movie_id, poster_url, title, alternative_title, movie_rate, views, year, synopsis, release_status, approval_status, link_trailer, country_id, user_id, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                               (row['movie_id'], row['poster_url'], row['title'], row['alternative_title'], row['movie_rate'], row['views'], row['year'], row['synopsis'], row['release_status'], row['approval_status'], row['link_trailer'], row['country_id'], row['user_id'], row['created_at'], row['updated_at']))
            elif sheet == 'acted_in':
                cursor.execute("INSERT INTO acted_in (movie_id, actor_id) VALUES (%s, %s)",
                               (row['movie_id'], row['actor_id']))
            elif sheet == 'awarded':
                cursor.execute("INSERT INTO awarded (movie_id, award_id) VALUES (%s, %s)",
                               (row['movie_id'], row['award_id']))
            elif sheet == 'categorized_as':
                cursor.execute("INSERT INTO categorized_as (movie_id, genre_id) VALUES (%s, %s)",
                               (row['movie_id'], row['genre_id']))
            elif sheet == 'available_on':
                cursor.execute("INSERT INTO available_on (movie_id, platform_id) VALUES (%s, %s)",
                               (row['movie_id'], row['platform_id']))
            elif sheet == 'comments':
                cursor.execute("INSERT INTO comments (comment_rate, detail_comment, approvalstatus, created_time, updated_at, user_id, movie_id) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                               (row['comment_rate'], row['detail_comment'], row['approvalstatus'], row['created_time'], row['updated_at'], row['user_id'], row['movie_id']))
            elif sheet == 'wishlists':
                cursor.execute("INSERT INTO wishlists (movie_id, user_id) VALUES (%s, %s)",
                               (row['movie_id'], row['user_id']))

    # Memperbarui sequence berdasarkan nilai maksimum dari kolom ID yang relevan
    sequences = {
        'genres_genre_id_seq': 'genres',
        'awards_award_id_seq': 'awards',
        'actors_actor_id_seq': 'actors',
        'users_user_id_seq': 'users',
        'movies_movie_id_seq': 'movies',
        'comments_comment_id_seq': 'comments'
    }

    for sequence_name, table_name in sequences.items():
        cursor.execute(f"SELECT COALESCE(MAX({table_name[:-1]}_id), 0) FROM {table_name};")
        max_id = cursor.fetchone()[0]
        cursor.execute(f"SELECT setval('{sequence_name}', {max_id + 1}, false);")
    
    # Menyimpan perubahan dan menutup koneksi
    conn.commit()
    cursor.close()
    conn.close()

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # Menutup cursor dan koneksi
    if cursor:
        cursor.close()
    if conn:
        conn.close()