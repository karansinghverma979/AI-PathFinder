from typing import List, Optional
from pydantic import BaseModel
import datetime

class CareerRequest(BaseModel):
    resume_text: str
    extra_skills: List[str] = []

class Candidate(BaseModel):
    name: str
    email: str
    skills: str
    location: str

class CandidateOut(Candidate):
    id: int
    is_developer: Optional[bool] = False
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class Job(BaseModel):
    id: Optional[int] = None
    title: str
    required_skills: str

class Company(BaseModel):
    name: str
    email: str

class CompanyJobBase(BaseModel):
    salary: str
    required_skills: str

class CompanyJobCreate(CompanyJobBase):
    job_id: int

class CompanyJob(CompanyJobBase):
    id: int
    company_id: int
    job_id: int

    class Config:
        from_attributes = True

class CompanyWithJobs(Company):
    id: int
    jobs: List[CompanyJob] = []

    class Config:
        from_attributes = True
        
class SkillMatchRequest(BaseModel):
    skills: List[str]



