import Topic from "../models/Topic.js";
import User from "../models/User.js";
import UserProgress from "../models/UserProgress.js";

export const getTopics = async (req, res) => {
    try {
        const topics = await Topic.find().sort({ createdAt: -1 });

        // Get per-user completions
        let completedSet = new Set();
        if (req.user) {
            const progress = await UserProgress.findOne({ user: req.user._id });
            if (progress) {
                completedSet = new Set(progress.completedProblems);
            }
        }

        // Merge per-user completion into topic data
        const topicsWithProgress = topics.map(topic => {
            const topicObj = topic.toObject();
            if (topicObj.problems) {
                topicObj.problems = topicObj.problems.map(prob => ({
                    ...prob,
                    completed: completedSet.has(prob._id.toString()),
                }));
            }
            return topicObj;
        });

        res.json(topicsWithProgress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createTopic = async (req, res) => {
    try {
        const topic = new Topic(req.body);
        await topic.save();
        res.json(topic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTopicBySlug = async (req, res) => {
    try {
        const topic = await Topic.findOne({ slug: req.params.slug });
        res.json(topic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const toggleProblemCompletion = async (req, res) => {
    try {
        const { topicSlug, problemId } = req.params;
        const userId = req.user._id;

        const topic = await Topic.findOne({ slug: topicSlug });
        if (!topic) return res.status(404).json({ message: "Topic not found" });

        const problem = topic.problems.id(problemId);
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        // Get or create user progress
        let progress = await UserProgress.findOne({ user: userId });
        if (!progress) {
            progress = new UserProgress({ user: userId, completedProblems: [] });
        }

        const probIdStr = problemId.toString();
        const isCompleted = progress.completedProblems.includes(probIdStr);

        if (isCompleted) {
            // Remove from completed
            progress.completedProblems = progress.completedProblems.filter(id => id !== probIdStr);
        } else {
            // Add to completed
            progress.completedProblems.push(probIdStr);
        }

        await progress.save();

        // If problem was just marked as COMPLETED, update streak (once per day)
        let streakUpdated = false;
        let newStreak = 0;
        if (!isCompleted) {
            try {
                const user = await User.findById(userId);
                if (user) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    let lastStudied = user.lastStudiedDate ? new Date(user.lastStudiedDate) : null;
                    if (lastStudied) {
                        lastStudied.setHours(0, 0, 0, 0);
                    }

                    if (!lastStudied || lastStudied.getTime() !== today.getTime()) {
                        let streakIncrement = 1;
                        if (lastStudied) {
                            const diffTime = Math.abs(today - lastStudied);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            if (diffDays > 1 && user.streak > 0) {
                                user.streak = 0;
                            }
                        }
                        user.streak += streakIncrement;
                        user.lastStudiedDate = new Date();
                        await user.save();
                        streakUpdated = true;
                        newStreak = user.streak;
                    }
                }
            } catch (streakErr) {
                console.error("Streak update during problem toggle failed:", streakErr.message);
            }
        }

        // Return topic with per-user completion merged
        const completedSet = new Set(progress.completedProblems);
        const topicObj = topic.toObject();
        topicObj.problems = topicObj.problems.map(prob => ({
            ...prob,
            completed: completedSet.has(prob._id.toString()),
        }));

        res.json({ ...topicObj, streakUpdated, newStreak });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};