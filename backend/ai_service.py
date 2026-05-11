import time


def generate_ai_roadmap(skills: str, target_role: str, timeline) -> dict:
    """
    Interfaces with the AI model to generate a career roadmap.

    Currently returns a rich mock JSON response structured for the UI.

    To integrate a real AI (e.g. Google Gemini):
        import google.generativeai as genai
        genai.configure(api_key="YOUR_KEY")
        model = genai.GenerativeModel("gemini-pro")
        prompt = f"Generate a JSON career roadmap for ..."
        response = model.generate_content(prompt)
        return json.loads(response.text)
    """

    # Simulate AI latency
    time.sleep(2)

    months = int(timeline)

    full_roadmap = [
        {
            "id": "m1",
            "month": 1,
            "title": "Advanced Language Features & DOM",
            "description": "Deep dive into ES6+, async programming, closures, and event-driven design.",
            "resources": [
                {"type": "YouTube", "title": "JavaScript: The Hard Parts", "link": "https://youtube.com"},
                {"type": "Docs", "title": "MDN - Asynchronous JS", "link": "https://developer.mozilla.org"}
            ],
            "miniProject": "Build a robust weather application using Fetch API.",
            "checklist": ["Arrow functions & Lexical this", "Promises & async/await", "Event bubbling & delegation", "Closures & Scoping"],
            "interviewPrompt": "Explain how the JavaScript event loop handles async operations. What is the difference between microtasks and macrotasks?"
        },
        {
            "id": "m2",
            "month": 2,
            "title": "Frontend Frameworks (React)",
            "description": "Understand React philosophy, JSX, functional components, and React hooks.",
            "resources": [
                {"type": "YouTube", "title": "React Crash Course", "link": "https://youtube.com"},
                {"type": "Docs", "title": "React Official Docs", "link": "https://react.dev"}
            ],
            "miniProject": "Develop an interactive task manager with local storage.",
            "checklist": ["Virtual DOM concepts", "useState and useEffect", "Prop drilling & Context", "Component Lifecycle"],
            "interviewPrompt": "What is the difference between a controlled and uncontrolled component in React?"
        },
        {
            "id": "m3",
            "month": 3,
            "title": "State Management & Routing",
            "description": "Learn global state with Redux Toolkit and client-side routing with React Router.",
            "resources": [
                {"type": "Docs", "title": "Redux Toolkit", "link": "https://redux-toolkit.js.org/"},
                {"type": "YouTube", "title": "React Router Tutorial", "link": "https://youtube.com"}
            ],
            "miniProject": "Build an E-commerce product listing page with a shopping cart.",
            "checklist": ["Redux store setup", "Reducers & Actions", "React Router Dom v6", "Protected Routes"],
            "interviewPrompt": "How does Redux solve the prop drilling problem? When would you choose Context API over Redux?"
        },
        {
            "id": "m4",
            "month": 4,
            "title": "TypeScript Integration",
            "description": "Add static typing to React apps to prevent bugs and improve developer experience.",
            "resources": [
                {"type": "Docs", "title": "TypeScript for React Devs", "link": "https://www.typescriptlang.org/"}
            ],
            "miniProject": "Refactor your E-commerce app using TypeScript interfaces and generics.",
            "checklist": ["Type Annotations", "Interfaces & Types", "Generics", "TypeScript with React"],
            "interviewPrompt": "What is the difference between `interface` and `type` in TypeScript?"
        },
        {
            "id": "m5",
            "month": 5,
            "title": "Backend & Next.js",
            "description": "Learn SSR, API routes, and database connectivity with Next.js.",
            "resources": [
                {"type": "Docs", "title": "Next.js Documentation", "link": "https://nextjs.org/docs"}
            ],
            "miniProject": "Create a blog platform fetching posts from a headless CMS.",
            "checklist": ["SSR vs SSG vs ISR", "Next.js API Routes", "Prisma / SQLite", "Authentication (NextAuth)"],
            "interviewPrompt": "Explain the difference between SSR and SSG in Next.js and when you'd choose each."
        },
        {
            "id": "m6",
            "month": 6,
            "title": "Testing & Deployment",
            "description": "Write unit/integration tests and deploy to production on Vercel.",
            "resources": [
                {"type": "YouTube", "title": "React Testing Crash Course", "link": "https://youtube.com"},
                {"type": "Docs", "title": "Vercel Deployment Guide", "link": "https://vercel.com/docs"}
            ],
            "miniProject": "Deploy a polished portfolio with Lighthouse score > 90.",
            "checklist": ["Jest Basics", "React Testing Library", "CI/CD concepts", "Vercel Deployment"],
            "interviewPrompt": "What is the difference between unit testing and integration testing?"
        }
    ]

    return {
        "targetRole": target_role or "Software Developer",
        "timeline": f"{months} Months",
        "skillGapAnalysis": {
            "currentSkills": [s.strip() for s in skills.split(',')],
            "missingSkills": ["React/Next.js", "State Management", "API Integration", "TypeScript", "Testing"],
            "summary": (
                f"You have a solid foundation. To become an industry-ready {target_role}, "
                "you need to master modern frameworks, strongly typed languages, "
                "backend connectivity, and deployment workflows."
            )
        },
        "roadmap": full_roadmap[:months]
    }
