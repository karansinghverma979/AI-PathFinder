import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiSave, FiXCircle, FiSearch } from 'react-icons/fi';
import ConfirmationDialog from './ConfirmationDialog';
import DeveloperCard from './DeveloperCard';

const API = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") : "";

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [skills, setSkills] = useState('');
    const [location, setLocation] = useState('');
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API}/candidates`);
            setCandidates(response.data);
        } catch (err) {
            setError('Failed to fetch candidates.');
            console.error('Error fetching candidates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingCandidate(null);
        setName('');
        setEmail('');
        setSkills('');
        setLocation('');
        setFormError(null);
        setFormSuccess(null);
        setShowForm(true);
    };

    const handleEditClick = (candidate) => {
        setEditingCandidate(candidate);
        setName(candidate.name);
        setEmail(candidate.email);
        setSkills(candidate.skills);
        setLocation(candidate.location);
        setFormError(null);
        setFormSuccess(null);
        setShowForm(true);
    };

    const handleDeleteClick = (candidateId) => {
        setCandidateToDelete(candidateId);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!candidateToDelete) return;
        try {
            await axios.delete(`${API}/candidates/${candidateToDelete}`);
            setFormSuccess('Candidate deleted successfully!');
            fetchCandidates();
        } catch (err) {
            setFormError('Failed to delete candidate.');
            console.error(err);
        } finally {
            setConfirmOpen(false);
            setCandidateToDelete(null);
        }
    };

    const handleSave = async () => {
        if (!name || !email || !skills || !location) {
            setFormError('All fields are required.');
            return;
        }

        setLoading(true);
        setFormError(null);
        setFormSuccess(null);

        const candidateData = { name, email, skills, location };

        try {
            if (editingCandidate) {
                await axios.put(`${API}/candidates/${editingCandidate.id}`, candidateData);
                setFormSuccess('Candidate updated successfully!');
            } else {
                await axios.post(`${API}/candidates`, candidateData);
                setFormSuccess('Candidate added successfully!');
            }
            setShowForm(false);
            fetchCandidates();
        } catch (err) {
            setFormError('Failed to save candidate data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingCandidate(null);
        setFormError(null);
        setFormSuccess(null);
    };

    if (loading && !candidates.length) {
        return <div className="text-center p-8">Loading candidates...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    const developers = candidates.filter(c => c.is_developer);
    const regularCandidates = candidates.filter(c => !c.is_developer &&
        (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.skills.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="container mx-auto p-8">
            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Candidate"
                message="Are you sure you want to delete this candidate? This action cannot be undone."
            />

            <h1 className="text-3xl font-bold mb-6 text-center">Manage Candidates</h1>

            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search by name or skill..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button
                    onClick={handleAddClick}
                    className="primary-btn flex items-center gap-2"
                >
                    <FiPlus /> Add New Candidate
                </button>
            </div>

            {showForm && (
                <div className="bg-glass rounded-2xl p-6 shadow-2xl mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</h2>
                    
                    {formError && (
                        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">
                            {formError}
                        </div>
                    )}
                    {formSuccess && (
                        <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4">
                            {formSuccess}
                        </div>
                    )}

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field mb-3"
                        placeholder="Full Name"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field mb-3"
                        placeholder="Email Address"
                    />
                    <textarea
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="input-field resize-none h-24 mb-3"
                        placeholder="Skills (comma separated, e.g., Python, React, SQL)"
                    />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="input-field mb-3"
                        placeholder="Location (e.g., City, Country)"
                    />

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleSave}
                            className="primary-btn flex items-center gap-2"
                            disabled={loading}
                        >
                            <FiSave /> {editingCandidate ? 'Update Candidate' : 'Save Candidate'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="secondary-btn flex items-center gap-2"
                            disabled={loading}
                        >
                            <FiXCircle /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {(developers.length + regularCandidates.length) === 0 ? (
                <div className="text-center p-8 text-slate-400">No candidates found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render Developer Profiles First */}
                    {developers.map((candidate) => (
                        <DeveloperCard key={candidate.id} candidate={candidate} />
                    ))}
                    
                    {/* Render Regular Candidate Profiles */}
                    {regularCandidates.map((candidate) => (
                        <div key={candidate.id} className="bg-glass p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-xl font-semibold mb-2">{candidate.name}</h2>
                            <p className="text-gray-400 mb-2">{candidate.email}</p>
                            <p className="text-gray-200"><strong>Skills:</strong> {candidate.skills}</p>
                            <p className="text-gray-200"><strong>Location:</strong> {candidate.location}</p>
                            <p className="text-sm text-gray-500 mt-4">
                                Last Updated: {new Date(candidate.updated_at).toLocaleString()}
                            </p>
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => handleEditClick(candidate)}
                                    className="secondary-btn flex items-center gap-2 text-sm px-3 py-1"
                                >
                                    <FiEdit /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(candidate.id)}
                                    className="danger-btn flex items-center gap-2 text-sm px-3 py-1"
                                >
                                    <FiTrash2 /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Candidates;