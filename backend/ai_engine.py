from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# LOAD NLP MODEL ONCE
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# CENTRALIZED SKILL DATABASE
SKILL_DB = {

    "cloud": [
        "aws",
        "azure",
        "gcp",
        "s3",
        "lambda"
    ],

    "backend": [
        "python",
        "java",
        "node",
        "api",
        "django",
        "flask"
    ],

    "frontend": [
        "react",
        "html",
        "css",
        "javascript"
    ],

    "devops": [
        "docker",
        "kubernetes",
        "ci/cd",
        "jenkins"
    ],

    "database": [
        "sql",
        "mongodb",
        "postgresql"
    ],

    "ai_ml": [
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

    # LOWERCASE NORMALIZATION

    resume_text = (
        resume_text.lower()
    )

    jd = jd.lower()

    # SEMANTIC NLP MATCHING

    resume_embedding = (
        model.encode(
            [resume_text]
        )
    )

    jd_embedding = (
        model.encode([jd])
    )

    semantic_similarity = (
        cosine_similarity(
            resume_embedding,
            jd_embedding
        )[0][0]
    )

    semantic_score = int(
        semantic_similarity * 100
    )

    matched_skills = []
    missing_skills = []

    section_scores = {}

    total_section_score = 0
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

        sections_used += 1

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

        total_section_score += (
            section_score
        )

    # KEYWORD SCORE

    keyword_score = int(

        total_section_score
        /
        sections_used

    ) if sections_used else 0

    # FINAL HYBRID SCORE

    overall_score = int(

        (
            semantic_score * 0.5
        )

        +

        (
            keyword_score * 0.5
        )

    )

    # RECOMMENDATION ENGINE

    if overall_score >= 85:

        recommendation = (
            "Strong Fit"
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
            "Needs Improvement"
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

    # SKILL GROUPING

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

    # AI SUMMARY

    summary = f"""
Candidate demonstrates strong exposure to {", ".join(strong[:4]) if strong else "relevant technologies"}.

The resume aligns reasonably well with the provided job requirements and modern software engineering expectations.

Semantic NLP analysis indicates a contextual compatibility score of {semantic_score}% while technical keyword alignment contributes a score of {keyword_score}%.

Primary improvement areas include {", ".join(weak[:3]) if weak else "advanced specialization domains"}.

Overall recruiter recommendation for this profile is: {recommendation}.
"""

    # STRENGTHS + GAPS

    strengths = [

        f"Strong understanding of {skill}"

        for skill in strong[:5]
    ]

    gaps = [

        f"Limited exposure to {skill}"

        for skill in weak[:5]
    ]

    return {

        "score": overall_score,

        "semantic_score":
            semantic_score,

        "keyword_score":
            keyword_score,

        "role": role,

        "recommendation":
            recommendation,

        "summary":
            summary.strip(),

        "skills": {

            "strong": strong,

            "medium": medium,

            "weak": weak
        },

        "section_scores":
            section_scores,

        "strengths":
            strengths,

        "gaps":
            gaps
    }