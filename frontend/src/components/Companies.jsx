import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiSave, FiXCircle, FiChevronDown, FiBriefcase, FiSearch } from 'react-icons/fi';
import CreatableSelect from 'react-select/creatable';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationDialog from './ConfirmationDialog';

const API = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") : "";

import { selectStyles } from '../styles/reactSelectStyles';

const CompanyForm = ({ editingCompany, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (editingCompany) {
            setName(editingCompany.name);
            setEmail(editingCompany.email);
        }
    }, [editingCompany]);

    const handleSave = async () => {
        if (!name || !email) {
            setFormError('Name and email are required.');
            return;
        }
        onSave({ name, email });
    };

    return (
        <div className="bg-glass rounded-2xl p-6 shadow-2xl mb-8">
            <h2 className="text-2xl font-semibold mb-4">{editingCompany ? 'Edit Company' : 'Add New Company'}</h2>
            {formError && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{formError}</div>}
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field mb-3" placeholder="Company Name" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field mb-3" placeholder="Company Email" />
            <div className="flex gap-3 mt-4">
                <button onClick={handleSave} className="primary-btn flex items-center gap-2"><FiSave /> Save Company</button>
                <button onClick={onCancel} className="secondary-btn flex items-center gap-2"><FiXCircle /> Cancel</button>
            </div>
        </div>
    );
};

