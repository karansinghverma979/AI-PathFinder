from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import datetime
import sqlite3
import os
import sys
from typing import List

# Write debug logs to verify path resolution
log_file = r"C:\Users\karan\Void\AI PathFinder\F10_Popups_Karan_WebApp\debug_log.txt"
try:
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(f"\n--- Application Startup at {datetime.datetime.now()} ---\n")
        f.write(f"sys.executable: {sys.executable}\n")
        f.write(f"sys._MEIPASS: {getattr(sys, '_MEIPASS', 'Not Set')}\n")
        f.write(f"__file__: {__file__}\n")
        
        base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
        static_dir = os.path.join(base_path, "static")
        f.write(f"Resolved base_path: {base_path}\n")
        f.write(f"Resolved static_dir: {static_dir}\n")
        f.write(f"static_dir exists: {os.path.exists(static_dir)}\n")
        
        if os.path.exists(static_dir):
            f.write(f"Contents of static_dir: {os.listdir(static_dir)}\n")
            index_path = os.path.join(static_dir, "index.html")
            f.write(f"index.html exists: {os.path.exists(index_path)}\n")
            if os.path.exists(index_path):
                f.write(f"index.html size: {os.path.getsize(index_path)} bytes\n")
        else:
            f.write("static_dir does NOT exist!\n")
except Exception as e:
    pass

from database import create_tables, get_db_connection
from schemas import (
    Candidate, Job, Company, SkillMatchRequest,
    CompanyJob, CompanyJobCreate, CompanyWithJobs, CandidateOut
)
from module_career import career_recommendation
from module_learning import generate_learning_path
from module_hiring import find_top_candidates

# Create the database and tables on startup
create_tables()

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request bodies
class CareerRequest(BaseModel):
    resume_text: str
    extra_skills: list[str] = []

class LearningRequest(BaseModel):
    prompt: str

class HiringRequest(BaseModel):
    job_description: str

# Endpoints

# ... (Candidates and Jobs CRUD remain the same)

