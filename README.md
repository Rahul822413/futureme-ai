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
- **React.js & Vite:** We chose React for its component-based architecture, which makes building complex forms and interactive dashboards highly scalable. Vite was chosen over Create React App because it offers significantly faster hot-module reloading (HMR) and optimized build speeds.
- **Tailwind CSS:** Chosen for its utility-first approach, allowing us to rapidly prototype and build modern, responsive designs without constantly switching between CSS and JS files. It keeps the bundle size small by stripping unused classes.
- **Framer Motion:** Used to create fluid, physics-based micro-animations and page transitions. It elevates the platform from a standard web app to a premium, "wow-factor" experience.
- **React Router DOM:** Essential for creating a seamless Single Page Application (SPA) experience, allowing users to navigate between the form, dashboard, and simulation results without page reloads.

### Backend (Server-Side)
- **Node.js & Express.js:** JavaScript was chosen for the backend to maintain a unified language across the entire stack (MERN-like architecture). Express provides a lightweight, unopinionated framework perfect for building fast RESTful APIs.
- **Google Gemini 2.5 Flash API:** We selected Gemini over OpenAI because Gemini Flash is optimized for high-speed, dynamic text generation at a very low latency, which is critical for generating large 5-year simulation narratives in real-time.
- **JWT & bcryptjs:** JSON Web Tokens (JWT) allow for stateless, secure user sessions without burdening the server memory. `bcryptjs` ensures that user passwords are mathematically hashed and salted before hitting the database, maintaining high security standards.

### Database
- **PostgreSQL:** We migrated from SQLite to PostgreSQL because Postgres is a robust, production-grade relational database. It excels at handling concurrent connections and complex relational queries (linking Users to Profiles to Simulations).
- **`pg` (Node Postgres):** Chosen to handle connection pooling, ensuring the server doesn't crash under heavy database query loads.

### Deployment & DevOps
- **Render:** Chosen as our Platform as a Service (PaaS) because it natively supports both our Node.js backend and our PostgreSQL database in the same secure ecosystem, offering seamless CI/CD (Continuous Integration/Continuous Deployment) directly from GitHub.
- **GitHub:** Used for version control to track code changes, manage collaboration, and trigger automatic deployments to Render whenever new code is pushed to the `main` branch.
