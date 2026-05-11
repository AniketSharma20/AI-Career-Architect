// This file simulates the structured JSON response that an AI model would generate.

const generateMockRoadmap = (skills, targetRole, timelineMonths) => {
    // In a real application, this function would make an API call to a backend
    // connected to an LLM (e.g., OpenAI API) sending the inputs as a prompt.
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                targetRole: targetRole || "Frontend Developer",
                timeline: `${timelineMonths} Months`,
                skillGapAnalysis: {
                    currentSkills: skills.split(',').map(s => s.trim()),
                    missingSkills: ["React/Next.js", "State Management (Redux/Zustand)", "API Integration & Async JS", "TypeScript", "Performance Optimization"],
                    summary: `You have a good starting point. To reach an industry-ready level for a ${targetRole}, you need to transition from basic web technologies to modern frameworks, strongly typed languages, and advanced data fetching techniques.`
                },
                roadmap: [
                    {
                        month: 1,
                        title: "Advanced JavaScript & DOM Manipulation",
                        description: "Deep dive into ES6+ features, closures, promises, and async/await.",
                        resources: [
                            { type: "YouTube", title: "JavaScript Mastery - Async/Await", link: "https://youtube.com" },
                            { type: "Docs", title: "MDN Web Docs - Asynchronous JS", link: "https://developer.mozilla.org" }
                        ],
                        miniProject: "Build a robust weather application using the Fetch API and dynamic DOM updates."
                    },
                    {
                        month: 2,
                        title: "React Fundamentals & Components",
                        description: "Understand React philosophy, JSX, functional components, props, and basic hooks (useState, useEffect).",
                        resources: [
                            { type: "YouTube", title: "React Crash Course", link: "https://youtube.com" },
                            { type: "Docs", title: "React Official Documentation", link: "https://react.dev" }
                        ],
                        miniProject: "Develop an interactive task manager (To-Do app) with filtering and local storage."
                    },
                    {
                        month: 3,
                        title: "State Management & Routing",
                        description: "Learn how to manage global state using Context API/Redux and handle client-side routing with React Router.",
                        resources: [
                            { type: "Docs", title: "Redux Toolkit Quick Start", link: "https://redux-toolkit.js.org/" },
                            { type: "YouTube", title: "React Router v6 Tutorial", link: "https://youtube.com" }
                        ],
                        miniProject: "Build an E-commerce product listing page with a functional shopping cart."
                    },
                    {
                        month: 4,
                        title: "TypeScript Integration",
                        description: "Add static typing to your JavaScript/React applications to catch errors early and improve developer experience.",
                        resources: [
                            { type: "Docs", title: "TypeScript for React Developers", link: "https://www.typescriptlang.org/" }
                        ],
                        miniProject: "Refactor your previous E-commerce application using TypeScript interfaces and types."
                    },
                    {
                        month: 5,
                        title: "Backend Integration & Next.js Basics",
                        description: "Learn server-side rendering (SSR), static site generation (SSG), and how to connect to real databases/APIs.",
                        resources: [
                            { type: "Docs", title: "Next.js Documentation", link: "https://nextjs.org/docs" }
                        ],
                        miniProject: "Create a blog platform fetching posts from a headless CMS or external API."
                    },
                    {
                        month: 6,
                        title: "Performance, Testing & Deployment",
                        description: "Optimize React apps, write unit tests with Jest/React Testing Library, and deploy to Vercel/Netlify.",
                        resources: [
                            { type: "YouTube", title: "React Testing Crash Course", link: "https://youtube.com" },
                            { type: "Docs", title: "Vercel Deployment Guide", link: "https://vercel.com/docs" }
                        ],
                        miniProject: "Deploy a fully polished portfolio showcasing all your mini-projects, with Lighthouse score > 90."
                    }
                ].slice(0, timelineMonths) // Trim the roadmap based on user input timeline
            });
        }, 2000); // Simulate network latency
    });
};
