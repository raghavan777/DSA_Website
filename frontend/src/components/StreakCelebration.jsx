import React, { useEffect, useState, useRef } from "react";
import "./StreakCelebration.css";

const PARTICLE_COUNT = 24;
const EMOJIS = ["🔥", "⭐", "✨", "💥", "🎯", "🚀", "💪"];

const StreakCelebration = ({ streak, onComplete }) => {
    const [visible, setVisible] = useState(false);
    const [countUp, setCountUp] = useState(0);
    const [particles, setParticles] = useState([]);
    const timerRef = useRef(null);

    useEffect(() => {
        // Generate random particles
        const newParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
            id: i,
            emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            x: Math.random() * 100,
            delay: Math.random() * 0.6,
            duration: 1.2 + Math.random() * 1.0,
            size: 14 + Math.random() * 18,
            angle: Math.random() * 360,
        }));
        setParticles(newParticles);
        setVisible(true);

        // Count-up animation
        const target = streak;
        const start = Math.max(0, target - 1);
        setCountUp(start);
        setTimeout(() => setCountUp(target), 400);

        // Auto-dismiss after 2.5s
        timerRef.current = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onComplete?.(), 400);
        }, 2500);

        return () => clearTimeout(timerRef.current);
    }, [streak, onComplete]);

    const handleDismiss = () => {
        clearTimeout(timerRef.current);
        setVisible(false);
        setTimeout(() => onComplete?.(), 400);
    };

    return (
        <div className={`streak-celebration-overlay ${visible ? "active" : ""}`} onClick={handleDismiss}>
            {/* Particle burst */}
            <div className="streak-particles">
                {particles.map(p => (
                    <span
                        key={p.id}
                        className="streak-particle"
                        style={{
                            left: `${p.x}%`,
                            fontSize: `${p.size}px`,
                            "--delay": `${p.delay}s`,
                            "--duration": `${p.duration}s`,
                        }}
                    >
                        {p.emoji}
                    </span>
                ))}
            </div>

            {/* Central celebration content */}
            <div className="streak-celebration-card">
                <div className="streak-fire-glow" />
                <div className="streak-fire-icon">🔥</div>
                <div className="streak-celebration-count">{countUp}</div>
                <div className="streak-celebration-label">
                    {countUp === 1 ? "Day Streak!" : "Day Streak!"}
                </div>
                <div className="streak-celebration-sub">Keep it going! 💪</div>
            </div>
        </div>
    );
};

export default StreakCelebration;
