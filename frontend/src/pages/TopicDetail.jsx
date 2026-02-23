import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTopicBySlug, toggleProblemCompletion } from "../services/api";
import "./TopicDetail.css";

export default function TopicDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTopicBySlug(slug)
            .then(res => {
                setTopic(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch topic", err);
                setLoading(false);
            });
    }, [slug]);

    const handleToggle = async (problemId) => {
        try {
            const res = await toggleProblemCompletion(slug, problemId);
            setTopic(res.data);
        } catch (err) {
            console.error("Failed to toggle problem", err);
        }
    };

    if (loading) return (
        <div className="topic-detail-container">
            <Navbar />
            <div className="loading-state">Loading Topic...</div>
        </div>
    );

    if (!topic) return (
        <div className="topic-detail-container">
            <Navbar />
            <div className="error-state">Topic not found.</div>
        </div>
    );

    const totalTasks = topic.problems ? topic.problems.length : 0;
    const completedTasks = topic.problems ? topic.problems.filter(p => p.completed).length : 0;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="topic-detail-container">
            <Navbar activePage="learn" />

            <header className="topic-hero">
                <button className="back-btn" onClick={() => navigate("/learn")}>← Back to Learn</button>
                <div className="hero-content">
                    <div className="topic-icon-large">{topic.icon || "📚"}</div>
                    <div className="topic-text-info">
                        <h1 className="topic-title">{topic.title}</h1>
                        <p className="topic-description">{topic.description || "Master this module to crack your dream job."}</p>
                    </div>
                </div>
            </header>

            <main className="topic-main">
                <section className="progress-card">
                    <div className="progress-info">
                        <h3>Module Progress</h3>
                        <span>{completedTasks} / {totalTasks} Problems Completed</span>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                        <span className="progress-label">{progress}%</span>
                    </div>
                </section>

                <section className="problems-section">
                    <h2 className="section-title">Preparation Tasks</h2>
                    <div className="problems-list">
                        {topic.problems && topic.problems.length > 0 ? (
                            topic.problems.map((prob) => (
                                <div key={prob._id} className={`problem-item ${prob.completed ? 'completed' : ''}`}>
                                    <div className="problem-info">
                                        <input
                                            type="checkbox"
                                            checked={prob.completed}
                                            onChange={() => handleToggle(prob._id)}
                                            id={`prob-${prob._id}`}
                                        />
                                        <label htmlFor={`prob-${prob._id}`} className="problem-title">
                                            {prob.title}
                                            <span className={`difficulty-badge ${prob.difficulty?.toLowerCase()}`}>
                                                {prob.difficulty || "Medium"}
                                            </span>
                                        </label>
                                    </div>
                                    <div className="problem-actions">
                                        <button className="solve-btn">Solve Path →</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-problems">No problems listed for this topic yet.</div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}