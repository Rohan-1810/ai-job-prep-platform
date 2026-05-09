import "../style/Home.scss";
import { useInterview } from "../hooks/userInterview";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { FileText, User, Upload, Sparkles, Clock, Trash2 } from "lucide-react";

const Home = () => {
    const { loading, generateReport, reports, deleteReport } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [deletingId, setDeletingId] = useState(null)

    const resumeInputRef = useRef(null)
    const navigate = useNavigate()

    const handleDelete = async (e, id) => {
        e.preventDefault()
        const confirmed = window.confirm("Are you sure you want to delete this report?")
        if (!confirmed) return

        setDeletingId(id)
        const result = await deleteReport(id)
        setDeletingId(null)

        if (!result.success) {
            alert("Failed to delete the report. Please try again.")
        }
    }

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    if(loading){
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p className="loading-text">Generating your <span>interview plan...</span></p>
            </div>
        )
    }
    return (
        <>
        <main className="home">
            <div className="page-header">
                <h1>
                    <Sparkles className="header-icon" />
                    Create Your Custom {" "}
                    <span className="highlight"> Interview Plan</span>
                </h1>
                <p>AI-Powered Job Preparation & Interview Insights</p>
            </div>

            <div className="column">
                <div className="card">
                    <h2>
                        <FileText className="icon" />
                        Role Requirements
                    </h2>

                    <textarea
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="job-desc-area"
                        placeholder="Paste the full job description here..."
                    ></textarea>
                </div>
            </div>

            <div className="column">
                <div className="card">
                    <h2>
                        <User className="icon" />
                        Candidate Profile
                    </h2>

                    <div className="input-group">
                        <label htmlFor="selfDesription">Self Description & Goals</label>
                        <textarea
                            onChange={(e) => setSelfDescription(e.target.value)}
                            placeholder="Describe your background..."
                        ></textarea>
                    </div>

                    <div className="input-group" style={{ marginTop: '0.5rem' }}>
                        <label htmlFor="resume">Resume Document</label>

                        <div className="file-upload-area">
                            <Upload className="upload-icon" />
                            <p className="upload-text">Upload Resume (PDF)</p>
                            <span className="upload-subtext">Drag and drop or click</span>
                            <input ref={resumeInputRef} type="file" accept=".pdf" />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerateReport}
                        className="generate-btn"
                    >
                        Generate Interview Report
                    </button>
                </div>
            </div>
        </main>

        <section className="reports-section">
            <div className="reports-container card">
                <h2>
                    <FileText className="icon" />
                    Your Past Interview Reports
                </h2>
                {reports && reports.length > 0 ? (
                    <ul className="reports-list">
                        {reports.map((report) => (
                            <li key={report._id} className="report-item">
                                <Link to={`/interview/${report._id}`} className="report-link">
                                    <span className="report-title">{report.title}</span>
                                    <span className="report-date">
                                        <Clock size={14} className="date-icon" />
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </span>
                                </Link>
                                <button 
                                    className="delete-item-btn" 
                                    onClick={(e) => handleDelete(e, report._id)}
                                    disabled={deletingId === report._id}
                                    title="Delete Report"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-reports-message">
                        <p>No reports generated yet. Fill out the details above to create one!</p>
                    </div>
                )}
            </div>
        </section>

        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <Link to="/privacy-policy">Privacy Policy</Link>
                    <Link to="/terms-of-service">Terms of Service</Link>
                    <Link to="/help-center">Help Center</Link>
                </div>
                <p>&copy; {new Date().getFullYear()} Interview Plan AI. All rights reserved.</p>
            </div>
        </footer>
        </>
    );
};

export default Home;