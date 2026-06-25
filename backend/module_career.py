from data_roles import ROLES
from utils_common import extract_skills_from_text

def career_recommendation(resume_text: str, extra_skills):
    user_skills = set(extract_skills_from_text(resume_text) + extra_skills)
    
    recommended_roles = []
    for role in ROLES:
        required_skills = set(role.get("required_skills", []))
        matched_skills = user_skills.intersection(required_skills)
        missing_skills = list(required_skills - user_skills)
        
        score = 0
        if required_skills:
            score = round((len(matched_skills) / len(required_skills)) * 100)

        recommended_roles.append({
            "role_name": role["role_name"],
            "level": role["level"],
            "score": score,
            "missing_skills": missing_skills,
        })
    
    # Sort roles by score in descending order
    top_roles = sorted(recommended_roles, key=lambda x: x["score"], reverse=True)
    
    return {
        "all_detected_skills": list(user_skills),
        "top_roles": top_roles[:3] # Return top 3 roles
    }