const JobRequirementForm = ({ company, editingJob, jobs, onSave, onCancel, onJobCreated }) => {
    const [jobId, setJobId] = useState('');
    const [salary, setSalary] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [formError, setFormError] = useState(null);
    const [isCreatingJob, setCreatingJob] = useState(false);

    useEffect(() => {
        if (editingJob) {
            setJobId(editingJob.job_id);
            setSalary(editingJob.salary);
            setRequiredSkills(editingJob.required_skills);
        }
    }, [editingJob]);

    const handleSave = () => {
        if (!jobId || !salary || !requiredSkills) {
            setFormError('All fields are required.');
            return;
        }
        onSave({ job_id: jobId, salary, required_skills: requiredSkills });
    };
    
    const handleCreateJob = async (inputValue) => {
        setCreatingJob(true);
        try {
            const response = await axios.post(`${API}/jobs`, { title: inputValue, required_skills: "Newly Created" });
            const newJob = response.data;
            onJobCreated(newJob);
            setJobId(newJob.id);
        } catch (error) {
            setFormError(`Failed to create job: ${error.response?.data?.detail || error.message}`);
        } finally {
            setCreatingJob(false);
        }
    };

    const jobOptions = jobs.map(j => ({ value: j.id, label: j.title }));

    return (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-slate-800/50 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-semibold mb-3">{editingJob ? 'Edit Job Requirement' : 'Add Job Requirement'}</h3>
            {formError && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{formError}</div>}
            <CreatableSelect
                isClearable
                isDisabled={isCreatingJob}
                isLoading={isCreatingJob}
                onChange={(opt) => setJobId(opt ? opt.value : '')}
                onCreateOption={handleCreateJob}
                options={jobOptions}
                value={jobOptions.find(opt => opt.value === jobId)}
                styles={selectStyles}
                className="mb-3"
                placeholder="Select or create a job title..."
            />
            <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} className="input-field mb-3" placeholder="Offered Salary" />
            <textarea value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} className="input-field resize-none h-24 mb-3" placeholder="Skills for this job" />
            <div className="flex gap-3">
                <button onClick={handleSave} className="primary-btn flex items-center gap-2"><FiSave /> Save Requirement</button>
                <button onClick={onCancel} className="secondary-btn flex items-center gap-2"><FiXCircle /> Cancel</button>
            </div>
        </motion.div>
    );
};

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCompanyForm, setShowCompanyForm] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [showJobForm, setShowJobForm] = useState({ companyId: null, editingJob: null });
    const [expandedCompany, setExpandedCompany] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCompanyDeleteConfirmOpen, setCompanyDeleteConfirmOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [isJobDeleteConfirmOpen, setJobDeleteConfirmOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    useEffect(() => {
        fetchCompanies();
        fetchJobsForDropdown();
    }, []);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}/companies`);
            setCompanies(response.data);
        } catch (err) {
            setError('Failed to fetch companies.');
        } finally {
            setLoading(false);
        }
    };

    const fetchJobsForDropdown = async () => {
        try {
            const response = await axios.get(`${API}/jobs`);
            setJobs(response.data);
        } catch (err) {
            console.error('Failed to fetch jobs for dropdown:', err);
        }
    };

    const handleSaveCompany = async (companyData) => {
        setFormSuccess(null);
        try {
            if (editingCompany) {
                await axios.put(`${API}/companies/${editingCompany.id}`, companyData);
                setFormSuccess('Company updated successfully!');
            } else {
                await axios.post(`${API}/companies`, companyData);
                setFormSuccess('Company added successfully!');
            }
            setShowCompanyForm(false);
            setEditingCompany(null);
            fetchCompanies();
        } catch (err) {
            alert(`Failed to save company: ${err.response?.data?.detail || err.message}`);
        }
    };
    
    const handleSaveJobRequirement = async (jobData) => {
        setFormSuccess(null);
        try {
            if (showJobForm.editingJob) {
                await axios.put(`${API}/company_jobs/${showJobForm.editingJob.id}`, jobData);
                setFormSuccess('Job requirement updated successfully!');
            } else {
                await axios.post(`${API}/companies/${showJobForm.companyId}/jobs`, jobData);
                setFormSuccess('Job requirement added successfully!');
            }
            setShowJobForm({ companyId: null, editingJob: null });
            fetchCompanies();
        } catch (err) {
            alert(`Failed to save job requirement: ${err.response?.data?.detail || err.message}`);
        }
    };

    const handleDeleteCompany = (companyId) => {
        setCompanyToDelete(companyId);
        setCompanyDeleteConfirmOpen(true);
    };

    const confirmDeleteCompany = async () => {
        if (!companyToDelete) return;
        try {
            await axios.delete(`${API}/companies/${companyToDelete}`);
            setFormSuccess('Company deleted successfully!');
            fetchCompanies();
        } catch (err) {
            alert('Failed to delete company.');
        } finally {
            setCompanyDeleteConfirmOpen(false);
            setCompanyToDelete(null);
        }
    };

    const handleDeleteJobRequirement = (companyJobId) => {
        setJobToDelete(companyJobId);
        setJobDeleteConfirmOpen(true);
    };

    const confirmDeleteJobRequirement = async () => {
        if (!jobToDelete) return;
        try {
            await axios.delete(`${API}/company_jobs/${jobToDelete}`);
            setFormSuccess('Job requirement deleted successfully!');
            fetchCompanies();
        } catch (err) {
            alert('Failed to delete job requirement.');
        } finally {
            setJobDeleteConfirmOpen(false);
            setJobToDelete(null);
        }
    };

    const handleJobCreated = (newJob) => {
        setJobs(prev => [...prev, newJob]);
    };

    const getJobTitle = (jobId) => jobs.find(j => j.id === jobId)?.title || 'Unknown Job';

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-8">
            <ConfirmationDialog
                isOpen={isCompanyDeleteConfirmOpen}
                onClose={() => setCompanyDeleteConfirmOpen(false)}
                onConfirm={confirmDeleteCompany}
                title="Delete Company"
                message="Are you sure? This will delete the company and all its job requirements."
            />
            <ConfirmationDialog
                isOpen={isJobDeleteConfirmOpen}
                onClose={() => setJobDeleteConfirmOpen(false)}
                onConfirm={confirmDeleteJobRequirement}
                title="Delete Job Requirement"
                message="Are you sure you want to delete this job requirement?"
            />

            <h1 className="text-3xl font-bold mb-6 text-center">Manage Companies</h1>
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search by company name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button onClick={() => { setEditingCompany(null); setShowCompanyForm(true); }} className="primary-btn flex items-center gap-2"><FiPlus /> Add New Company</button>
            </div>

            {formSuccess && (
                <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4">
                    {formSuccess}
                </div>
            )}

            <AnimatePresence>
                {showCompanyForm && <CompanyForm editingCompany={editingCompany} onSave={handleSaveCompany} onCancel={() => setShowCompanyForm(false)} />}
            </AnimatePresence>

            {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
                <div className="space-y-4">
                    {filteredCompanies.map(company => (
                        <div key={company.id} className="bg-glass p-4 rounded-lg">
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}>
                                <h2 className="text-xl font-semibold">{company.name}</h2>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-400">{company.jobs.length} Job Posting(s)</span>
                                    <motion.div animate={{ rotate: expandedCompany === company.id ? 180 : 0 }}><FiChevronDown /></motion.div>
                                </div>
                            </div>
                            <AnimatePresence>
                                {expandedCompany === company.id && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <div className="border-t border-slate-700 mt-4 pt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-slate-400">{company.email}</p>
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setEditingCompany(company); setShowCompanyForm(true); }} className="secondary-btn-sm"><FiEdit /></button>
                                                    <button onClick={() => handleDeleteCompany(company.id)} className="danger-btn-sm"><FiTrash2 /></button>
                                                </div>
                                            </div>
                                            <h3 className="text-md font-bold mt-4 mb-2">Job Requirements:</h3>
                                            <div className="space-y-2">
                                                {company.jobs.map(job => (
                                                    <div key={job.id} className="bg-slate-900/50 p-3 rounded-md flex justify-between items-start">
                                                        <div>
                                                            <p className="font-bold">{getJobTitle(job.job_id)}</p>
                                                            <p className="text-sm">Salary: {job.salary}</p>
                                                            <p className="text-sm">Skills: {job.required_skills}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setShowJobForm({ companyId: company.id, editingJob: job })} className="secondary-btn-sm"><FiEdit /></button>
                                                            <button onClick={() => handleDeleteJobRequirement(job.id)} className="danger-btn-sm"><FiTrash2 /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => setShowJobForm({ companyId: company.id, editingJob: null })} className="primary-btn mt-4 flex items-center gap-2"><FiPlus /> Add Job Requirement</button>
                                            
                                            <AnimatePresence>
                                                {showJobForm.companyId === company.id && <JobRequirementForm company={company} editingJob={showJobForm.editingJob} jobs={jobs} onSave={handleSaveJobRequirement} onCancel={() => setShowJobForm({ companyId: null, editingJob: null })} onJobCreated={handleJobCreated} />}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Companies;