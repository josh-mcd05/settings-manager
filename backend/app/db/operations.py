import uuid
import json
from typing import Optional, Tuple, List
from app.db.connection import get_db_connection
from app.models.setting import Setting
from psycopg2 import errors as pg_errors 

def create_setting(data: dict) -> Setting:
    ## Creates a new setting and uploads to db
    setting_id = str(uuid.uuid4())
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO settings (id, data)
                VALUES (%s, %s)
                RETURNING id, data, created_at, updated_at
                """,
                (setting_id, json.dumps(data))
            )
            result = cur.fetchone()
            return Setting(**result)

def get_all_settings(page: int = 1, limit: int = 10) -> Tuple[List[Setting], int]:
    ## Gets paginated list of settings
    offset = (page - 1) * limit
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Get total count
            cur.execute("SELECT COUNT(*) as count FROM settings")
            total = cur.fetchone()['count']
            
            # Get paginated data
            cur.execute(
                """
                SELECT id, data, created_at, updated_at
                FROM settings
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
                """,
                (limit, offset)
            )
            results = cur.fetchall()
            settings = [Setting(**row) for row in results]
            
            return settings, total

def get_setting_by_id(setting_id: str) -> Optional[Setting]:
    ## Gets a specific setting using the ID
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, data, created_at, updated_at
                    FROM settings
                    WHERE id = %s
                    """,
                    (setting_id,)
                )
                result = cur.fetchone()
            
                if result:
                    return Setting(**result)
                return None
    except pg_errors.InvalidTextRepresentation:
        return None
    except Exception as e:
        raise 


def update_setting(setting_id: str, data: dict) -> Optional[Setting]:
    ## Updates an existing setting using the ID
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE settings
                    SET data = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                    RETURNING id, data, created_at, updated_at
                    """,
                    (json.dumps(data), setting_id)
                )
                result = cur.fetchone()
                
                if result:
                    return Setting(**result)
                return None
    except pg_errors.InvalidTextRepresentation:
        return None
    except Exception as e:
        raise

def delete_setting(setting_id: str) -> bool:
    ## Deletes a setting using the ID
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "DELETE FROM settings WHERE id = %s",
                    (setting_id,)
                )
                # Always return True for idempotency
                return True
    except pg_errors.InvalidTextRepresentation:
        return True
    except Exception as e:
        raise