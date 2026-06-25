import sqlite3
import datetime
import random
import os
from database import create_tables, get_db_connection

def seed_jobs():
    """Seeds the jobs table with sample data."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    jobs = [
        ("Software Engineer", "Python, Django, JavaScript, React"),
        ("Frontend Developer", "HTML, CSS, JavaScript, React, Redux"),
        ("Backend Developer", "Python, FastAPI, Node.js, Express.js, PostgreSQL, MongoDB"),
        ("Full Stack Developer", "Python, JavaScript, React, Node.js, SQL, NoSQL"),
        ("Data Scientist", "Python, R, SQL, TensorFlow, PyTorch, Scikit-learn"),
        ("Machine Learning Engineer", "Python, TensorFlow, PyTorch, Keras, AWS, Azure"),
        ("DevOps Engineer", "Docker, Kubernetes, Jenkins, AWS, Terraform, Ansible"),
        ("QA Engineer", "Selenium, Cypress, Jest, PyTest"),
        ("UI/UX Designer", "Figma, Sketch, Adobe XD, Prototyping"),
        ("Product Manager", "Agile, Scrum, JIRA, Roadmapping"),
        ("Data Analyst", "SQL, Excel, Tableau, Power BI"),
        ("Cloud Engineer", "AWS, Azure, Google Cloud, Docker, Kubernetes"),
        ("Mobile App Developer", "React Native, Flutter, Swift, Kotlin"),
        ("Cybersecurity Analyst", "Nmap, Wireshark, Metasploit, Python"),
        ("Database Administrator", "MySQL, PostgreSQL, MongoDB, Oracle"),
        ("Systems Architect", "Microservices, Distributed Systems, Cloud Architecture"),
        ("Network Engineer", "Cisco, Juniper, TCP/IP, BGP"),
        ("Business Analyst", "SQL, Requirements Gathering, BPMN"),
        ("Scrum Master", "Scrum, Agile, JIRA, Coaching"),
        ("Technical Writer", "Markdown, Confluence, API Documentation"),
        ("Blockchain Developer", "Solidity, Ethereum, Web3.js"),
        ("Game Developer", "C++, Unreal Engine, Unity"),
        ("Embedded Systems Engineer", "C, C++, RTOS"),
        ("Site Reliability Engineer", "Python, Go, Kubernetes, Prometheus"),
        ("Security Engineer", "Python, Cryptography, Network Security"),
        ("Solutions Architect", "AWS, Azure, GCP, System Design"),
        ("AI Specialist", "Python, PyTorch, NLP, Computer Vision"),
        ("AR/VR Developer", "Unity, Unreal Engine, C#"),
        ("Quantum Computing Scientist", "Python, Qiskit"),
        ("IoT Engineer", "Python, C++, MQTT, Raspberry Pi")
    ]
    
    try:
        cursor.executemany(
            """
            INSERT INTO jobs (title, required_skills, created_at, updated_at)
            VALUES (?, ?, ?, ?)
            """,
            [(job[0], job[1], datetime.datetime.now(), datetime.datetime.now()) for job in jobs]
        )
        conn.commit()
        print(f"Seeded jobs table with {len(jobs)} entries.")
    except sqlite3.IntegrityError:
        print("Jobs table already seeded.")
    except Exception as e:
        print(f"Error seeding jobs: {e}")
        conn.rollback()
    finally:
        conn.close()

def seed_companies_and_company_jobs():
    """Seeds the companies and company_jobs tables with sample data."""
    conn = get_db_connection()
    cursor = conn.cursor()

    companies = [
        ("InnovateTech India", "contact@innovatetech.in"), ("Datawise Solutions", "hr@datawise.in"),
        ("CodeGenius Pvt. Ltd.", "careers@codegenius.co.in"), ("InfraCloud Technologies", "jobs@infracloud.in"),
        ("SecureNet Labs", "security@securenet.in"), ("AppVerse Mobile", "dev@appverse.in"),
        ("QuantumLeap AI", "research@quantumleap.ai"), ("Fintech Gurus", "recruitment@fintechgurus.in"),
        ("HealthCare Informatics", "info@healthcareinfo.in"), ("E-Com Express", "hiring@ecomexpress.in"),
        ("NextGen Gaming", "admin@nextgengaming.in"), ("EduSphere Learning", "contactus@edusphere.in"),
        ("GreenEnergy Innovations", "ceo@greenenergy.in"), ("AutoMatrix Robotics", "automation@automatrix.in"),
        ("MediaMoguls Entertainment", "press@mediamoguls.in"), ("BuildRight Construction", "projects@buildright.in"),
        ("TravelScape Adventures", "support@travelscape.in"), ("FoodieFiesta Online", "help@foodiefiesta.in"),
        ("LogiChain Supply", "ops@logichain.in"), ("StellarSpace Exploration", "missions@stellarspace.in"),
        ("BharatMakers", "makeinindia@bharatmakers.in"), ("DesiDevs", "devs@desi.io"),
        ("Himalayan Coders", "contact@himalayancoders.com"), ("Ganges Systems", "info@gangessystems.com"),
        ("Mumbai Software Co.", "hr@mumbaisoftware.co"), ("Delhi Digital", "connect@delhidigital.in"),
        ("Bangalore Techies", "jobs@bangaloretechies.com"), ("Chennai Innovations", "info@chennaiinnovations.in"),
        ("Kolkata Codeworks", "careers@kolkatacodeworks.com"), ("Pune Programmers", "contact@puneprogrammers.in")
    ]

    try:
        cursor.executemany(
            "INSERT INTO companies (name, email, created_at, updated_at) VALUES (?, ?, ?, ?)",
            [(c[0], c[1], datetime.datetime.now(), datetime.datetime.now()) for c in companies]
        )
        conn.commit()
        print(f"Seeded companies table with {len(companies)} entries.")
    except sqlite3.IntegrityError:
        print("Companies table already seeded.")
    except Exception as e:
        print(f"Error seeding companies: {e}")
        conn.rollback()
        conn.close()
        return

    try:
        cursor.execute("SELECT id FROM jobs")
        job_ids = [row['id'] for row in cursor.fetchall()]
        cursor.execute("SELECT id FROM companies")
        company_ids = [row['id'] for row in cursor.fetchall()]

        if not job_ids or not company_ids:
            print("No jobs or companies to associate.")
            return

        company_jobs = []
        for company_id in company_ids:
            num_jobs_to_add = random.randint(1, 3)
            for _ in range(num_jobs_to_add):
                job_id = random.choice(job_ids)
                salary = f"₹{random.randint(6, 25)} LPA"
                # For simplicity, using the job's default skills
                cursor.execute("SELECT required_skills FROM jobs WHERE id = ?", (job_id,))
                skills = cursor.fetchone()['required_skills']
                company_jobs.append((company_id, job_id, salary, skills, datetime.datetime.now(), datetime.datetime.now()))
        
        cursor.executemany(
            "INSERT INTO company_jobs (company_id, job_id, salary, required_skills, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            company_jobs
        )
        conn.commit()
        print(f"Seeded company_jobs table with {len(company_jobs)} entries.")
    except Exception as e:
        print(f"Error seeding company_jobs: {e}")
        conn.rollback()
    finally:
        conn.close()


def seed_candidates():
    """Seeds the candidates table with developer profiles and sample Indian candidates."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    developers = [
        {
            "name": "Karan Singh Verma",
            "email": "karansinghverma979@gmail.com",
            "skills": "FastAPI, React, Tailwind CSS, SQLite, Python, JavaScript, Framer Motion, Axios, Vite, Node.js, REST APIs, Git, Responsive Web Design",
            "location": "Developer",
            "is_developer": True
        },
        {
            "name": "Ankit Kushwaha",
            "email": "ankit485225@gmail.com",
            "skills": "Python, FastAPI, Django, Node.js, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, Microservices, System Design",
            "location": "Bhopal",
            "is_developer": True
        },
        {
            "name": "Akarshan Gupta",
            "email": "akarshang44@gmail.com",
            "skills": "React, TypeScript, Next.js, Redux Toolkit, Zustand, TailwindCSS, Framer Motion, Vite, Webpack, ESLint, UI/UX Design",
            "location": "Bhopal",
            "is_developer": True
        }
    ]

    candidates = [
        ("Priya Sharma", "priya.sharma@example.com", "Python, Django, JavaScript", "Mumbai"),
        ("Rohan Joshi", "rohan.joshi@example.com", "Java, Spring Boot, React", "Pune"),
        ("Ananya Reddy", "ananya.reddy@example.com", "C++, Unreal Engine, Game Development", "Hyderabad"),
        ("Vikram Singh", "vikram.singh@example.com", "Android, Kotlin, Java", "Delhi"),
        ("Sneha Patel", "sneha.patel@example.com", "iOS, Swift, Objective-C", "Ahmedabad"),
        ("Arjun Kumar", "arjun.kumar@example.com", "Ruby, Ruby on Rails, JavaScript", "Bangalore"),
        ("Diya Mehta", "diya.mehta@example.com", "PHP, Laravel, MySQL", "Jaipur"),
        ("Kabir Khan", "kabir.khan@example.com", "C#, .NET, Azure", "Kolkata"),
        ("Ishaan Sharma", "ishaan.sharma@example.com", "Go, Docker, Kubernetes", "Chennai"),
        ("Mira Kapoor", "mira.kapoor@example.com", "Scala, Akka, Spark", "Lucknow"),
        ("Aarav Gupta", "aarav.gupta@example.com", "Rust, WebAssembly, GraphQL", "Chandigarh"),
        ("Saanvi Desai", "saanvi.desai@example.com", "Dart, Flutter, Firebase", "Surat"),
        ("Advik Rao", "advik.rao@example.com", "R, Shiny, Statistics", "Indore"),
        ("Anika Nair", "anika.nair@example.com", "Perl, Bash, System Administration", "Kochi"),
        ("Vivaan Reddy", "vivaan.reddy@example.com", "Lua, Love2D, Game Design", "Visakhapatnam"),
        ("Zara Begum", "zara.begum@example.com", "MATLAB, Simulink, Control Systems", "Bhopal"),
        ("Reyansh Tripathi", "reyansh.tripathi@example.com", "Assembly, Embedded C, RTOS", "Nagpur"),
        ("Myra Verma", "myra.verma@example.com", "Haskell, Functional Programming", "Patna"),
        ("Krishna Yadav", "krishna.yadav@example.com", "Clojure, Datomic, Distributed Systems", "Agra"),
        ("Kiara Ahuja", "kiara.ahuja@example.com", "F#, .NET, Azure", "Ghaziabad"),
        ("Aarush Menon", "aarush.menon@example.com", "JavaScript, Vue.js, Node.js", "Kochi"),
        ("Ishita Singh", "ishita.singh@example.com", "Python, Pandas, NumPy", "Delhi"),
        ("Vihaan Kumar", "vihaan.kumar@example.com", "Angular, TypeScript, RxJS", "Bangalore"),
        ("Anvi Sharma", "anvi.sharma@example.com", "Swift, UIKit, SwiftUI", "Mumbai"),
        ("Shaurya Gupta", "shaurya.gupta@example.com", "Java, Hibernate, Spring", "Hyderabad"),
        ("Zoya Khan", "zoya.khan@example.com", "React Native, GraphQL, Apollo", "Pune"),
        ("Dhruv Patel", "dhruv.patel@example.com", "C, C++, Embedded Systems", "Ahmedabad"),
        ("Riya Reddy", "riya.reddy@example.com", "Kotlin, Android SDK, Coroutines", "Chennai"),
        ("Arnav Joshi", "arnav.joshi@example.com", "Go, Gin, GORM", "Jaipur"),
        ("Avani Desai", "avani.desai@example.com", "Elixir, Phoenix, OTP", "Surat")
    ]
    
    try:
        # Add developers
        for dev in developers:
            cursor.execute(
                """
                INSERT INTO candidates (name, email, skills, location, is_developer, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (dev["name"], dev["email"], dev["skills"], dev["location"], dev["is_developer"], datetime.datetime.now(), datetime.datetime.now())
            )
        print("Seeded developer candidates.")

        # Add regular candidates
        cursor.executemany(
            """
            INSERT INTO candidates (name, email, skills, location, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            [(c[0], c[1], c[2], c[3], datetime.datetime.now(), datetime.datetime.now()) for c in candidates]
        )
        print(f"Seeded regular candidates with {len(candidates)} entries.")
        conn.commit()
    except sqlite3.IntegrityError as e:
        print(f"Candidates table already seeded or contains unique constraint violations: {e}")
    except Exception as e:
        print(f"Error seeding candidates: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    # Construct the absolute path to the database file
    db_path = os.path.join(os.path.dirname(__file__), 'candidates.db')
    
    # Delete the database file if it exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database file: {db_path}")

    print("Starting database seeding process...")
    create_tables()
    seed_jobs()
    seed_companies_and_company_jobs()
    seed_candidates()
    print("Database seeding process completed.")