def analyze_resume(resume_text, jd):
    resume_text = resume_text.lower()
    jd_words = jd.lower().split()

    unique_words = list(set(jd_words))

    matches = [word for word in unique_words if word in resume_text]
    missing = [word for word in unique_words if word not in resume_text]

    score = int((len(matches) / len(unique_words)) * 100) if unique_words else 0

    # Role prediction
    if score > 80:
        role = "Senior Level"
    elif score > 60:
        role = "Mid Level"
    else:
        role = "Junior / Intern"

    # Hiring probability
    hiring_probability = score

    # Simple wording error detection
    common_errors = ["teh", "recieve", "adress"]
    errors_found = [word for word in common_errors if word in resume_text]

    return {
        "score": score,
        "matches": matches[:15],
        "missing": missing[:15],
        "role": role,
        "hiring_probability": hiring_probability,
        "errors": errors_found
    }