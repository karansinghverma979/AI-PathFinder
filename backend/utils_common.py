import re
from typing import List, Tuple
from data_roles import SKILL_LIST

def extract_skills_from_text(text: str) -> List[str]:
    text_lower = text.lower()
    found = set()

    for skill in SKILL_LIST:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text_lower):
            found.add(skill.lower())

    return list(found)
