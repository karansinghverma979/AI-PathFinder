import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiSearch, FiMail, FiRefreshCw } from 'react-icons/fi';
import SkillPill from './SkillPill';
import NotFoundDialog from './NotFoundDialog';
import ContactDetailsDialog from './ContactDetailsDialog';

const API = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") : "";

const CareerTab = () => {
  const [candidateSkills, setCandidateSkills] = useState("");
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNotFoundDialogOpen, setNotFoundDialog] = useState(false);
  const [contactModal, setContactModal] = useState({ isOpen: false, email: "", title: "" });

  const findMatchingJobs = async () => {
    if (!candidateSkills.trim()) {
      setError("Please enter your skills.");
      return;
    }

    setLoading(true);
    setError(null);
    setMatchedJobs([]);

    try {
      const skillsArray = candidateSkills.split(',').map(s => s.trim()).filter(s => s);
      const response = await axios.post(`${API}/match_jobs`, { skills: skillsArray });
      setMatchedJobs(response.data);
      if (response.data.length === 0) {
        setNotFoundDialog(true);
      } else {
        setNotFoundDialog(false);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to fetch matching jobs. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (companyEmail, jobTitle) => {
    setContactModal({
      isOpen: true,
      email: companyEmail,
      title: `Apply for ${jobTitle}`
    });
  };

  const resetForm = () => {
    setCandidateSkills("");
    setMatchedJobs([]);
    setError(null);
  };

  const candidateSkillsLower = candidateSkills.toLowerCase().split(',').map(s => s.trim());

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">Find Matching Jobs</h2>
      <p className="text-slate-400 mb-4">Enter your skills to find job titles that align with your profile.</p>
      
      {error && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <textarea
        value={candidateSkills}
        onChange={(e) => setCandidateSkills(e.target.value)}
        className="input-field resize-none h-24"
        placeholder="Enter your skills (comma separated), e.g., Python, React, SQL"
      />

      <div className="mt-6 flex gap-3">
        <button
          onClick={findMatchingJobs}
          className="primary-btn flex items-center gap-2"
          disabled={loading}
        >
          {loading ? "Searching..." : "Find Matching Jobs"}
          {!loading && <FiSearch />}
        </button>
        <button onClick={resetForm} className="secondary-btn flex items-center gap-2">
          <FiRefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      {matchedJobs.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Matching Job Titles</h3>
          <div className="space-y-4">
            {matchedJobs.map((job) => (
              <div key={job.job_id} className="p-4 bg-glass border border-slate-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-bold">{job.title}</h4>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-400">Match Score</p>
                    <p className="text-2xl font-bold text-green-400">{job.match_score.toFixed(2)}%</p>
                  </div>
                </div>
                <div className="mt-2">
                    <p className="text-sm font-bold mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                        {job.job_required_skills.split(',').map(skill => (
                            <SkillPill key={skill} text={skill.trim()} />
                        ))}
                    </div>
                </div>

                {job.companies && job.companies.length > 0 && (
                    <div className="mt-4">
                        <h5 className="text-md font-semibold mb-2">Companies Offering This Job:</h5>
                        <div className="space-y-2">
                            {job.companies.map((company) => (
                                <div key={company.id} className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-bold">{company.name}</p>
                                        <p className="text-xs text-slate-400">Salary: {company.salary}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {(company.required_skills || "").split(',').map(skill => (
                                                <SkillPill 
                                                    key={skill} 
                                                    text={skill.trim()} 
                                                    pro={candidateSkillsLower.includes(skill.trim().toLowerCase())} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleApply(company.email, job.title)}
                                        className="primary-btn flex items-center gap-1 text-sm px-3 py-1"
                                    >
                                        <FiMail /> Apply
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <NotFoundDialog
        isOpen={isNotFoundDialogOpen}
        onClose={() => setNotFoundDialog(false)}
        title="No Matching Jobs Found"
        message="We couldn't find any jobs that match the skills you entered."
        suggestions={[
            "Try using different or more general keywords.",
            "Check for any typos in your skills.",
            "Broaden your search criteria."
        ]}
      />

      <ContactDetailsDialog 
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal({ ...contactModal, isOpen: false })}
        title={contactModal.title}
        contactInfo={[
          { label: "Company Email", value: contactModal.email, icon: <FiMail /> }
        ]}
      />
    </div>
  );
};

export default CareerTab;