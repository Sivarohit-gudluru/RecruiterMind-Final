SKILL_DB = {

    "Cloud": [
        "aws",
        "azure",
        "gcp",
        "s3",
        "lambda"
    ],

    "Backend": [
        "python",
        "java",
        "node",
        "api",
        "django",
        "flask",
        "fastapi"
    ],

    "Frontend": [
        "react",
        "html",
        "css",
        "javascript",
        "tailwind"
    ],

    "Devops": [
        "docker",
        "kubernetes",
        "ci/cd",
        "jenkins",
        "github actions"
    ],

    "Database": [
        "sql",
        "mysql",
        "mongodb",
        "postgresql",
        "firebase"
    ],

    "AI ML": [
        "machine learning",
        "deep learning",
        "nlp",
        "tensorflow",
        "pytorch",
        "scikit-learn"
    ]
}


def analyze_resume(
    resume_text,
    jd
):

    # NORMALIZATION

    resume_text = (
        resume_text.lower()
    )

    jd = jd.lower()

    matched_skills = []
    missing_skills = []

    section_scores = {}

    total_score = 0
    sections_used = 0

    # SECTION ANALYSIS

    for category, skills in SKILL_DB.items():

        jd_skills = [

            skill

            for skill in skills

            if skill in jd
        ]

        if not jd_skills:

            continue

        matched = [

            skill

            for skill in jd_skills

            if skill in resume_text
        ]

        missing = [

            skill

            for skill in jd_skills

            if skill not in resume_text
        ]

        matched_skills.extend(
            matched
        )

        missing_skills.extend(
            missing
        )

        section_score = int(

            (
                len(matched)
                /
                len(jd_skills)
            ) * 100

        )

        section_scores[
            category
        ] = section_score

        total_score += (
            section_score
        )

        sections_used += 1

    # FINAL SCORE

    overall_score = int(

        total_score
        /
        sections_used

    ) if sections_used else 0

    # RECOMMENDATION

    if overall_score >= 85:

        recommendation = (
            "Excellent Fit"
        )

    elif overall_score >= 70:

        recommendation = (
            "Good Fit"
        )

    elif overall_score >= 55:

        recommendation = (
            "Potential Fit"
        )

    else:

        recommendation = (
            "Low Match"
        )

    # ROLE ESTIMATION

    if overall_score >= 85:

        role = (
            "Senior Level"
        )

    elif overall_score >= 65:

        role = (
            "Mid Level"
        )

    else:

        role = (
            "Junior / Intern"
        )

    # REMOVE DUPLICATES

    strong = list(

        dict.fromkeys(
            matched_skills[:6]
        )

    )

    medium = list(

        dict.fromkeys(
            matched_skills[6:12]
        )

    )

    weak = list(

        dict.fromkeys(
            missing_skills[:8]
        )

    )

    # SUMMARY

    summary = f"""
Candidate demonstrates strong exposure to {", ".join(strong[:4]) if strong else "relevant technologies"}.

The resume aligns reasonably well with the provided job requirements and modern software engineering expectations.

Primary improvement areas include {", ".join(weak[:3]) if weak else "advanced specialization domains"}.

Overall recruiter recommendation for this profile is: {recommendation}.
"""

    # STRENGTHS

    strengths = [

        f"Strong understanding of {skill}"

        for skill in strong[:5]

    ]

    # GAPS

    gaps = [

        f"Limited exposure to {skill}"

        for skill in weak[:5]

    ]

    return {

        "score":
            overall_score,

        "role":
            role,

        "recommendation":
            recommendation,

        "summary":
            summary.strip(),

        "skills": {

            "strong":
                strong,

            "medium":
                medium,

            "weak":
                weak
        },

        "section_scores":
            section_scores,

        "strengths":
            strengths,

        "gaps":
            gaps
    }