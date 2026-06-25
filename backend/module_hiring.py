from data_candidates import CANDIDATES
from utils_common import extract_skills_from_text
import random

def find_top_candidates(job_description: str):
    """
    Finds and ranks candidates based on skill overlap with a job description.
    """
    
    required_skills = extract_skills_from_text(job_description)
    
    if not required_skills:
        # If no skills are found, return a random subset of candidates
        random.shuffle(CANDIDATES)
        return {
            "required_skills": [],
            "top_candidates": CANDIDATES[:3]
        }

    scored_candidates = []
    for candidate in CANDIDATES:
        candidate_skills = set(s.lower() for s in candidate["skills"])
        matched_skills = required_skills.intersection(candidate_skills)
        missing_skills = list(required_skills - candidate_skills)
        
        # Simple scoring: percentage of required skills met
        score = 0
        if required_skills:
            score = round((len(matched_skills) / len(required_skills)) * 100)
            
        scored_candidates.append({
            **candidate,
            "matched_skills": list(matched_skills),
            "missing_skills": missing_skills,
            "match_score": score
        })
        
    # Sort by score, descending
    scored_candidates.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "required_skills": list(required_skills),
        "top_candidates": scored_candidates
    }