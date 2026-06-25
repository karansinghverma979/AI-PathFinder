import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiBookOpen, FiUsers, FiTarget, FiLayers, FiHome, FiInfo } from "react-icons/fi";
import Candidates from "./components/Candidates";
import Jobs from "./components/Jobs";
import Companies from "./components/Companies";
import TabButton from "./components/TabButton";
import CareerTab from "./components/CareerTab";
import LearningTab from "./components/LearningTab";
import HiringTab from "./components/HiringTab";
import AboutTab from "./components/AboutTab";

function App() {
  const [tab, setTab] = useState("career");

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-5xl mx-auto"
      >
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-500">AI-PathFinder</h1>
          <p className="mt-2 text-slate-400">Your Personal AI-Powered Career & Learning Co-Pilot</p>
        </header>

        <nav className="flex justify-center gap-3 mb-8">
          <TabButton active={tab === "career"} onClick={() => setTab("career")} icon={<FiLayers />}>CAREER</TabButton>
          <TabButton active={tab === "learning"} onClick={() => setTab("learning")} icon={<FiBookOpen />}>LEARNING</TabButton>
          <TabButton active={tab === "hiring"} onClick={() => setTab("hiring")} icon={<FiTarget />}>HIRING</TabButton>
          <TabButton active={tab === "candidates"} onClick={() => setTab("candidates")} icon={<FiUsers />}>CANDIDATES</TabButton>
          <TabButton active={tab === "jobs"} onClick={() => setTab("jobs")} icon={<FiBriefcase />}>JOBS</TabButton>
          <TabButton active={tab === "companies"} onClick={() => setTab("companies")} icon={<FiHome />}>COMPANIES</TabButton>
          <TabButton active={tab === "about"} onClick={() => setTab("about")} icon={<FiInfo />}>ABOUT</TabButton>
        </nav>

        <motion.div
          className="bg-glass rounded-2xl p-6 shadow-2xl"
          initial={{ scale: 0.995 }}
          animate={{ scale: 1 }}
        >
          {tab === "career" && <CareerTab />}
          {tab === "learning" && <LearningTab />}
          {tab === "hiring" && <HiringTab />}
          {tab === "candidates" && <Candidates />}
          {tab === "jobs" && <Jobs />}
          {tab === "companies" && <Companies />}
          {tab === "about" && <AboutTab />}
        </motion.div>

        <footer className="mt-12 text-center text-sm text-slate-500">
          AI-PathFinder &copy; 2025
        </footer>
      </motion.div>
    </div>
  );
}

export default App;