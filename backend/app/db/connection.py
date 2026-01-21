import os
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from typing import Generator
import dotenv

dotenv.load_dotenv(".env")


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@db:5432/settings_db"
)

def get_db_params():
    ## Takes DB URL and splits into individual parameters, returns a dictionary of those parameters

    # Format: postgresql://user:password@host:port/dbname
    url = DATABASE_URL.replace("postgresql://", "")
    user_pass, host_port_db = url.split("@")
    user, password = user_pass.split(":")
    host_port, dbname = host_port_db.split("/")
    host, port = host_port.split(":")
    
    return {
        "host": host,
        "port": port,
        "user": user,
        "password": password,
        "dbname": dbname
    }

@contextmanager
def get_db_connection() -> Generator:
    ## Context manager for database connections

    conn = psycopg2.connect(**get_db_params(), cursor_factory=RealDictCursor)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()