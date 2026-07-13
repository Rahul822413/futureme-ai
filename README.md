# FutureMe AI 🚀
**Personal Future Simulation Engine**

## 🛑 The Problem
Students and early-career professionals often struggle with "short-termism." They make daily micro-decisions (e.g., scrolling social media for 4 hours, skipping a study session, delaying a portfolio project) without realizing the compounding long-term impact on their career trajectory. 

Because the future is abstract and distant, there is a massive disconnect between **daily habits** and **future career outcomes**. This leads to career stagnation, significant skill gaps upon graduation, and missed opportunities. People lack a tangible, personalized way to visualize exactly *how* their actions today shape their reality tomorrow.

## 💡 The Solution
FutureMe AI is a dynamic, AI-powered simulation engine that bridges the gap between present habits and future outcomes. 

By inputting their current skills, daily habits, education field, and a specific "What if?" decision (e.g., *"What if I study corporate law for 2 hours daily?"* or *"What if I learn AI?"*), the platform acts as a time machine, generating a hyper-personalized 5-year longitudinal simulation of their life.

### Key Features:
- **Universal Domain Engine:** Dynamically adapts its entire UI, metrics, and suggestions based on the user's field (Tech, Medicine, Business, Law, Design, etc.).
- **Heuristic Scoring:** Algorithmically calculates *Career Readiness*, *Consistency*, and *Risk* scores based on proven professional growth metrics.
- **AI Scenario Generation:** Uses Google's Gemini LLM to generate vivid, emotionally engaging "Day in the Life" vignettes for Optimistic, Realistic, and Risk scenarios 5 years in the future.
- **Actionable Roadmaps:** Generates hyper-specific, actionable recommendations (skills to learn, courses to take, projects to build) tailored strictly to the user's exact career goal.
- **Long-term Growth Projections:** Mathematically projects skill growth over 3-month to 5-year milestones.

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
- **Framework:** React.js (via Vite for lightning-fast builds)
- **Styling:** Tailwind CSS (for modern, responsive utility-class styling)
- **Animations:** Framer Motion (for fluid, premium micro-animations and page transitions)
- **UI Design:** Custom Glassmorphism UI with an immersive, interactive 3D Galaxy background.
- **Routing:** React Router DOM
- **Icons:** React Icons

### Backend (Server-Side)
- **Runtime:** Node.js
- **Framework:** Express.js (RESTful API architecture)
- **AI Integration:** Google GenAI SDK (`@google/genai`) utilizing the **Gemini 2.5 Flash** model for high-speed, dynamic text generation.
- **Authentication:** JSON Web Tokens (JWT) for stateless sessions, and `bcryptjs` for secure password hashing.

### Database
- **Engine:** PostgreSQL (Relational Database)
- **Driver:** `pg` (Node Postgres with connection pooling)
- **Schema:** Highly relational structure connecting Users, Profiles, and Simulations with cascading deletions.

### Deployment & DevOps
- **Hosting:** Render (Platform as a Service)
- **Version Control:** Git & GitHub
- **Environment Management:** `.env` for securing API keys, Database URLs, and JWT Secrets.
