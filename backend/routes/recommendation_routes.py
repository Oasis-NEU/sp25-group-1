from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User 
import datetime

match_bp = Blueprint('match', __name__, url_prefix='/api/match')

def calculate_match_score(candidate, desired_role, desired_experience, desired_skills,  desired_interests, desired_availability):
    # Subject to change the chance values
    weight_experience = 0.35
    weight_skills = 0.35
    weight_availability = 0.3
    
    # map experience level to numbers
    exp_map = {"Beginner": 1, "Intermediate": 2, "Expert": 3}
    desired_exp = exp_map.get(desired_experience)    
    candidate_exp = exp_map.get(candidate.experience_level)
    
    # the closer the experience level, the higher the exp_score
    exp_score = 1 - (abs(desired_exp - candidate_exp) / 2.0)

    # skills calculation
    candidate_skills = set(candidate.skills)
    if desired_skills:
        intersection = desired_skills.intersection(candidate_skills)
        union = desired_skills.union(candidate_skills)
        skills_score = len(intersection) / len(union)
    else:
        skills_score = 0.5 


    # Availability similarity table
    availability_similarity = {
        "Full-time": {"Full-time": 1.0, "Hybrid": 0.8, "Remote": 0.7, "Part-time": 0.4, "Freelance": 0.3,
                      "Collaborative": 0.5, "Contract-Based": 0.5, "Mentorship": 0.2, "Casual": 0.4,
                      "Internship": 0.3, "Volunteer": 0.2, "No Availability": 0.0},
        "Part-time": {"Full-time": 0.4, "Hybrid": 0.5, "Remote": 0.5, "Part-time": 1.0, "Freelance": 0.8,
                      "Collaborative": 0.6, "Contract-Based": 0.8, "Mentorship": 0.4, "Casual": 0.7,
                      "Internship": 0.5, "Volunteer": 0.3, "No Availability": 0.0},
        "Freelance": {"Full-time": 0.3, "Hybrid": 0.4, "Remote": 0.5, "Part-time": 0.8, "Freelance": 1.0,
                      "Collaborative": 0.6, "Contract-Based": 0.8, "Mentorship": 0.3, "Casual": 0.7,
                      "Internship": 0.4, "Volunteer": 0.3, "No Availability": 0.0},
        "Remote": {"Full-time": 0.7, "Hybrid": 0.8, "Remote": 1.0, "Part-time": 0.5, "Freelance": 0.5,
                   "Collaborative": 0.6, "Contract-Based": 0.6, "Mentorship": 0.3, "Casual": 0.5,
                   "Internship": 0.4, "Volunteer": 0.4, "No Availability": 0.0},
        "Hybrid": {"Full-time": 0.8, "Hybrid": 1.0, "Remote": 0.8, "Part-time": 0.5, "Freelance": 0.4,
                   "Collaborative": 0.7, "Contract-Based": 0.6, "Mentorship": 0.3, "Casual": 0.5,
                   "Internship": 0.4, "Volunteer": 0.4, "No Availability": 0.0},
        "Internship": {"Full-time": 0.3, "Hybrid": 0.4, "Remote": 0.4, "Part-time": 0.5, "Freelance": 0.4,
                       "Collaborative": 0.5, "Contract-Based": 0.4, "Mentorship": 0.7, "Casual": 0.6,
                       "Internship": 1.0, "Volunteer": 0.6, "No Availability": 0.0},
        "Volunteer": {"Full-time": 0.2, "Hybrid": 0.3, "Remote": 0.4, "Part-time": 0.3, "Freelance": 0.3,
                      "Collaborative": 0.5, "Contract-Based": 0.3, "Mentorship": 0.6, "Casual": 0.5,
                      "Internship": 0.6, "Volunteer": 1.0, "No Availability": 0.0},
        "No Availability": {"Full-time": 0.0, "Hybrid": 0.0, "Remote": 0.0, "Part-time": 0.0, "Freelance": 0.0,
                            "Collaborative": 0.0, "Contract-Based": 0.0, "Mentorship": 0.0, "Casual": 0.0,
                            "Internship": 0.0, "Volunteer": 0.0, "No Availability": 1.0}
    }

    if desired_availability:
        availability_score = availability_similarity.get(desired_availability, {}).get(candidate.availability, 0)
    else:
        availability_score = 0.5

    # Final match score calculation
    match_score = (weight_experience * exp_score) + \
                  (weight_skills * skills_score) + \
                  (weight_availability * availability_score)

    return match_score * 100



"""
POST: /api/match
{
    "role": "designer" | "developer",
    "experience": "Beginner" | "Intermediate" | "Expert",
    "skills": "skill1, skill2, skill3",
    "interests": "interest1, interest2, interest3",
    "availability": "Full-time" | "Part-time" | "Freelance" | "Collaborative" | 
                    "Contract-Based" | "Mentorship" | "Casual" | "Internship" |
                    "Remote" | "Hybrid" | "Volunteer" | "No Availability"
}
    
Returns top 3 matching user profiles based on desired criteria.
"""
@match_bp.route('/match', methods=["POST"])
@jwt_required()
def match_users():

    current_user_id = get_jwt_identity()


    # Retrieving information from the json
    data = request.json
    desired_role = data.get('role')
    desired_experience = data.get('experience')
    desired_skills = set(map(str.strip, data.get('skills', "").split(',')))
    desired_availability = data.get('availability')
    
    # Gets all users but the current one and filters those users based on desired role
    candidates = User.query.filter(User.id != current_user_id).all()
    filtered_candidates = []
    for user in candidates:
        if user.role == desired_role:
            filtered_candidates.append(user)

    matches = []
    for candidate in filtered_candidates:
        match_score = match_score = match_score = calculate_match_score(candidate, desired_role, desired_experience, 
                                                                        desired_skills, desired_availability)
        
        matches.append({
            'userid': candidate.id,  
            'profile_picture': candidate.profile_picture,
            'role': candidate.role,
            'skills': candidate.skills,
            'experience_level': candidate.experience_level,
            'availability': candidate.availability,
            'match_score': match_score
        })
    
    matches.sort(key=lambda match: match['match_score'], reverse=True)

    top_matches = matches[:10]
    
    return jsonify(top_matches)



    