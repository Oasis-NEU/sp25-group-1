# Project Blueprint: CoDesign

## Overview  
**Name:** CoDesign  
**Contributors:** Aryan Gupta, Abhinav Gonthina, Shiven Ajwaliya, Jonas Bleck, Abhinav Tavlidar  
**Objective:**  
To create a platform that connects designers and developers, enabling them to collaborate on projects seamlessly. CoDesign facilitates profile creation, project posting, chat-based communication, and personalized matchmaking based on skills, interests, and availability. Additionally, CoDesign offers a mobile-friendly experience and scalable backend to support growing users.

---

## Goals  
- Connect designers and developers looking to collaborate on projects.  
- Allow users to create detailed profiles showcasing skills, interests, experience, and availability.  
- Implement a matchmaking algorithm to recommend potential collaborators based on user preferences.  
- Enable direct communication via a chat system.  
- Provide a seamless, mobile-friendly experience  
- Support content posting to share ongoing or completed projects.  
- Offer personalized project recommendations.

---

## Tech Stack  

### Frontend  
- **Framework:** ReactJS (Web), React Native (Mobile)  
- **Styling:** Tailwind CSS, Material UI Icons  
- **State Management:** Context API  
- **Routing:** React Router  

### Backend  
- **Framework:** Flask (Python)  
- **Database:** MongoDB (Profiles, Projects, Chat data)  
- **APIs:** RESTful API design for frontend-backend communication  
- **Authentication:** JWT-based user authentication, Google Auth  

---

## Core Functionalities  

### User Profiles  
- Designers and developers can create profiles with skills, interests, experience level, availability, and project preferences.

### Matchmaking Algorithm  
- Recommend top collaborators based on profile attributes and user preferences.  
- Matching criteria: role (designer/developer), skills, experience, and availability.

### Project Posting & Discovery  
- Users can post project ideas and browse existing ones.  
- Option to search and filter projects based on trending.

### Chat System  
- Real-time messaging between users to facilitate collaboration discussions.

### Mobile App Support  
- Mobile-friendly web design.  
- Dedicated mobile app version for enhanced accessibility.

### Backend API Endpoints  
- RESTful APIs for handling profile management, project posting, matchmaking, and chat functionality.

---

## Intended Users  
- Designers seeking developers to bring their creative ideas to life.  
- Developers looking to collaborate with designers on innovative technical projects.

---

## Run Instructions  

1. **Set up two terminals**  
   - Terminal 1: `cd frontend` *(frontend terminal)*  
   - Terminal 2: `cd backend` *(backend terminal)*  

2. **Backend Setup**  
   - In `backend/`, create a `.env` file with the following values:
     ```
     MONGO_URI=
     JWT_SECRET_KEY=
     CLOUDINARY_CLOUD_NAME=
     CLOUDINARY_API_KEY=
     CLOUDINARY_API_SECRET=
     GOOGLE_CLIENT_ID=
     GOOGLE_CLIENT_SECRET=
     SECRET_KEY=
     FRONTEND_URL=
     ```
   - Then run:
     ```bash
     python -m venv venv
     source venv/bin/activate  # or venv\Scripts\activate on Windows
     pip install -r requirements.txt
     python app.py
     ```

3. **Frontend Setup**  
   - In `frontend/`, create a `.env` file with:
     ```
     VITE_BACKEND_URL=
     ```
   - Then run:
     ```bash
     npm install
     npm run dev
     ```

---

## Future Roadmap  
- Add support for group chats and project-based team channels.  
- Integrate push notifications for messages and collaboration requests.  
- Implement feedback and review system for collaborators.  
- Support media sharing (images, design prototypes).  
- Add AI-based matchmaking recommendations using ML models.  
- Introduce gamification: badges, achievements for community engagement.

## View Website
https://codesign-group1.netlify.app/
