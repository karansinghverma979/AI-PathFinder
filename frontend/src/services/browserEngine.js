import axios from 'axios';

// ==============================================================================
// AI-PathFinder Sovereign In-Browser Engine
// Provides 100% client-side persistence (localStorage) and matching algorithms
// Enables zero-cost, permanent GitHub Pages & Web deployment with zero servers
// ==============================================================================

const STORAGE_KEYS = {
  CANDIDATES: 'aipathfinder_candidates',
  JOBS: 'aipathfinder_jobs',
  COMPANIES: 'aipathfinder_companies',
  INITIALIZED: 'aipathfinder_seeded_v1'
};

const DEFAULT_CANDIDATES = [
  {
    id: 1,
    name: "Karan Singh Verma",
    email: "karansinghverma979@gmail.com",
    skills: "FastAPI, React, Tailwind CSS, SQLite, Python, JavaScript, Framer Motion, Axios, Vite, Node.js, REST APIs, Git, Responsive Web Design",
    location: "Developer",
    is_developer: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Ankit Kushwaha",
    email: "ankit485225@gmail.com",
    skills: "Python, FastAPI, Django, Node.js, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, Microservices, System Design",
    location: "Bhopal",
    is_developer: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Akarshan Gupta",
    email: "akarshang44@gmail.com",
    skills: "React, TypeScript, Next.js, Redux Toolkit, Zustand, TailwindCSS, Framer Motion, Vite, Webpack, ESLint, UI/UX Design",
    location: "Bhopal",
    is_developer: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    skills: "Python, Django, JavaScript, React",
    location: "Mumbai",
    is_developer: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    name: "Rohan Joshi",
    email: "rohan.joshi@example.com",
    skills: "Java, Spring Boot, React, SQL",
    location: "Pune",
    is_developer: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    skills: "Android, Kotlin, Java, Mobile App Development",
    location: "Delhi",
    is_developer: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    name: "Sneha Patel",
    email: "sneha.patel@example.com",
    skills: "iOS, Swift, SwiftUI, Mobile App Development",
    location: "Ahmedabad",
    is_developer: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    name: "Ishaan Sharma",
    email: "ishaan.sharma@example.com",
    skills: "Go, Docker, Kubernetes, Linux, AWS",
    location: "Chennai",
    is_developer: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 9,
    name: "Arjun Kumar",
    email: "arjun.kumar@example.com",
    skills: "Python, PyTorch, Machine Learning, Data Science",
    location: "Bangalore",
    is_developer: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEFAULT_JOBS = [
  { id: 1, title: "Software Engineer", required_skills: "Python, Django, JavaScript, React", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, title: "Frontend Developer", required_skills: "HTML, CSS, JavaScript, React, Redux, Tailwind CSS", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, title: "Backend Developer", required_skills: "Python, FastAPI, Node.js, Express.js, PostgreSQL, MongoDB", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 4, title: "Full Stack Developer", required_skills: "Python, JavaScript, React, Node.js, SQL, NoSQL", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 5, title: "Data Scientist", required_skills: "Python, R, SQL, TensorFlow, PyTorch, Scikit-learn", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 6, title: "Machine Learning Engineer", required_skills: "Python, TensorFlow, PyTorch, Keras, AWS, Docker", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 7, title: "DevOps Engineer", required_skills: "Docker, Kubernetes, Jenkins, AWS, Terraform, Linux", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 8, title: "QA Engineer", required_skills: "Selenium, Cypress, Jest, PyTest, Automation", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 9, title: "UI/UX Designer", required_skills: "Figma, Sketch, Adobe XD, Prototyping, CSS", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 10, title: "Cloud Engineer", required_skills: "AWS, Azure, Google Cloud, Docker, Kubernetes", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

const DEFAULT_COMPANIES = [
  {
    id: 1,
    name: "InnovateTech India",
    email: "contact@innovatetech.in",
    jobs: [
      { id: 101, company_id: 1, job_id: 2, salary: "₹14 LPA", required_skills: "HTML, CSS, JavaScript, React, Tailwind CSS" },
      { id: 102, company_id: 1, job_id: 1, salary: "₹18 LPA", required_skills: "Python, Django, JavaScript, React" }
    ]
  },
  {
    id: 2,
    name: "Datawise Solutions",
    email: "hr@datawise.in",
    jobs: [
      { id: 103, company_id: 2, job_id: 5, salary: "₹20 LPA", required_skills: "Python, SQL, PyTorch, Scikit-learn" }
    ]
  },
  {
    id: 3,
    name: "CodeGenius Pvt. Ltd.",
    email: "careers@codegenius.co.in",
    jobs: [
      { id: 104, company_id: 3, job_id: 3, salary: "₹16 LPA", required_skills: "Python, FastAPI, Node.js, MongoDB" }
    ]
  },
  {
    id: 4,
    name: "InfraCloud Technologies",
    email: "jobs@infracloud.in",
    jobs: [
      { id: 105, company_id: 4, job_id: 7, salary: "₹22 LPA", required_skills: "Docker, Kubernetes, AWS, Terraform" }
    ]
  },
  {
    id: 5,
    name: "QuantumLeap AI",
    email: "research@quantumleap.ai",
    jobs: [
      { id: 106, company_id: 5, job_id: 6, salary: "₹25 LPA", required_skills: "Python, TensorFlow, PyTorch, AWS" }
    ]
  }
];

const LEARNING_PATHS = {
  react: {
    keywords: ["react", "frontend", "ui developer", "javascript"],
    path: [
      {
        title: "Modern React 19 Fundamentals",
        description: "Master React 19 features including the React Compiler, Actions API, and hooks like useActionState. Focus on functional components and Vite.",
        difficulty: "Easy",
        resources: {
          tutorials: ["https://react.dev/blog/2024/04/25/react-19-upgrade-guide"],
          github_projects: ["https://github.com/reactjs/react.dev"],
          videos: ["https://www.youtube.com/watch?v=81uAIs_fM24"]
        }
      },
      {
        title: "State Management with Zustand & TanStack Query",
        description: "Learn Zustand for local state and TanStack Query for caching and asynchronous server-side state synchronization.",
        difficulty: "Medium",
        resources: {
          tutorials: ["https://tanstack.com/query/latest", "https://docs.pmnd.rs/zustand/getting-started/introduction"],
          github_projects: ["https://github.com/pmndrs/zustand"],
          videos: ["https://www.youtube.com/watch?v=NK6uL9An-X8"]
        }
      },
      {
        title: "Next.js 15 & Server Components",
        description: "Understand App Router architecture, Server Actions, and streaming for high-performance full-stack web applications.",
        difficulty: "Hard",
        resources: {
          tutorials: ["https://nextjs.org/docs"],
          github_projects: ["https://github.com/vercel/next.js"],
          videos: ["https://www.youtube.com/watch?v=wm5gMKuwSYk"]
        }
      }
    ]
  },
  data_science: {
    keywords: ["data scientist", "data science", "machine learning", "ai", "python"],
    path: [
      {
        title: "Modern Data Stack: Polars & Python 3.12+",
        description: "Master Polars for multi-threaded DataFrame processing. Learn SQL window functions and exploratory data analysis.",
        difficulty: "Easy",
        resources: {
          tutorials: ["https://pola-rs.github.io/polars-book/", "https://sqlzoo.net/"],
          github_projects: ["https://github.com/pola-rs/polars"],
          videos: ["https://www.youtube.com/watch?v=Mi1SnoYdyS0"]
        }
      },
      {
        title: "Deep Learning with PyTorch",
        description: "Build neural network architectures with PyTorch. Explore Computer Vision, NLP, and Transformer fundamentals.",
        difficulty: "Medium",
        resources: {
          tutorials: ["https://pytorch.org/tutorials/", "https://course.fast.ai/"],
          github_projects: ["https://github.com/pytorch/pytorch"],
          videos: ["https://www.youtube.com/watch?v=V_xro1bcAuA"]
        }
      },
      {
        title: "Generative AI & LLMOps",
        description: "Master LangChain and LlamaIndex for Retrieval-Augmented Generation (RAG). Deploy models using FastAPI and Docker.",
        difficulty: "Hard",
        resources: {
          tutorials: ["https://python.langchain.com/docs/get_started/introduction"],
          github_projects: ["https://github.com/langchain-ai/langchain"],
          videos: ["https://www.youtube.com/watch?v=aywZrzNaKjs"]
        }
      }
    ]
  },
  devops: {
    keywords: ["devops", "cloud", "docker", "kubernetes", "aws"],
    path: [
      {
        title: "Containerization with Docker & Linux Core",
        description: "Build hardened multi-stage Dockerfiles. Master Linux networking, namespaces, and bash automation.",
        difficulty: "Easy",
        resources: {
          tutorials: ["https://docs.docker.com/get-started/"],
          github_projects: ["https://github.com/docker/awesome-compose"],
          videos: ["https://www.youtube.com/watch?v=3c-iBn73dDE"]
        }
      },
      {
        title: "Kubernetes Cluster Orchestration",
        description: "Deploy Pods, Deployments, Services, and Ingress controllers. Manage stateful workloads and Helm charts.",
        difficulty: "Medium",
        resources: {
          tutorials: ["https://kubernetes.io/docs/tutorials/"],
          github_projects: ["https://github.com/kubernetes/kubernetes"],
          videos: ["https://www.youtube.com/watch?v=X48VuDVv0do"]
        }
      },
      {
        title: "Infrastructure as Code (Terraform) & CI/CD",
        description: "Automate cloud infrastructure on AWS/GCP with Terraform. Build least-privilege GitHub Actions pipelines.",
        difficulty: "Hard",
        resources: {
          tutorials: ["https://developer.hashicorp.com/terraform/tutorials"],
          github_projects: ["https://github.com/hashicorp/terraform"],
          videos: ["https://www.youtube.com/watch?v=7xngnjfIlK4"]
        }
      }
    ]
  }
};

// Storage Helpers
function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to persist ${key}`, e);
  }
}

function ensureDatabaseInitialized() {
  if (!getStored(STORAGE_KEYS.INITIALIZED, false)) {
    setStored(STORAGE_KEYS.CANDIDATES, DEFAULT_CANDIDATES);
    setStored(STORAGE_KEYS.JOBS, DEFAULT_JOBS);
    setStored(STORAGE_KEYS.COMPANIES, DEFAULT_COMPANIES);
    setStored(STORAGE_KEYS.INITIALIZED, true);
  }
}

// In-Browser Request Dispatcher
export function handleBrowserRequest(config) {
  ensureDatabaseInitialized();

  // Normalize URL and method
  let path = config.url || '';
  path = path.replace(/^https?:\/\/[^\/]+/, '');
  const [cleanPath] = path.split('?');
  const method = (config.method || 'get').toUpperCase();
  const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};

  // 1. CANDIDATES
  if (cleanPath === '/candidates') {
    if (method === 'GET') {
      const candidates = getStored(STORAGE_KEYS.CANDIDATES, DEFAULT_CANDIDATES);
      candidates.sort((a, b) => {
        if (a.is_developer !== b.is_developer) return b.is_developer ? 1 : -1;
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      return Promise.resolve({ data: candidates, status: 200, statusText: "OK" });
    }

    if (method === 'POST') {
      const candidates = getStored(STORAGE_KEYS.CANDIDATES, DEFAULT_CANDIDATES);
      const existing = candidates.find(c => c.email.toLowerCase() === body.email?.toLowerCase());
      
      if (existing) {
        if (existing.is_developer) {
          return Promise.reject({ response: { status: 403, data: { detail: "Developer profiles cannot be modified." } } });
        }
        existing.name = body.name || existing.name;
        existing.skills = body.skills || existing.skills;
        existing.location = body.location || existing.location;
        existing.updated_at = new Date().toISOString();
        setStored(STORAGE_KEYS.CANDIDATES, candidates);
        return Promise.resolve({ data: { message: "Candidate updated successfully" }, status: 200 });
      }

      const newCand = {
        id: Date.now(),
        name: body.name,
        email: body.email,
        skills: body.skills,
        location: body.location || "Remote",
        is_developer: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      candidates.push(newCand);
      setStored(STORAGE_KEYS.CANDIDATES, candidates);
      return Promise.resolve({ data: { message: "Candidate added successfully" }, status: 200 });
    }
  }

  // Candidate ID actions
  const candMatch = cleanPath.match(/^\/candidates\/(\d+)$/);
  if (candMatch) {
    const candId = parseInt(candMatch[1], 10);
    const candidates = getStored(STORAGE_KEYS.CANDIDATES, DEFAULT_CANDIDATES);
    const target = candidates.find(c => c.id === candId);

    if (method === 'PUT') {
      if (target && target.is_developer) {
        return Promise.reject({ response: { status: 403, data: { detail: "Developer profiles cannot be modified." } } });
      }
      if (target) {
        Object.assign(target, body, { updated_at: new Date().toISOString() });
        setStored(STORAGE_KEYS.CANDIDATES, candidates);
        return Promise.resolve({ data: { message: "Candidate updated successfully" }, status: 200 });
      }
      return Promise.reject({ response: { status: 404, data: { detail: "Candidate not found" } } });
    }

    if (method === 'DELETE') {
      if (target && target.is_developer) {
        return Promise.reject({ response: { status: 403, data: { detail: "Developer profiles cannot be deleted." } } });
      }
      const filtered = candidates.filter(c => c.id !== candId);
      setStored(STORAGE_KEYS.CANDIDATES, filtered);
      return Promise.resolve({ data: { message: "Candidate deleted successfully" }, status: 200 });
    }
  }

  // 2. JOBS
  if (cleanPath === '/jobs') {
    const jobs = getStored(STORAGE_KEYS.JOBS, DEFAULT_JOBS);
    if (method === 'GET') {
      jobs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      return Promise.resolve({ data: jobs, status: 200, statusText: "OK" });
    }

    if (method === 'POST') {
      const exists = jobs.find(j => j.title.toLowerCase() === body.title?.toLowerCase());
      if (exists) {
        return Promise.reject({ response: { status: 409, data: { detail: "Job with this title already exists." } } });
      }
      const newJob = {
        id: Date.now(),
        title: body.title,
        required_skills: body.required_skills,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      jobs.push(newJob);
      setStored(STORAGE_KEYS.JOBS, jobs);
      return Promise.resolve({ data: newJob, status: 200 });
    }
  }

  const jobMatch = cleanPath.match(/^\/jobs\/(\d+)$/);
  if (jobMatch) {
    const jobId = parseInt(jobMatch[1], 10);
    const jobs = getStored(STORAGE_KEYS.JOBS, DEFAULT_JOBS);
    const target = jobs.find(j => j.id === jobId);

    if (method === 'PUT') {
      if (target) {
        Object.assign(target, body, { updated_at: new Date().toISOString() });
        setStored(STORAGE_KEYS.JOBS, jobs);
        return Promise.resolve({ data: target, status: 200 });
      }
      return Promise.reject({ response: { status: 404, data: { detail: "Job not found" } } });
    }

    if (method === 'DELETE') {
      const filtered = jobs.filter(j => j.id !== jobId);
      setStored(STORAGE_KEYS.JOBS, filtered);
      return Promise.resolve({ data: { message: "Job deleted successfully" }, status: 200 });
    }
  }

  // 3. COMPANIES & COMPANY JOBS
  if (cleanPath === '/companies') {
    const companies = getStored(STORAGE_KEYS.COMPANIES, DEFAULT_COMPANIES);
    if (method === 'GET') {
      return Promise.resolve({ data: companies, status: 200, statusText: "OK" });
    }
    if (method === 'POST') {
      const newCompany = {
        id: Date.now(),
        name: body.name,
        email: body.email,
        jobs: []
      };
      companies.push(newCompany);
      setStored(STORAGE_KEYS.COMPANIES, companies);
      return Promise.resolve({ data: newCompany, status: 200 });
    }
  }

  const compMatch = cleanPath.match(/^\/companies\/(\d+)$/);
  if (compMatch) {
    const compId = parseInt(compMatch[1], 10);
    const companies = getStored(STORAGE_KEYS.COMPANIES, DEFAULT_COMPANIES);
    const target = companies.find(c => c.id === compId);

    if (method === 'PUT') {
      if (target) {
        Object.assign(target, body);
        setStored(STORAGE_KEYS.COMPANIES, companies);
        return Promise.resolve({ data: target, status: 200 });
      }
      return Promise.reject({ response: { status: 404, data: { detail: "Company not found" } } });
    }

    if (method === 'DELETE') {
      const filtered = companies.filter(c => c.id !== compId);
      setStored(STORAGE_KEYS.COMPANIES, filtered);
      return Promise.resolve({ data: { message: "Company deleted successfully" }, status: 200 });
    }
  }

  // Add job to company
  const compJobAddMatch = cleanPath.match(/^\/companies\/(\d+)\/jobs$/);
  if (compJobAddMatch && method === 'POST') {
    const compId = parseInt(compJobAddMatch[1], 10);
    const companies = getStored(STORAGE_KEYS.COMPANIES, DEFAULT_COMPANIES);
    const company = companies.find(c => c.id === compId);
    if (company) {
      if (!company.jobs) company.jobs = [];
      const newJob = {
        id: Date.now(),
        company_id: compId,
        job_id: body.job_id,
        salary: body.salary || "₹12 LPA",
        required_skills: body.required_skills
      };
      company.jobs.push(newJob);
      setStored(STORAGE_KEYS.COMPANIES, companies);
      return Promise.resolve({ data: newJob, status: 200 });
    }
    return Promise.reject({ response: { status: 404, data: { detail: "Company not found" } } });
  }

  // Update/Delete company job
  const compJobMatch = cleanPath.match(/^\/company_jobs\/(\d+)$/);
  if (compJobMatch) {
    const cjId = parseInt(compJobMatch[1], 10);
    const companies = getStored(STORAGE_KEYS.COMPANIES, DEFAULT_COMPANIES);

    if (method === 'PUT') {
      for (const comp of companies) {
        const j = comp.jobs?.find(item => item.id === cjId);
        if (j) {
          Object.assign(j, body);
          setStored(STORAGE_KEYS.COMPANIES, companies);
          return Promise.resolve({ data: j, status: 200 });
        }
      }
      return Promise.reject({ response: { status: 404, data: { detail: "Company job not found" } } });
    }

    if (method === 'DELETE') {
      for (const comp of companies) {
        if (comp.jobs) {
          comp.jobs = comp.jobs.filter(item => item.id !== cjId);
        }
      }
      setStored(STORAGE_KEYS.COMPANIES, companies);
      return Promise.resolve({ data: { message: "Company job deleted successfully" }, status: 200 });
    }
  }

  // 4. MATCH JOBS ALGORITHM
  if (cleanPath === '/match_jobs' && method === 'POST') {
    const userSkills = (body.skills || []).map(s => s.trim().toLowerCase()).filter(Boolean);
    if (userSkills.length === 0) return Promise.resolve({ data: [], status: 200 });

    const jobs = getStored(STORAGE_KEYS.JOBS, DEFAULT_JOBS);
    const companies = getStored(STORAGE_KEYS.COMPANIES, DEFAULT_COMPANIES);
    const matches = [];

    for (const job of jobs) {
      const jobSkills = (job.required_skills || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      if (jobSkills.length === 0) continue;

      let matchedCount = 0;
      let partialMatches = 0;

      for (const uSkill of userSkills) {
        if (jobSkills.includes(uSkill)) {
          matchedCount += 1;
        } else {
          for (const jSkill of jobSkills) {
            if (uSkill.includes(jSkill) || jSkill.includes(uSkill)) {
              partialMatches += 0.5;
              break;
            }
          }
        }
      }

      const totalMatches = matchedCount + partialMatches;
      const baseScore = (totalMatches / jobSkills.length) * 100;
      let titleBonus = 0;
      const titleLower = job.title.toLowerCase();
      for (const uSkill of userSkills) {
        if (titleLower.includes(uSkill)) titleBonus += 15;
      }
      const penalty = (jobSkills.length - totalMatches) * 2;
      const finalScore = Math.min(Math.max(baseScore + titleBonus - penalty, 0), 100);

      if (finalScore > 15) {
        // Find associated companies
        const associatedCompanies = [];
        for (const comp of companies) {
          const compJob = comp.jobs?.find(cj => cj.job_id === job.id || cj.required_skills?.includes(job.title));
          if (compJob) {
            associatedCompanies.push({
              id: comp.id,
              name: comp.name,
              email: comp.email,
              salary: compJob.salary,
              required_skills: compJob.required_skills
            });
          }
        }

        // Fallback default company if none associated yet
        if (associatedCompanies.length === 0 && companies.length > 0) {
          const defaultComp = companies[job.id % companies.length];
          associatedCompanies.push({
            id: defaultComp.id,
            name: defaultComp.name,
            email: defaultComp.email,
            salary: "₹12-18 LPA",
            required_skills: job.required_skills
          });
        }

        matches.push({
          job_id: job.id,
          title: job.title,
          job_required_skills: job.required_skills,
          match_score: Math.round(finalScore * 100) / 100,
          companies: associatedCompanies
        });
      }
    }

    matches.sort((a, b) => b.match_score - a.match_score);
    return Promise.resolve({ data: matches.slice(0, 15), status: 200 });
  }

  // 5. MATCH CANDIDATES ALGORITHM
  if (cleanPath === '/match_candidates' && method === 'POST') {
    const requiredSkills = (body.skills || []).map(s => s.trim().toLowerCase()).filter(Boolean);
    const candidates = getStored(STORAGE_KEYS.CANDIDATES, DEFAULT_CANDIDATES);

    if (requiredSkills.length === 0) return Promise.resolve({ data: candidates, status: 200 });

    const matched = candidates.filter(cand => {
      const cSkills = (cand.skills || '').toLowerCase();
      return requiredSkills.some(skill => cSkills.includes(skill));
    });

    matched.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return Promise.resolve({ data: matched, status: 200 });
  }

  // 6. LEARNING FORGE ALGORITHM
  if (cleanPath === '/learning' && method === 'POST') {
    const prompt = (body.prompt || '').toLowerCase();
    let selectedPath = null;

    for (const [, item] of Object.entries(LEARNING_PATHS)) {
      if (item.keywords.some(k => prompt.includes(k))) {
        selectedPath = item.path;
        break;
      }
    }

    if (!selectedPath) {
      selectedPath = [
        { title: "Define Core Competencies", description: `Identify fundamental principles of ${body.prompt || 'your chosen domain'}. Focus on architectural paradigms.`, difficulty: "Easy", resources: { tutorials: ["https://developer.mozilla.org/"], github_projects: [], videos: [] } },
        { title: "Intermediate Application & Frameworks", description: "Implement concrete projects using industry-standard toolchains, patterns, and state workflows.", difficulty: "Medium", resources: { tutorials: ["https://freecodecamp.org/"], github_projects: [], videos: [] } },
        { title: "Production Hardening & System Design", description: "Learn testing, CI/CD deployment, benchmarking, and defensive error handling.", difficulty: "Hard", resources: { tutorials: ["https://github.com"], github_projects: [], videos: [] } }
      ];
    }

    return Promise.resolve({
      data: {
        prompt: body.prompt,
        path: selectedPath,
        estimated_duration: `${Math.floor(Math.random() * 8) + 4} weeks`
      },
      status: 200
    });
  }

  return Promise.reject({ response: { status: 404, data: { detail: `Route not handled: ${cleanPath}` } } });
}

// Attach Sovereign Browser Engine Adapter to Axios
export function initializeSovereignEngine() {
  const isCloudWeb = typeof window !== 'undefined' && (
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('web.app') ||
    window.location.hostname.includes('firebaseapp.com') ||
    window.location.hostname.includes('vercel.app') ||
    window.location.protocol === 'file:' ||
    import.meta.env.VITE_CLIENT_DEMO === 'true'
  );

  const defaultAdapter = axios.defaults.adapter;

  axios.defaults.adapter = async function(config) {
    // If on GitHub Pages or web hosting, intercept immediately
    if (isCloudWeb) {
      return handleBrowserRequest(config);
    }

    // Otherwise, try local Python ASGI backend first; fall back to browser engine if server is offline
    try {
      if (typeof defaultAdapter === 'function') {
        return await defaultAdapter(config);
      }
      return await axios.getAdapter(config.adapter || axios.defaults.adapter)(config);
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        console.warn('Backend unreachable. Switching to Sovereign In-Browser Engine.');
        return handleBrowserRequest(config);
      }
      throw err;
    }
  };

  console.log(`[AI-PathFinder] Sovereign Engine Initialized (Web/Cloud Mode: ${isCloudWeb})`);
}
