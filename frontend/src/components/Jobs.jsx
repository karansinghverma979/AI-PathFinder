import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiSave, FiXCircle, FiSearch } from 'react-icons/fi';
import ConfirmationDialog from './ConfirmationDialog';

const API = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") : "";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [title, setTitle] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [isUpdateConfirmOpen, setUpdateConfirmOpen] = useState(false);
    const [jobToUpdate, setJobToUpdate] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API}/jobs`);
            setJobs(response.data);
        } catch (err) {
            setError('Failed to fetch jobs.');
            console.error('Error fetching jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingJob(null);
        setTitle('');
        setRequiredSkills('');
        setFormError(null);
        setFormSuccess(null);
        setShowForm(true);
    };

    const handleEditClick = (job) => {
        setEditingJob(job);
        setTitle(job.title);
        setRequiredSkills(job.required_skills);
        setFormError(null);
        setFormSuccess(null);
        setShowForm(true);
    };

    const handleDeleteClick = (jobId) => {
        setJobToDelete(jobId);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!jobToDelete) return;
        try {
            await axios.delete(`${API}/jobs/${jobToDelete}`);
            setFormSuccess('Job deleted successfully!');
            fetchJobs();
        } catch (err) {
            setFormError('Failed to delete job.');
            console.error(err);
        } finally {
            setDeleteConfirmOpen(false);
            setJobToDelete(null);
        }
    };

    const handleSave = async () => {
        if (!title || !requiredSkills) {
            setFormError('All fields are required.');
            return;
        }

        setLoading(true);
        setFormError(null);
        setFormSuccess(null);

        const jobData = { title, required_skills: requiredSkills };

        if (editingJob) {
            // Editing an existing job
            if (editingJob.title.toLowerCase() !== title.toLowerCase()) {
                // Title has been changed, check for duplicates
                const existingJob = jobs.find(j => j.id !== editingJob.id && j.title.toLowerCase() === title.toLowerCase());
                if (existingJob) {
                    setFormError(`A job with the title "${title}" already exists.`);
                    setLoading(false);
                    return;
                }
            }
            // No duplicate title, or title is unchanged. Proceed with update.
            try {
                await axios.put(`${API}/jobs/${editingJob.id}`, jobData);
                setFormSuccess('Job updated successfully!');
                setShowForm(false);
                setEditingJob(null);
                fetchJobs();
            } catch (err) {
                setFormError('Failed to update job.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            // Creating a new job
            const existingJob = jobs.find(j => j.title.toLowerCase() === title.toLowerCase());
            if (existingJob) {
                setJobToUpdate(existingJob);
                setUpdateConfirmOpen(true);
                setLoading(false);
                return;
            }
            // No duplicate, proceed with creation
            try {
                await axios.post(`${API}/jobs`, jobData);
                setFormSuccess('Job added successfully!');
                setShowForm(false);
                fetchJobs();
            } catch (err) {
                setFormError('Failed to create job.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleConfirmUpdate = async () => {
        setUpdateConfirmOpen(false);
        if (!jobToUpdate) return;

        setLoading(true);
        setFormError(null);
        setFormSuccess(null);
        
        const jobData = { title: jobToUpdate.title, required_skills: requiredSkills };

        try {
            await axios.put(`${API}/jobs/${jobToUpdate.id}`, jobData);
            setFormSuccess(`Job "${jobToUpdate.title}" updated successfully!`);
            setShowForm(false);
            fetchJobs();
        } catch (err) {
            setFormError('Failed to update job.');
            console.error(err);
        } finally {
            setLoading(false);
            setJobToUpdate(null);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingJob(null);
        setFormError(null);
        setFormSuccess(null);
    };

    if (loading && !jobs.length) {
        return <div className="text-center p-8">Loading jobs...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.required_skills.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Jobs</h1>

            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search by title or skill..."
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
                    <FiPlus /> Add New Job
                </button>
            </div>

            <ConfirmationDialog
                isOpen={isUpdateConfirmOpen}
                onClose={() => setUpdateConfirmOpen(false)}
                onConfirm={handleConfirmUpdate}
                title="Job Already Exists"
                message={`A job with the title "${title}" already exists. Do you want to update it with the new information?`}
                confirmText="Update Previous"
                cancelText="Select New Name"
            />

            <ConfirmationDialog
                isOpen={isDeleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Job"
                message="Are you sure you want to delete this job? This action cannot be undone."
            />

            {showForm && (
                <div className="bg-glass rounded-2xl p-6 shadow-2xl mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
                    
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-field mb-3"
                        placeholder="Job Title"
                    />
                    <textarea
                        value={requiredSkills}
                        onChange={(e) => setRequiredSkills(e.target.value)}
                        className="input-field resize-none h-24 mb-3"
                        placeholder="Required Skills (comma separated, e.g., Python, React, SQL)"
                    />

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleSave}
                            className="primary-btn flex items-center gap-2"
                            disabled={loading}
                        >
                            <FiSave /> {editingJob ? 'Update Job' : 'Save Job'}
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

            {filteredJobs.length === 0 ? (
                <div className="text-center p-8 text-slate-400">No jobs found. Add one above!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="bg-glass p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                            <p className="text-gray-200"><strong>Skills:</strong> {job.required_skills}</p>
                            <p className="text-sm text-gray-500 mt-4">
                                Last Updated: {new Date(job.updated_at).toLocaleString()}
                            </p>
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => handleEditClick(job)}
                                    className="secondary-btn flex items-center gap-2 text-sm px-3 py-1"
                                >
                                    <FiEdit /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(job.id)}
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

export default Jobs;