# Candidates CRUD
@app.get("/candidates", response_model=List[CandidateOut])
def get_candidates():
    """Retrieves all candidates from the database, ordered by last update time."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM candidates ORDER BY is_developer DESC, updated_at DESC")
    candidates_rows = cursor.fetchall()
    candidates_out = []
    for row in candidates_rows:
        candidates_out.append(CandidateOut(
            id=row['id'],
            name=row['name'],
            email=row['email'],
            skills=row['skills'],
            location=row['location'],
            is_developer=row['is_developer'],
            created_at=datetime.datetime.fromisoformat(row['created_at']),
            updated_at=datetime.datetime.fromisoformat(row['updated_at'])
        ))
    conn.close()
    return candidates_out

@app.post("/candidates")
def add_or_update_candidate(candidate: Candidate):
    """Adds a new candidate or updates an existing one based on email."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM candidates WHERE email = ?", (candidate.email,))
        existing_candidate = cursor.fetchone()
        if existing_candidate:
            if existing_candidate['is_developer']:
                raise HTTPException(status_code=403, detail="Developer profiles cannot be modified.")
            cursor.execute(
                """
                UPDATE candidates
                SET name = ?, skills = ?, location = ?, updated_at = ?
                WHERE email = ?
                """,
                (candidate.name, candidate.skills, candidate.location, datetime.datetime.now(), candidate.email),
            )
            conn.commit()
            return {"message": "Candidate updated successfully"}
        else:
            cursor.execute(
                """
                INSERT INTO candidates (name, email, skills, location, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    candidate.name,
                    candidate.email,
                    candidate.skills,
                    candidate.location,
                    datetime.datetime.now(),
                    datetime.datetime.now(),
                ),
            )
            conn.commit()
            return {"message": "Candidate added successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.put("/candidates/{candidate_id}")
def update_candidate(candidate_id: int, candidate: Candidate):
    """Updates an existing candidate by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if the candidate is a developer
        cursor.execute("SELECT is_developer FROM candidates WHERE id = ?", (candidate_id,))
        candidate_to_update = cursor.fetchone()

        if candidate_to_update and candidate_to_update['is_developer']:
            raise HTTPException(status_code=403, detail="Developer profiles cannot be modified.")

        cursor.execute(
            """
            UPDATE candidates
            SET name = ?, email = ?, skills = ?, location = ?, updated_at = ?
            WHERE id = ?
            """,
            (candidate.name, candidate.email, candidate.skills, candidate.location, datetime.datetime.now(), candidate_id),
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Candidate not found")
        return {"message": "Candidate updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: int):
    """Deletes a candidate by ID, with a check to prevent deleting developers."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if the candidate is a developer
        cursor.execute("SELECT is_developer FROM candidates WHERE id = ?", (candidate_id,))
        candidate_to_delete = cursor.fetchone()

        if candidate_to_delete and candidate_to_delete['is_developer']:
            raise HTTPException(status_code=403, detail="Developer profiles cannot be deleted.")
        
        if not candidate_to_delete:
            raise HTTPException(status_code=404, detail="Candidate not found")

        cursor.execute("DELETE FROM candidates WHERE id = ?", (candidate_id,))
        conn.commit()

        if cursor.rowcount == 0:
            # This case should be caught by the check above, but as a fallback
            raise HTTPException(status_code=404, detail="Candidate not found")
            
        return {"message": "Candidate deleted successfully"}
    except HTTPException as http_exc:
        # Re-raise HTTP exceptions to be handled by FastAPI
        raise http_exc
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Jobs CRUD
@app.post("/jobs", response_model=Job)
def create_job(job: Job):
    """Creates a new job."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO jobs (title, required_skills, created_at, updated_at)
            VALUES (?, ?, ?, ?)
            """,
            (job.title, job.required_skills, datetime.datetime.now(), datetime.datetime.now()),
        )
        conn.commit()
        new_job_id = cursor.lastrowid
        return {**job.dict(), "id": new_job_id}
    except sqlite3.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=409, detail="Job with this title already exists.")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/jobs", response_model=List[Job])
def get_jobs():
    """Retrieves all jobs from the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jobs ORDER BY updated_at DESC")
    jobs = cursor.fetchall()
    conn.close()
    return [dict(row) for row in jobs]

@app.get("/jobs/{job_id}", response_model=Job)
def get_job(job_id: int):
    """Retrieves a single job by its ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
    job = cursor.fetchone()
    conn.close()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return dict(job)
    
@app.get("/jobs/title/{job_title}", response_model=Job)
def get_job_by_title(job_title: str):
    """Retrieves a single job by its title (case-insensitive)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jobs WHERE title = ? COLLATE NOCASE", (job_title,))
    job = cursor.fetchone()
    conn.close()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return dict(job)

@app.put("/jobs/{job_id}")
def update_job(job_id: int, job: Job):
    """Updates an existing job."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            UPDATE jobs
            SET title = ?, required_skills = ?, updated_at = ?
            WHERE id = ?
            """,
            (job.title, job.required_skills, datetime.datetime.now(), job_id),
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": "Job updated successfully"}
    except sqlite3.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=409, detail="Job with this title already exists.")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int):
    """Deletes a job."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM jobs WHERE id = ?", (job_id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": "Job deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Companies CRUD (Refactored)
@app.post("/companies", response_model=Company)
def create_company(company: Company):
    """Creates a new unique company."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO companies (name, email, created_at, updated_at) VALUES (?, ?, ?, ?)",
            (company.name, company.email, datetime.datetime.now(), datetime.datetime.now())
        )
        conn.commit()
        new_company_id = cursor.lastrowid
        return {**company.dict(), "id": new_company_id}
    except sqlite3.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=409, detail=f"Company with name '{company.name}' already exists.")
    finally:
        conn.close()

