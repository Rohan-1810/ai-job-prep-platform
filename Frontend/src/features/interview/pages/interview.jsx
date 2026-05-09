import { useState } from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/userInterview';

// Add a quick keyframe animation for the spinner inline if not in css
if (typeof document !== 'undefined' && !document.getElementById('spinner-keyframes')) {
  const style = document.createElement('style');
  style.id = 'spinner-keyframes';
  style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

// const report = {
//   "matchScore": 88,
//   "technicalQuestions": [
//     {
//       "question": "How do you handle state management in large-scale React applications?",
//       "answer": "Discuss different state management patterns, starting with component local state and lifting state up for smaller components. For larger applications, explain when and why you would use React Context API, and when a dedicated library like Redux, Zustand, or Recoil might be more appropriate. Emphasize the trade-offs (e.g., boilerplate vs. power, learning curve), immutability, and performance considerations (e.g., selective re-renders). Provide examples of when you've used these.",
//       "intention": "To assess your understanding of React's architecture, state management patterns, and your ability to choose appropriate solutions for varying application complexities."
//     },
//     {
//       "question": "Explain the concept of asynchronous programming in Node.js and how you manage callbacks, promises, and async/await.",
//       "answer": "Explain that Node.js uses a single-threaded, non-blocking I/O model based on an event loop. Describe how operations like file I/O or network requests are offloaded, allowing the main thread to remain responsive. Detail the progression from traditional callbacks (and the associated 'callback hell') to Promises as a cleaner way to handle asynchronous code. Finally, explain `async/await` as syntactic sugar over Promises, making asynchronous code more readable and maintainable by allowing it to be written in a seemingly synchronous fashion.",
//       "intention": "To evaluate your understanding of Node.js's core concurrency model and your proficiency in managing asynchronous operations effectively."
//     },
//     {
//       "question": "Describe your approach to designing and integrating RESTful APIs in a full-stack application.",
//       "answer": "Outline the principles of RESTful API design: statelessness, resource-based URLs, and standard HTTP methods (GET, POST, PUT, DELETE). Discuss important considerations like API versioning, authentication (e.g., JWT, OAuth), data serialization (typically JSON), and proper error handling with meaningful HTTP status codes and messages. For integration, describe how you would consume these APIs on the frontend (e.g., using `fetch` or Axios in React) and how you would structure the backend (e.g., using Express.js) to provide these endpoints.",
//       "intention": "To assess your knowledge of API design best practices, your ability to build robust backend services, and integrate them seamlessly with frontend applications."
//     }
//   ],
//   "behavioralQuestions": [
//     {
//       "question": "Tell me about a challenging technical problem you faced while developing a web application and how you overcame it.",
//       "answer": "Use the STAR method (Situation, Task, Action, Result). Describe a specific technical challenge you faced (e.g., performance bottleneck, complex bug, integration issue) while building a web application. Explain the steps you took to diagnose the root cause, the different solutions considered, and the one you implemented. Conclude with the positive outcome or the key lessons learned from the experience.",
//       "intention": "To assess your problem-solving skills, ability to handle challenges, and learning agility in a professional context."
//     },
//     {
//       "question": "How do you ensure the scalability and maintainability of the web applications you build?",
//       "answer": "Discuss architectural patterns and coding practices that promote maintainability and scalability. This could include modular design, clear separation of concerns (e.g., frontend/backend, component-based architecture in React), writing clean and well-documented code, consistent coding standards, and implementing automated testing (unit, integration, E2E). For scalability, mention strategies like optimizing database queries, caching, load balancing, and using appropriate data structures and algorithms.",
//       "intention": "To evaluate your understanding of software engineering best practices that lead to robust, future-proof, and easily manageable applications."
//     },
//     {
//       "question": "Describe a time you received constructive feedback on your code or work. How did you respond and what did you learn?",
//       "answer": "Using the STAR method, recall a specific instance where you received constructive criticism on your code or work. Describe the situation, the feedback itself, and your initial reaction. Then, explain the specific actions you took to address the feedback, demonstrating your openness to learning, ability to adapt, and commitment to improving your work based on input from peers or seniors. Highlight the positive outcome or how your work improved as a result.",
//       "intention": "To gauge your openness to feedback, your ability to collaborate, and your commitment to continuous improvement as a team member."
//     }
//   ],
//   "skillGaps": [
//     {
//       "skill": "Message Queues (Kafka/RabbitMQ)",
//       "severity": "high"
//     },
//     {
//       "skill": "Advanced Docker & CI/CD Pipelines",
//       "severity": "medium"
//     },
//     {
//       "skill": "Distributed Systems Design",
//       "severity": "medium"
//     },
//     {
//       "skill": "Production-level Redis management",
//       "severity": "low"
//     }
//   ],
//   "preparationPlan": [
//     {
//       "day": 1,
//       "focus": "Advanced React Concepts & Performance",
//       "tasks": [
//         "Deep dive into React Hooks (useState, useEffect, useContext, useReducer)",
//         "Study performance optimization techniques in React: memo, useCallback",
//         "Work on a small project implementing these concepts"
//       ]
//     },
//     {
//       "day": 2,
//       "focus": "Node.js Backend & API Development",
//       "tasks": [
//         "Reinforce understanding of the Node.js event loop",
//         "Practice building a robust RESTful API using Express.js",
//         "Implement authentication (e.g., JWT) and authorization mechanisms"
//       ]
//     }
//   ]
// };

// SVG Icon Components
const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const MapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const Interview = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const [expandedItems, setExpandedItems] = useState({ 0: true }); // Default first item open
  const [isDownloading, setIsDownloading] = useState(false);
  const { loading, report, getResumePdf } = useInterview()

  const handleDownload = async () => {
    setIsDownloading(true);
    await getResumePdf(report._id);
    setIsDownloading(false);
  };

  if (loading || !report) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading your <span>interview data...</span></p>
      </div>
    );
  }

  const toggleItem = (idx) => {
    setExpandedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const currentQuestions = activeTab === 'technical' ? report.technicalQuestions : 
                           activeTab === 'behavioral' ? report.behavioralQuestions : [];

  const CircularScore = ({ score }) => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    return (
      <div className="score-widget">
        <h3 className="section-title">MATCH SCORE</h3>
        <div className="circular-progress">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle className="circle-bg" cx="60" cy="60" r={radius} strokeWidth="6" />
            <circle 
              className="circle-value" 
              cx="60" cy="60" r={radius} 
              strokeWidth="6"
              style={{ strokeDasharray: circumference, strokeDashoffset }} 
            />
          </svg>
          <div className="score-text">
            <span className="num">{score}</span>
            <span className="percent">%</span>
          </div>
        </div>
        <p className="score-label">Strong match for this role</p>
      </div>
    );
  };

  return (
    <div className="interview-layout">
      <div className="interview-container">
        
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <div className="sidebar-group">
            <span className="sidebar-heading">SECTIONS</span>
            <nav className="sidebar-nav">
              <button 
                className={`nav-btn ${activeTab === 'technical' ? 'active' : ''}`}
                onClick={() => setActiveTab('technical')}
              >
                <span className="icon"><CodeIcon /></span> Technical Questions
              </button>
              <button 
                className={`nav-btn ${activeTab === 'behavioral' ? 'active' : ''}`}
                onClick={() => setActiveTab('behavioral')}
              >
                <span className="icon"><ChatIcon /></span> Behavioral Questions
              </button>
              <button 
                className={`nav-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                onClick={() => setActiveTab('roadmap')}
              >
                <span className="icon"><MapIcon /></span> Road Map
              </button>
              <button 
                className="nav-btn download-btn" 
                onClick={handleDownload}
                disabled={isDownloading}
                style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}
              >
                <span className="icon">
                  {isDownloading ? (
                    <svg className="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                  ) : (
                    <DownloadIcon />
                  )}
                </span>
                {isDownloading ? 'Preparing Resume...' : 'Download Resume PDF'}
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <header className="content-header">
            <h2>
              {activeTab === 'technical' && 'Technical Questions'}
              {activeTab === 'behavioral' && 'Behavioral Questions'}
              {activeTab === 'roadmap' && 'Preparation Road Map'}
            </h2>
            <span className="count-badge">
              {activeTab === 'roadmap' ? `${report.preparationPlan.length} days` : `${currentQuestions.length} questions`}
            </span>
          </header>

          <div className="scrollable-content">
            {(activeTab === 'technical' || activeTab === 'behavioral') && (
              <div className="accordion-list">
                {currentQuestions.map((q, idx) => {
                  const isExpanded = !!expandedItems[idx];
                  return (
                    <div key={idx} className={`accordion-item ${isExpanded ? 'expanded' : ''}`}>
                      <div className="accordion-header" onClick={() => toggleItem(idx)}>
                        <div className="question-wrap">
                          <span className="q-badge">Q{idx + 1}</span>
                          <h4 className="question-text">{q.question}</h4>
                        </div>
                        <button className="toggle-btn">
                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </div>
                      
                      {isExpanded && (
                        <div className="accordion-body">
                          <div className="info-block intention-block">
                            <span className="block-label">INTENTION</span>
                            <p>{q.intention}</p>
                          </div>
                          <div className="info-block answer-block">
                            <span className="block-label">MODEL ANSWER</span>
                            <p>{q.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="timeline-container">
                {report.preparationPlan.map((dayPlan, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="day-badge">Day {dayPlan.day}</span>
                        <h4 className="title">{dayPlan.focus}</h4>
                      </div>
                      <ul className="task-list">
                        {dayPlan.tasks.map((task, tIdx) => (
                          <li key={tIdx}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <CircularScore score={report.matchScore} />
          
          <div className="skills-widget">
            <h3 className="section-title">SKILL GAPS</h3>
            <div className="skill-tags">
              {report.skillGaps.map((gap, idx) => (
                <div key={idx} className={`skill-tag severity-${gap.severity}`}>
                  {gap.skill}
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Interview;
