import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import StreakCelebration from "../components/StreakCelebration";
import { getUserProfile, updateStreak, updateNotificationSettings } from "../services/api";
import { startNotificationScheduler, stopNotificationScheduler } from "../utils/notificationScheduler";
import "./Reminders.css";

const Reminders = () => {
    const [time, setTime] = useState("20:00");
    const [streak, setStreak] = useState(0);
    const [alreadyStudied, setAlreadyStudied] = useState(false);
    const [loadingStreak, setLoadingStreak] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [userName, setUserName] = useState("");
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationStreak, setCelebrationStreak] = useState(0);

    useEffect(() => {
        // Fetch User Profile on Mount
        const fetchProfile = async () => {
            try {
                const res = await getUserProfile();
                setUserName(res.data.name || "Student");
                setStreak(res.data.streak || 0);
                if (res.data.notificationTime) setTime(res.data.notificationTime);
                if (res.data.notificationEnabled) {
                    setNotifEnabled(true);
                    // Re-arm scheduler on page load if notifications are enabled
                    if (Notification.permission === "granted") {
                        startNotificationScheduler(
                            res.data.notificationTime,
                            res.data.name || "Student"
                        );
                    }
                }

                if (res.data.lastStudiedDate) {
                    const lastDate = new Date(res.data.lastStudiedDate);
                    const today = new Date();

                    if (
                        lastDate.getFullYear() === today.getFullYear() &&
                        lastDate.getMonth() === today.getMonth() &&
                        lastDate.getDate() === today.getDate()
                    ) {
                        setAlreadyStudied(true);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user profile", err);
            }
        };
        fetchProfile();

        // PWA Install Prompt Logic
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleStudyClick = async () => {
        if (alreadyStudied) return;
        setLoadingStreak(true);
        try {
            const res = await updateStreak();
            setStreak(res.data.streak);
            setAlreadyStudied(true);
            setCelebrationStreak(res.data.streak);
            setShowCelebration(true);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                // Backend caught it (Already studied today)
                setAlreadyStudied(true);
            }
            console.error("Failed to update streak", err);
        } finally {
            setLoadingStreak(false);
        }
    };

    const handleEnableNotifications = async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
            return;
        }

        let permission = Notification.permission;
        if (permission !== "granted" && permission !== "denied") {
            permission = await Notification.requestPermission();
        }

        if (permission === "granted") {
            try {
                await updateNotificationSettings({ time, enabled: true });
                setNotifEnabled(true);
                // Start the scheduler immediately
                startNotificationScheduler(time, userName);
                alert(`Daily notification activated for ${time} ⏰`);
            } catch (error) {
                console.error("Failed to save notification settings", error);
            }
        } else {
            alert("Notification permission denied!");
            setNotifEnabled(false);
        }
    };

    const handleDisableNotifications = async () => {
        try {
            await updateNotificationSettings({ enabled: false });
            setNotifEnabled(false);
            stopNotificationScheduler();
            alert("Daily notifications disabled 🔕");
        } catch (error) {
            console.error("Failed to disable notifications", error);
        }
    };

    const testNotification = () => {
        if (Notification.permission === "granted") {
            new Notification(`${userName}'s DSA Journey 🚀`, {
                body: "This is a test! Looking good 🔥",
                icon: "/vite.svg"
            });
        } else {
            alert("Please enable notifications first!");
        }
    };

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            alert("App is already installed or your browser doesn't support direct PWA installation. You can usually install it from your browser's menu!");
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <div className="reminders-container">
            <Navbar activePage="reminders" />

            {/* HERO BANNER */}
            <div className="reminders-hero">
                <h1 className="rh-title">Daily Reminders 🔔</h1>
                <p className="rh-subtitle">
                    Never miss a study session, {userName}.<br />
                    We'll ping your phone every day!
                </p>
            </div>

            <main className="reminders-content">

                {/* Card 1: Streak */}
                <div className="r-card">
                    <div className="streak-header">
                        <div>
                            <h2 className="rc-title">Your Study Streak 🔥</h2>
                            <p className="rc-subtitle">Hit the button after every session!</p>
                        </div>
                        <div className="streak-count">
                            <span className="streak-number">{streak}</span>
                            <span className="streak-label">{streak === 1 ? "day" : "days"}</span>
                        </div>
                    </div>
                    <button
                        className="btn-primary-teal"
                        onClick={handleStudyClick}
                        disabled={alreadyStudied || loadingStreak}
                        style={{
                            opacity: alreadyStudied ? 0.6 : 1,
                            cursor: alreadyStudied ? 'not-allowed' : 'pointer',
                            backgroundColor: alreadyStudied ? "#475569" : ""
                        }}
                    >
                        {alreadyStudied ? "✅ Studied Today!" : (loadingStreak ? "Saving..." : "🔥 I studied today!")}
                    </button>
                </div>

                {/* Card 2: Notification Setup */}
                <div className="r-card">
                    <h2 className="rc-title">Set Daily Notification ⏰</h2>
                    <p className="rc-subtitle">
                        Pick a time and we'll send a notification to your phone every day — even when the app is closed (once installed).
                    </p>

                    <div className="time-picker-row">
                        <div className="time-input-wrap">
                            <input
                                type="text"
                                className="time-input"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                            <span className="time-icon">🕒</span>
                        </div>
                        <button
                            className="btn-primary-coral"
                            onClick={handleEnableNotifications}
                        >
                            Enable
                        </button>
                    </div>

                    <div className="notification-actions">
                        <button
                            className="btn-secondary"
                            onClick={handleDisableNotifications}
                            style={{ opacity: notifEnabled ? 1 : 0.5 }}
                        >
                            🔕 Off
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={testNotification}
                        >
                            🔔 Send Test Notification
                        </button>
                    </div>
                </div>




                {/* Card 4: Tips List */}
                <div className="r-card tips-card">
                    <h2 className="rc-title">Study Tips for {userName} 💡</h2>
                    <div className="tips-list">

                        <div className="tip-item">
                            <div className="tip-icon">⏰</div>
                            <div className="tip-content">
                                <div className="tip-title">30 mins beats 5 hours</div>
                                <div className="tip-desc">Consistency is everything. Even 20 mins counts. Never skip 2 days in a row.</div>
                            </div>
                        </div>

                        <div className="tip-item">
                            <div className="tip-icon">✍️</div>
                            <div className="tip-content">
                                <div className="tip-title">Always code it yourself</div>
                                <div className="tip-desc">Don't just read solutions. A bad attempt that fails teaches more than watching.</div>
                            </div>
                        </div>

                        <div className="tip-item">
                            <div className="tip-icon">📢</div>
                            <div className="tip-content">
                                <div className="tip-title">Talk through your solution</div>
                                <div className="tip-desc">Interviews test communication. Practice saying your approach out loud.</div>
                            </div>
                        </div>

                        <div className="tip-item">
                            <div className="tip-icon">🎯</div>
                            <div className="tip-content">
                                <div className="tip-title">You're in 2nd year — perfect timing!</div>
                                <div className="tip-desc">Most students start DSA in 4th year when it's too late. You have a 2-year head start. Use it.</div>
                            </div>
                        </div>

                    </div>
                </div>

            </main>

            {showCelebration && (
                <StreakCelebration
                    streak={celebrationStreak}
                    onComplete={() => setShowCelebration(false)}
                />
            )}
        </div>
    );
};

export default Reminders;