@app.get("/companies", response_model=List[CompanyWithJobs])
def get_companies():
    """Retrieves all companies with their associated job requirements."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM companies ORDER BY name")
    companies = cursor.fetchall()
    
    companies_with_jobs = []
    for company in companies:
        company_dict = dict(company)
        cursor.execute("SELECT * FROM company_jobs WHERE company_id = ?", (company_dict['id'],))
        jobs = cursor.fetchall()
        company_dict['jobs'] = [dict(job) for job in jobs]
        companies_with_jobs.append(company_dict)
        
    conn.close()
    return companies_with_jobs

@app.put("/companies/{company_id}", response_model=Company)
def update_company(company_id: int, company: Company):
    """Updates a company's details."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE companies SET name = ?, email = ?, updated_at = ? WHERE id = ?",
            (company.name, company.email, datetime.datetime.now(), company_id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Company not found")
        return {**company.dict(), "id": company_id}
    except sqlite3.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=409, detail=f"Company with name '{company.name}' already exists.")
    finally:
        conn.close()

@app.delete("/companies/{company_id}")
def delete_company(company_id: int):
    """Deletes a company and all its job associations."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM companies WHERE id = ?", (company_id,))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Company not found")
    conn.close()
    return {"message": "Company deleted successfully"}

# Company-Job Association CRUD
@app.post("/companies/{company_id}/jobs", response_model=CompanyJob)
def add_job_to_company(company_id: int, job: CompanyJobCreate):
    """Adds a job requirement to a specific company."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO company_jobs (company_id, job_id, salary, required_skills, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (company_id, job.job_id, job.salary, job.required_skills, datetime.datetime.now(), datetime.datetime.now())
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {**job.dict(), "id": new_id, "company_id": company_id}

@app.put("/company_jobs/{company_job_id}", response_model=CompanyJob)
def update_company_job(company_job_id: int, job: CompanyJobCreate):
    """Updates a specific job requirement for a company."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        UPDATE company_jobs SET job_id = ?, salary = ?, required_skills = ?, updated_at = ?
        WHERE id = ?
        """,
        (job.job_id, job.salary, job.required_skills, datetime.datetime.now(), company_job_id)
    )
    conn.commit()
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Company job link not found")
    
    cursor.execute("SELECT * FROM company_jobs WHERE id = ?", (company_job_id,))
    updated_job = cursor.fetchone()
    conn.close()
    return dict(updated_job)

