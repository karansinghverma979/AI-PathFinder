import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiMail, FiRefreshCw } from 'react-icons/fi';
import NotFoundDialog from './NotFoundDialog';
import SkillPill from './SkillPill';
import ContactDetailsDialog from './ContactDetailsDialog';

const API = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") : "";

const HiringTab = () => {
  const [requiredSkills, setRequiredSkills] = useState("");
  const [matchedCandidates, setMatchedCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNotFoundDialogOpen, setNotFoundDialog] = useState(false);
  const [contactModal, setContactModal] = useState({ isOpen: false, email: "", name: "" });

  const handleSearch = async () => {
    if (!requiredSkills.trim()) {
      setError("Please enter required skills.");
      return;
    }

    setLoading(true);
    setError(null);
    setMatchedCandidates([]);

    try {
      const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(s => s);
      const response = await axios.post(`${API}/match_candidates`, { skills: skillsArray });
      setMatchedCandidates(response.data);
      if (response.data.length === 0) {
        setNotFoundDialog(true);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to fetch matching candidates. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproach = (candidateEmail, candidateName) => {
    setContactModal({
      isOpen: true,
      email: candidateEmail,
      name: candidateName
    });
  };

  const resetForm = () => {
    setRequiredSkills("");
    setMatchedCandidates([]);
    setError(null);
  };

  const requiredSkillsLower = requiredSkills.toLowerCase().split(',').map(s => s.trim());

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><FiUsers /> Find Matching Candidates</h2>
      <p className="text-slate-400 mb-4">Enter the skills your company requires to find suitable candidates.</p>
      
      {error && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <textarea
        value={requiredSkills}
        onChange={(e) => setRequiredSkills(e.target.value)}
        className="input-field resize-none h-24"
        placeholder="Enter required skills (comma separated), e.g., Python, SQL, AWS"
      />

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSearch}
          className="primary-btn flex items-center gap-2"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Candidates"}
          {!loading && <FiSearch />}
        </button>
        <button onClick={resetForm} className="secondary-btn flex items-center gap-2">
          <FiRefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      {matchedCandidates.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Matching Candidates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedCandidates.map((candidate) => (
              <div key={candidate.id} className="p-4 bg-glass border border-slate-700 rounded-lg flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold">{candidate.name}</h4>
                  <p className="text-sm text-slate-400">{candidate.email}</p>
                  <p className="text-sm text-slate-300 mt-1"><strong>Location:</strong> {candidate.location}</p>
                  <div className="mt-2">
                      <p className="text-sm font-bold mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                          {candidate.skills.split(',').map(skill => (
                              <SkillPill 
                                key={skill} 
                                text={skill.trim()} 
                                pro={requiredSkillsLower.includes(skill.trim().toLowerCase())} 
                                />
                          ))}
                      </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => handleApproach(candidate.email, candidate.name)}
                    className="secondary-btn w-full flex items-center justify-center gap-2 text-sm px-3 py-2"
                  >
                    <FiMail /> Approach Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <NotFoundDialog
        isOpen={isNotFoundDialogOpen}
        onClose={() => setNotFoundDialog(false)}
        title="No Candidates Found"
        message="We couldn't find any candidates that match the skills you entered."
        suggestions={[
            "Try using different or more general keywords.",
            "Check for any typos in your skills.",
            "Consider broadening your search criteria."
        ]}
      />

      <ContactDetailsDialog 
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal({ ...contactModal, isOpen: false })}
        title={`Approach ${contactModal.name}`}
        contactInfo={[
          { label: "Candidate Email", value: contactModal.email, icon: <FiMail /> }
        ]}
      />
    </div>
  );
};

export default HiringTab;
