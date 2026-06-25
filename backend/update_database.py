
import sqlite3
import datetime
from database import create_tables

def get_db_connection():
    """Establishes a connection to the SQLite database."""
    conn = sqlite3.connect('candidates.db')
    conn.row_factory = sqlite3.Row
    return conn

def add_developer_candidates():
    """Adds or updates the developer candidates."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    developers = [
        {
            "name": "Ankit Kushwaha",
            "email": "ankit485225@gmail.com",
            "skills": "HTML, CSS, JavaScript, TypeScript, React, Angular, Vue.js, Next.js, Svelte, Node.js, Express.js, Python, Django, Flask, Java, Spring Boot, Ruby on Rails, MySQL, PostgreSQL, MongoDB, Redis, SQLite, REST, GraphQL, Jenkins, GitLab CI, GitHub Actions, Docker, Kubernetes, AWS, Azure, Google Cloud, Terraform, Ansible, Jest, PyTest, Cypress, Git, GitHub, Agile, Scrum",
            "location": "Developer"
        },
        {
            "name": "Akarshan Gupta",
            "email": "akarshang44@gmail.com",
            "skills": "HTML, CSS, JavaScript, TypeScript, React, Redux, Webpack, Babel, Node.js, Python, FastAPI, Django, Go, PostgreSQL, MongoDB, Cassandra, Elasticsearch, gRPC, WebSockets, TensorFlow, PyTorch, Scikit-learn, NLTK, SpaCy, Matplotlib, Seaborn, Microservices, Event-driven architecture, Caching, Load Balancing, Linux, Bash scripting, Vim, JIRA",
            "location": "Developer"
        }
    ]
    
    for dev in developers:
        try:
            cursor.execute("SELECT * FROM candidates WHERE email = ?", (dev["email"],))
            existing_candidate = cursor.fetchone()
            
            if existing_candidate:
                cursor.execute(
                    """
                    UPDATE candidates
                    SET name = ?, skills = ?, location = ?, updated_at = ?, is_developer = 1
                    WHERE email = ?
                    """,
                    (dev["name"], dev["skills"], dev["location"], datetime.datetime.now(), dev["email"]),
                )
                print(f"Updated developer profile for {dev['name']}.")
            else:
                cursor.execute(
                    """
                    INSERT INTO candidates (name, email, skills, location, is_developer, created_at, updated_at)
                    VALUES (?, ?, ?, ?, 1, ?, ?)
                    """,
                    (
                        dev["name"],
                        dev["email"],
                        dev["skills"],
                        dev["location"],
                        datetime.datetime.now(),
                        datetime.datetime.now(),
                    ),
                )
                print(f"Added developer profile for {dev['name']}.")
        except Exception as e:
            print(f"Error adding developer {dev['name']}: {e}")
            conn.rollback()
        else:
            conn.commit()
            
    conn.close()

if __name__ == '__main__':
    create_tables()
    add_developer_candidates()
    print("Database update process completed.")