@app.delete("/company_jobs/{company_job_id}")
def delete_company_job(company_job_id: int):
    """Deletes a specific job requirement from a company."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM company_jobs WHERE id = ?", (company_job_id,))
    conn.commit()
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Company job link not found")
    conn.close()
    return {"message": "Company job link deleted successfully"}


# Other endpoints from the original application

@app.post("/match_candidates")
def match_candidates(request: SkillMatchRequest):
    """Matches candidates based on a list of skills."""
    conn = get_db_connection()
    cursor = conn.cursor()
    matching_candidates = []
    try:
        # Construct a WHERE clause to check for any matching skill
        skill_conditions = [f"LOWER(skills) LIKE '%{skill.strip().lower()}%'" for skill in request.skills]
        if not skill_conditions:
            return [] # No skills provided, no candidates match

        where_clause = " OR ".join(skill_conditions)
        query = f"SELECT * FROM candidates WHERE {where_clause} ORDER BY updated_at DESC"
        
        cursor.execute(query)
        candidates = cursor.fetchall()
        matching_candidates = [dict(row) for row in candidates]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
    return matching_candidates

@app.post("/match_jobs")
def match_jobs(request: SkillMatchRequest):
    """Matches jobs based on a list of skills, including company information, with refined scoring."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        user_skills = [s.strip().lower() for s in request.skills if s.strip()]
        if not user_skills:
            return []

        # Fetch all jobs to perform refined matching
        cursor.execute("SELECT id, title, required_skills FROM jobs")
        all_jobs = cursor.fetchall()
        
        job_matches = []
        for job in all_jobs:
            job_id = job['id']
            job_title = job['title'].lower()
            job_skills_raw = job['required_skills'].split(',')
            job_skills = [s.strip().lower() for s in job_skills_raw if s.strip()]
            
            if not job_skills:
                continue

            matched_count = 0
            partial_matches = 0
            
            for u_skill in user_skills:
                # Exact match
                if u_skill in job_skills:
                    matched_count += 1
                else:
                    # Partial match (e.g., "Python" matches "Python Scripting")
                    for j_skill in job_skills:
                        if u_skill in j_skill or j_skill in u_skill:
                            partial_matches += 0.5
                            break
            
            total_matches = matched_count + partial_matches
            base_score = (total_matches / len(job_skills)) * 100
            
            # Title relevance bonus (20% weight)
            title_bonus = 0
            for u_skill in user_skills:
                if u_skill in job_title:
                    title_bonus += 15
            
            # Penalize missing skills slightly to differentiate high matches
            penalty = (len(job_skills) - total_matches) * 2
            
            final_score = min(max(base_score + title_bonus - penalty, 0), 100)

            if final_score > 15: # Threshold to filter noise
                 job_matches.append({
                    "job_id": job_id,
                    "title": job['title'],
                    "job_required_skills": job['required_skills'],
                    "match_score": round(final_score, 2),
                    "companies": []
                })

        if not job_matches:
            return []

        # Sort by score and take top 15
        job_matches = sorted(job_matches, key=lambda x: x['match_score'], reverse=True)[:15]
        job_ids = [j['job_id'] for j in job_matches]

        company_query = f"""
            SELECT
                c.id AS company_id,
                c.name AS company_name,
                c.email AS company_email,
                cj.job_id,
                cj.salary,
                cj.required_skills
            FROM companies c
            JOIN company_jobs cj ON c.id = cj.company_id
            WHERE cj.job_id IN ({','.join('?' for _ in job_ids)})
        """
        cursor.execute(company_query, job_ids)
        company_rows = cursor.fetchall()

        # Map companies to their jobs
        job_map = {j['job_id']: j for j in job_matches}
        for row in company_rows:
            jid = row['job_id']
            if jid in job_map:
                job_map[jid]['companies'].append({
                    "id": row['company_id'],
                    "name": row['company_name'],
                    "email": row['company_email'],
                    "salary": row['salary'],
                    "required_skills": row['required_skills']
                })

        return [j for j in job_matches if j['companies']]

    except Exception as e:
        print(f"Error in match_jobs: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/career")
def career_api(data: CareerRequest):
    return career_recommendation(
        resume_text=data.resume_text,
        extra_skills=data.extra_skills
    )

@app.post("/learning")
def learning_api(data: LearningRequest):
    return generate_learning_path(data.prompt)

@app.post("/hiring")
def hiring_api(data: HiringRequest):
    return find_top_candidates(data.job_description)

# Serve Frontend static assets in production
base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
static_dir = os.path.join(base_path, "static")

if os.path.exists(static_dir):
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    def serve_index():
        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend files not found"}

    @app.get("/{path_name:path}")
    def serve_frontend(path_name: str):
        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend files not found"}

if __name__ == '__main__':
    import uvicorn
    import threading
    import socket
    import webview

    def find_free_port(start_port=8000):
        for p in range(start_port, start_port + 100):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    s.bind(('127.0.0.1', p))
                    return p
                except OSError:
                    continue
        return start_port

    port = find_free_port(8000)

    # Start FastAPI server in a background thread
    server_thread = threading.Thread(
        target=uvicorn.run, 
        args=(app,), 
        kwargs={"host": "127.0.0.1", "port": port, "log_level": "info"}, 
        daemon=True
    )
    server_thread.start()

    # Wait for uvicorn to bind and start listening
    import time
    server_ready = False
    for _ in range(50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.connect(('127.0.0.1', port))
                server_ready = True
                break
            except Exception:
                time.sleep(0.1)
                
    if not server_ready:
        print("Warning: FastAPI server failed to start in time.")

    # Create native Windows application window using WebView2
    print(f"Opening AI-PathFinder in desktop window (http://127.0.0.1:{port})...")
    webview.create_window(
        title="AI-PathFinder", 
        url=f"http://127.0.0.1:{port}", 
        width=1280, 
        height=800,
        resizable=True,
        min_size=(1024, 700)
    )
    webview.start()
