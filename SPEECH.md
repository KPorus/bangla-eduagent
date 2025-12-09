# Presentation Script: Bangla EduAgent
**Speaker:** Fardin Khan  
**Duration:** ~3-5 Minutes

---

## 1. The Hook (Start Strong)
"Imagine wanting to learn advanced concepts like *Quantum Physics* or *Deep Learning*, but every high-quality resource you find is in a language you aren't fully comfortable with. For millions of Bengali speakers, this isn't just an imagination—it's a daily barrier."

## 2. Introduction
"Hello everyone, I’m **Fardin Khan**. I am a passionate Full Stack Developer and AI enthusiast.

I have a strong background in building scalable web applications using technologies like Node.js, NestJS, and React. My journey has always been driven by one goal: using technology to solve real, human problems. That brings me to my project today: **Bangla EduAgent**."

## 3. The Problem
"The internet is full of knowledge, but it's not equally accessible. 
- Most MOOCs (Coursera, Udemy) and documentation are in **English**.
- Creating manual translations for every new tech topic is **impossible** and doesn't scale.
- Students often waste hours translating jargon instead of learning the concept."

## 4. The Solution: Bangla EduAgent
"Bangla EduAgent is an **AI-powered personalized learning platform** that generates complete courses on *any* topic, specifically tailored for Bengali speakers.

It’s not just a translator. It’s a **Teacher**.
- You type a topic, say 'PyTorch Distillation'.
- It acts as an **Agent**: It researches the topic, builds a syllabus, creates lessons, and even generates quizzes to test your knowledge—all in Bengali."

## 5. Architecture (How it works)
"Let me briefly explain how it works under the hood.

**Current Architecture (MVP):**
- I built the frontend using **React** and **Tailwind CSS** for a clean, responsive UI.
- The core intelligence is powered by **Google's Gemini API**.
- I use a **Multi-Agent approach**:
    1.  **Syllabus Agent (Gemini 2.5 Flash):** This model is fast. It breaks down the topic into a JSON learning path.
    2.  **Content Agent (Gemini 3 Pro):** This model is deep. It generates the rich markdown content and quizzes.
    3.  **Grounding:** I use Google Search Grounding to ensure the AI doesn't hallucinate—it cites real sources."

## 6. Key Features
- **Voice Input:** To make it accessible for everyone.
- **Smart Preloading:** While you read Module 1, the system silently generates Module 2 in the background, making the experience instant.
- **Progress Tracking:** Local persistence to save your learning journey."

## 7. Future Roadmap
"This is currently a client-side prototype. My vision for the future is to scale this into a full SaaS platform:
1.  **Backend:** I plan to migrate the logic to a **Nest.js** backend with **MongoDB** to handle user accounts and heavy traffic (10,000+ users).
2.  **Community:** Adding a feature for users to share their generated courses with others.
3.  **Certifications:** issuing verifiable certificates upon course completion."

## 8. Closing
"Bangla EduAgent is my attempt to ensure that language is never a barrier to ambition. Thank you for listening, and I'd love to answer any questions!"
