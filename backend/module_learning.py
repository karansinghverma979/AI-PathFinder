import random
import re

def get_learning_paths():
    return {
        "react": {
            "keywords": ["react", "frontend", "ui developer", "react 19"],
            "path": [
                {
                    "title": "Modern React 19 Fundamentals",
                    "description": "Master React 19's new features including the React Compiler, Actions API, and new hooks like useActionState and useOptimistic. Focus on functional components and Vite as the primary build tool.",
                    "difficulty": "Easy",
                    "resources": {
                        "tutorials": ["https://react.dev/blog/2024/04/25/react-19-upgrade-guide"],
                        "github_projects": ["https://github.com/reactjs/react.dev"],
                        "videos": ["https://www.youtube.com/watch?v=81uAIs_fM24"] # Traversy Media React 19 guide
                    }
                },
                {
                    "title": "State Management with Zustand & TanStack Query",
                    "description": "Move beyond basic state. Learn Zustand for client-side state and TanStack Query (React Query) for efficient server-side data fetching and caching.",
                    "difficulty": "Medium",
                    "resources": {
                        "tutorials": ["https://tanstack.com/query/latest", "https://docs.pmnd.rs/zustand/getting-started/introduction"],
                        "github_projects": ["https://github.com/pmndrs/zustand"],
                        "videos": ["https://www.youtube.com/watch?v=NK6uL9An-X8"]
                    }
                },
                {
                    "title": "Next.js 15 & Server Components",
                    "description": "Understand the App Router architecture, Server Components, and Server Actions for building high-performance full-stack applications.",
                    "difficulty": "Hard",
                    "resources": {
                        "tutorials": ["https://nextjs.org/docs"],
                        "github_projects": ["https://github.com/vercel/next.js"],
                        "videos": ["https://www.youtube.com/watch?v=wm5gMKuwSYk"] # JS Mastery Next.js 15
                    }
                }
            ]
        },
        "data_science": {
            "keywords": ["data scientist", "data science", "machine learning", "ai specialist"],
            "path": [
                {
                    "title": "Modern Data Stack: Polars & Python 3.12+",
                    "description": "Move from Pandas to Polars for high-performance, multi-threaded data manipulation. Master SQL for complex data retrieval and window functions.",
                    "difficulty": "Easy",
                    "resources": {
                        "tutorials": ["https://pola-rs.github.io/polars-book/", "https://sqlzoo.net/"],
                        "github_projects": ["https://github.com/pola-rs/polars"],
                        "videos": ["https://www.youtube.com/watch?v=Mi1SnoYdyS0"] # Polars Crash Course
                    }
                },
                {
                    "title": "Deep Learning with PyTorch",
                    "description": "Learn the dominant deep learning framework. Build neural networks for vision, NLP, and focus on modern Transformer architectures.",
                    "difficulty": "Medium",
                    "resources": {
                        "tutorials": ["https://pytorch.org/tutorials/", "https://course.fast.ai/"],
                        "github_projects": ["https://github.com/pytorch/pytorch"],
                        "videos": ["https://www.youtube.com/watch?v=V_xro1bcAuA"] # Andrej Karpathy Zero to Hero
                    }
                },
                {
                    "title": "Generative AI & LLMOps",
                    "description": "Master LangChain and LlamaIndex for Retrieval-Augmented Generation (RAG). Learn to deploy models using FastAPI and Docker for production-ready AI apps.",
                    "difficulty": "Hard",
                    "resources": {
                        "tutorials": ["https://python.langchain.com/docs/get_started/introduction"],
                        "github_projects": ["https://github.com/langchain-ai/langchain"],
                        "videos": ["https://www.youtube.com/watch?v=aywZrzNaKjs"]
                    }
                }
            ]
        }
    }

def generate_learning_path(prompt: str):
    """
    Simulates an AI generating a learning path based on a prompt.
    In a real application, this would call a generative AI model.
    """
    
    prompt_lower = prompt.lower()
    
    all_paths = get_learning_paths()
    
    # More sophisticated keyword matching
    matched_path = None
    for path_name, path_data in all_paths.items():
        if any(keyword in prompt_lower for keyword in path_data["keywords"]):
            matched_path = path_data["path"]
            break

    # Generic fallback
    if not matched_path:
        matched_path = [
            {"title": "Define Your Goal", "description": "Clearly articulate what you want to learn and why.", "difficulty": "Easy", "resources": {}},
            {"title": "Break It Down", "description": "Divide the topic into smaller, manageable sub-skills or concepts.", "difficulty": "Easy", "resources": {}},
            {"title": "Find Resources", "description": "Gather tutorials, courses, books, and documentation.", "difficulty": "Easy", "resources": {}},
            {"title": "Practice Consistently", "description": "Apply what you learn through exercises and small projects.", "difficulty": "Medium", "resources": {}},
            {"title": "Build Something Real", "description": "Create a larger project that solves a real-world problem.", "difficulty": "Hard", "resources": {}},
            {"title": "Teach Others", "description": "Explaining the concepts to others is a great way to solidify your understanding.", "difficulty": "Hard", "resources": {}},
        ]
        
    return {
        "prompt": prompt,
        "path": matched_path,
        "estimated_duration": f"{random.randint(4, 12)} weeks"
    }