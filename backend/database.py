import sqlite3
import datetime
import os
import sys
import json

def get_db_path():
    """Resolves the database path dynamically based on environment variable, config file, or default."""
    if os.environ.get('DATABASE_PATH'):
        return os.environ.get('DATABASE_PATH')
        
    # Check for config.json in the folder of the executable (if frozen) or the script directory
    exe_dir = os.path.dirname(sys.executable) if getattr(sys, 'frozen', False) else os.path.dirname(__file__)
    
    # Check in the executable directory
    config_path = os.path.join(exe_dir, 'config.json')
    
    # Also check parent directory (e.g. if running in dev from backend/ or frontend/ parent)
    if not os.path.exists(config_path):
        parent_dir = os.path.dirname(exe_dir)
        config_path_parent = os.path.join(parent_dir, 'config.json')
        if os.path.exists(config_path_parent):
            config_path = config_path_parent

    if os.path.exists(config_path):
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
                db_dir = config.get('database_directory')
                if db_dir:
                    return os.path.join(db_dir, 'candidates.db')
        except Exception as e:
            print(f"Error reading config.json: {e}")
            
    return os.path.join(exe_dir, 'candidates.db')

def get_db_connection():
    """Establishes a connection to the SQLite database."""
    db_path = get_db_path()
    
    # Ensure parent directory exists
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
        
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = 1")
    conn.row_factory = sqlite3.Row
    return conn

def check_and_seed_db():
    """Checks if the database is empty, and seeds it if it is."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if the jobs table is empty
        cursor.execute("SELECT COUNT(*) FROM jobs")
        count = cursor.fetchone()[0]
        if count == 0:
            print("Database is empty. Seeding default tables and values...")
            import seed
            seed.seed_jobs()
            seed.seed_companies_and_company_jobs()
            seed.seed_candidates()
            print("Seeding completed successfully.")
    except Exception as e:
        print(f"Error checking/seeding database: {e}")
    finally:
        conn.close()

def create_tables():
    """Creates the candidates, jobs, and companies tables if they don't exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS candidates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            skills TEXT,
            location TEXT,
            is_developer BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL UNIQUE COLLATE NOCASE,
            required_skills TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE COLLATE NOCASE,
            email TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS company_jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_id INTEGER,
            job_id INTEGER,
            salary TEXT,
            required_skills TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
            FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    conn.close()
    
    # Automatically seed the database if empty
    check_and_seed_db()

if __name__ == '__main__':
    create_tables()
    print("Database and tables created successfully.")
