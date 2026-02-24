import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import StreakCelebration from "../components/StreakCelebration";
import { getTopics } from "../services/api";
import "./Learn.css";
import {
    Youtube, Zap, BookOpen, LayoutGrid, RefreshCw,
    Folders, Link, Layers, Trees, Network,
    Search, Maximize, Puzzle, Mic, X, Play
} from "lucide-react";
import { toggleProblemCompletion } from "../services/api";

const ARRAYS_AND_STRINGS_FALLBACK = [
    {
        title: "Big O Notation",
        description: "Understand O(1), O(n), O(n²), O(log n). Critical foundation for every interview.",
        resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=IR_S8BC8KI0" }]
    },
    {
        title: "Array Traversal, Insertion, Deletion",
        description: "Write arrays from scratch. Understand index access and shifting.",
        resources: [{ name: "GFG", type: "gfg", link: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/" }]
    },
    {
        title: "LeetCode #1 - Two Sum",
        description: "Classic array + hashmap. Most asked interview question ever.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/two-sum/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=KLlXCFG5TnA" }
        ]
    },
    {
        title: "LeetCode #121 - Buy & Sell Stock",
        description: "Track running minimum. O(n) greedy. Very common.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=1pkOgXD63yU" }
        ]
    },
    {
        title: "LeetCode #217 - Contains Duplicate",
        description: "One-pass hashset solution.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/contains-duplicate/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=3OamzN90kPg" }
        ]
    },
    {
        title: "LeetCode #242 - Valid Anagram",
        description: "Character frequency comparison using a hashmap.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/valid-anagram/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=9UtInBqnCgA" }
        ]
    },
    {
        title: "LeetCode #344 - Reverse String",
        description: "Two-pointer in-place reversal.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/reverse-string/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=_d0T_2Lk2qA" }
        ]
    },
    {
        title: "LeetCode #125 - Valid Palindrome",
        description: "Skip non-alphanumeric, use two pointers.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/valid-palindrome/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=jJXJ16kPFWg" }
        ]
    }
];

const RECURSION_FALLBACK = [
    {
        title: "Call Stack + Base Case",
        description: "Draw recursion trees for factorial & fibonacci. Essential mental model.",
        resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=IJDJ0kBx2LM" }]
    },
    {
        title: "Implement Factorial & Fibonacci",
        description: "Code both recursively, then iteratively. Compare them.",
        resources: [{ name: "GFG", type: "gfg", link: "https://www.geeksforgeeks.org/dsa/introduction-to-recursion-2/" }]
    },
    {
        title: "LeetCode #509 - Fibonacci Number",
        description: "Recursive + memoized version.",
        resources: [{ name: "Solve", type: "solve", link: "https://leetcode.com/problems/fibonacci-number/description/" }]
    }
];

const HASH_MAPS_FALLBACK = [
    {
        title: "Hash Map Internals",
        description: "Key-value storage, hash function, collision handling, O(1) average.",
        resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=shs0KM3wKv8" }]
    },
    {
        title: "LeetCode #49 - Group Anagrams",
        description: "Sort each string as key, group values. Classic hashing.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/group-anagrams/description/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=vzdNOK2oB2E" }
        ]
    },
    {
        title: "LeetCode #347 - Top K Frequent Elements",
        description: "Hashmap + bucket sort. Important medium.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/top-k-frequent-elements/description/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=YPTqKIgVk-k" }
        ]
    },
    {
        title: "LeetCode #128 - Longest Consecutive Sequence",
        description: "O(n) set lookup technique. Excellent for testing set logic.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/longest-consecutive-sequence/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=P6RZZMu_maU" }
        ]
    }
];

const LINKED_LISTS_FALLBACK = [
    {
        title: "Build a Linked List from Scratch",
        description: "Node class, insert, delete, traverse. Understand head → next → null.",
        resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=Hj_rA0dhr2I" }]
    },
    {
        title: "LeetCode #206 - Reverse Linked List",
        description: "Must know cold. Iterative + recursive both.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/reverse-linked-list/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=G0_I-ZF0S38" }
        ]
    },
    {
        title: "LeetCode #141 - Detect Cycle",
        description: "Floyd's slow & fast pointer. O(1) space.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/linked-list-cycle/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=gBTe7lFR3vc" }
        ]
    },
    {
        title: "LeetCode #21 - Merge Two Sorted Lists",
        description: "Classic merge. Foundation of merge sort.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=XIdigk956u0" }
        ]
    }
];

const STACKS_QUEUES_FALLBACK = [
    {
        title: "Stack & Queue Concepts",
        description: "LIFO vs FIFO. Implement both using arrays/lists.",
        resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=wjI1WNcIntg" }]
    },
    {
        title: "LeetCode #20 - Valid Parentheses",
        description: "Most common stack problem in interviews.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/valid-parentheses/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=WTzjTskDFMg" }
        ]
    },
    {
        title: "LeetCode #155 - Min Stack",
        description: "Stack that returns min in O(1). Great design problem.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/min-stack/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=WxCuL3jleUA" }
        ]
    }
];

const TREES_BST_FALLBACK = [
    {
        title: "BFS & DFS Traversals",
        description: "Inorder, preorder, postorder (DFS). Level order (BFS). Draw on paper first.",
        resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=pcKY4hjDrxk" }]
    },
    {
        title: "LeetCode #104 - Max Depth of Binary Tree",
        description: "Simple DFS recursion. Perfect starter.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=hTM3phVI6YQ" }
        ]
    },
    {
        title: "LeetCode #226 - Invert Binary Tree",
        description: "Recursive swap of left and right children.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/invert-binary-tree/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=OnSn2XEQ4MY" }
        ]
    },
    {
        title: "LeetCode #98 - Validate BST",
        description: "Pass min/max bounds through recursion.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/validate-binary-search-tree/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=s6ATEkipzow" }
        ]
    }
];

const GRAPHS_FALLBACK = [
    {
        title: "Graph Representations",
        description: "Adjacency list vs matrix. Directed vs undirected. Build from scratch.",
        resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=tWVWeAqZ0WU" }]
    },
    {
        title: "BFS & DFS Templates",
        description: "Implement both. Memorise the visited-set pattern.",
        resources: [{ name: "GFG", type: "gfg", link: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" }]
    },
    {
        title: "LeetCode #200 - Number of Islands",
        description: "DFS flood-fill. One of the most popular interview questions ever.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/number-of-islands/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=pV2kpPD66nE" }
        ]
    },
    {
        title: "LeetCode #133 - Clone Graph",
        description: "BFS + hashmap for visited nodes.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/clone-graph/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=mQeF6bN8hMk" }
        ]
    }
];

const BINARY_SEARCH_FALLBACK = [
    {
        title: "Binary Search Template",
        description: "Memorise: lo=0, hi=n-1, mid=(lo+hi)//2. Understand boundary conditions.",
        resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=s4DPM8ct1pI" }]
    },
    {
        title: "LeetCode #704 - Binary Search",
        description: "Basic. Iterative AND recursive.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/binary-search/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=s4DPM8ct1pI" }
        ]
    },
    {
        title: "LeetCode #33 - Search in Rotated Sorted Array",
        description: "Modified binary search. Very common interview variant.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=U8XENwh8Oy8" }
        ]
    }
];

const SLIDING_WINDOW_FALLBACK = [
    {
        title: "Sliding Window Pattern",
        description: "Fixed vs variable window. Very high ROI — shows up everywhere in interviews.",
        resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=MK-NZ4hN7rs" }]
    },
    {
        title: "LeetCode #3 - Longest Substring No Repeat",
        description: "Variable window + hashmap. Top 5 most-asked problem.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=wiGpQwVHdE0" }
        ]
    },
    {
        title: "LeetCode #15 - 3Sum",
        description: "Sort + two pointers. Medium but very common.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/3sum/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=jzZsG8n2R9A" }
        ]
    },
    {
        title: "LeetCode #11 - Container With Most Water",
        description: "Two-pointer greedy. Elegant O(n).",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/container-with-most-water/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=UuiTKBwPgAo" }
        ]
    }
];

const DP_FALLBACK = [
    {
        title: "DP Fundamentals - Memo vs Tabulation",
        description: "Top-down vs bottom-up. Draw the subproblem tree.",
        resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=oBt53YbR9Kk" }]
    },
    {
        title: "LeetCode #70 - Climbing Stairs",
        description: "Intro DP. Same recurrence as Fibonacci.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/climbing-stairs/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=Y0lT9Fck7qI" }
        ]
    },
    {
        title: "LeetCode #198 - House Robber",
        description: "1D DP. Rob max without adjacent houses.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/house-robber/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=73r3KWiEvyk" }
        ]
    },
    {
        title: "LeetCode #322 - Coin Change",
        description: "Classic bottom-up DP. One of the most important patterns.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/coin-change/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=H9bfqozjoqs" }
        ]
    },
    {
        title: "LeetCode #1143 - Longest Common Subsequence",
        description: "2D DP. Must-know for string DP.",
        resources: [
            { name: "Solve", type: "solve", link: "https://leetcode.com/problems/longest-common-subsequence/" },
            { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=Ua0GhsJSlWM" }
        ]
    }
];

const MOCK_INTERVIEWS_FALLBACK = [
    {
        title: "Neetcode 150 - Weak Topic Review",
        description: "Resolve 1 problem from each shaky topic.",
        resources: [{ name: "Practice", type: "solve", link: "https://neetcode.io/practice" }]
    },
    {
        title: "Timed Mock Interview #1",
        description: "2 Easy + 1 Medium randomly. 45-min timer. No hints.",
        resources: [{ name: "Random", type: "solve", link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" }]
    },
    {
        title: "Timed Mock Interview #2",
        description: "Different problems. Talk through your thinking out loud.",
        resources: [{ name: "Practice", type: "solve", link: "https://neetcode.io/practice" }]
    },
    {
        title: "Behavioral Questions (STAR format)",
        description: "Prepare: Tell me about yourself, challenges, teamwork, why this company.",
        resources: [{ name: "Guide", type: "video", link: "https://www.youtube.com/watch?v=PJKYqLP6MRE" }]
    },
    {
        title: "Resume & LinkedIn Update",
        description: "Add your DSA practice, technologies, any projects. Ask for referrals!",
        resources: []
    }
];

const SLUG_TO_FALLBACK = {
    "arrays": ARRAYS_AND_STRINGS_FALLBACK,
    "recursion": RECURSION_FALLBACK,
    "hash": HASH_MAPS_FALLBACK,
    "linked": LINKED_LISTS_FALLBACK,
    "stacks": STACKS_QUEUES_FALLBACK,
    "trees": TREES_BST_FALLBACK,
    "graphs": GRAPHS_FALLBACK,
    "binary-search": BINARY_SEARCH_FALLBACK,
    "sliding": SLIDING_WINDOW_FALLBACK,
    "dp": DP_FALLBACK,
    "mock": MOCK_INTERVIEWS_FALLBACK,
};

const normalizeTitle = (value = "") =>
    value
        .toLowerCase()
        .replace(/(—|–||)/g, "-")
        .replace(/\s+/g, " ")
        .trim();

const getDisplayProblems = (topic) => {
    if (!topic?.slug) return topic?.problems || [];

    const slug = topic.slug.toLowerCase();

    // Find the matching fallback by checking if the slug includes the key
    let fallbackProblems = null;
    for (const [key, fallback] of Object.entries(SLUG_TO_FALLBACK)) {
        if (slug.includes(key) || slug === key) {
            fallbackProblems = fallback;
            break;
        }
    }

    if (!fallbackProblems) return topic?.problems || [];

    const existingByTitle = new Map(
        (topic.problems || []).map((problem) => [normalizeTitle(problem.title), problem])
    );

    return fallbackProblems.map((problem) => {
        const existing = existingByTitle.get(normalizeTitle(problem.title));
        return {
            ...problem,
            _id: existing?._id,
            completed: existing?.completed || false
        };
    });
};

const getTopicIconDetails = (topic) => {
    const iconStyles = { size: 28, strokeWidth: 2 };
    const slug = topic.slug?.toLowerCase() || "";
    if (slug.includes('arrays')) return <LayoutGrid {...iconStyles} color="#ff2a85" />;
    if (slug.includes('recursion')) return <RefreshCw {...iconStyles} color="#00f0ff" />;
    if (slug.includes('hash-maps') || slug.includes('hash')) return <Folders {...iconStyles} color="#ffea00" />;
    if (slug.includes('linked-list')) return <Link {...iconStyles} color="#ff2a85" />;
    if (slug.includes('stacks') || slug.includes('queues')) return <Layers {...iconStyles} color="#00f0ff" />;
    if (slug.includes('tree')) return <Trees {...iconStyles} color="#39ff14" />;
    if (slug.includes('graph')) return <Network {...iconStyles} color="#ff2a85" />;
    if (slug.includes('binary-search')) return <Search {...iconStyles} color="#00f0ff" />;
    if (slug.includes('window') || slug.includes('pointer')) return <Maximize {...iconStyles} color="#ffea00" />;
    if (slug.includes('dp') || slug.includes('dynamic')) return <Puzzle {...iconStyles} color="#39ff14" />;
    if (slug.includes('mock') || slug.includes('interview')) return <Mic {...iconStyles} color="#cbd5e1" />;
    return topic.icon ? <span className="emoji-icon">{topic.icon}</span> : <LayoutGrid {...iconStyles} color="#00f0ff" />;
};

const TopicModal = ({ topic, onClose, onToggleProblem }) => {
    if (!topic) return null;

    const displayProblems = getDisplayProblems(topic);
    const slug = topic.slug.toLowerCase();

    const modalIcon = getTopicIconDetails(topic);
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-drag-handle" />
                <button className="modal-close" onClick={onClose}><X size={24} /></button>

                <header className="modal-header">
                    <div className="modal-icon-wrap">
                        {modalIcon}
                    </div>
                    <div className="modal-title-area">
                        <h2 className="modal-title">{topic.title}</h2>
                        <div className="modal-subtitle">PHASE {topic.phase} · WEEK {topic.week}</div>
                    </div>
                </header>

                <div className="modal-body">
                    <div className="problem-list">
                        {displayProblems.map((prob, idx) => (
                            <div key={prob._id || `${topic.slug}-${idx}`} className={`modal-problem-item ${prob.completed ? 'completed' : ''}`}>
                                <div className="mp-left">
                                    <input
                                        type="checkbox"
                                        className="mp-checkbox"
                                        checked={prob.completed}
                                        disabled={!prob._id}
                                        onChange={() => prob._id && onToggleProblem(topic.slug, prob._id)}
                                    />
                                    <div className="mp-info">
                                        <div className="mp-title">{prob.title}</div>
                                        {prob.description && <div className="mp-description">{prob.description}</div>}

                                        <div className="mp-actions">
                                            {prob.resources && prob.resources.map((res, i) => (
                                                res.link && res.link !== "#" ? (
                                                    <a
                                                        key={i}
                                                        href={res.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`mp-chip mp-chip-link ${res.type}`}
                                                    >
                                                        {res.type === 'video' && <Play size={12} fill="currentColor" />}
                                                        {res.type === 'gfg' && <BookOpen size={12} />}
                                                        {res.type === 'solve' && <Zap size={12} fill="currentColor" />}
                                                        {res.type === 'solution' && <Play size={12} fill="currentColor" />}
                                                        {res.name}
                                                    </a>
                                                ) : (
                                                    <button key={i} type="button" className={`mp-chip ${res.type}`}>
                                                        {res.type === 'video' && <Play size={12} fill="currentColor" />}
                                                        {res.type === 'gfg' && <BookOpen size={12} />}
                                                        {res.type === 'solve' && <Zap size={12} fill="currentColor" />}
                                                        {res.type === 'solution' && <Play size={12} fill="currentColor" />}
                                                        {res.name}
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Learn = () => {
    const [searchParams] = useSearchParams();
    const initialPhase = searchParams.get("phase") || "All Topics";
    const [activeFilter, setActiveFilter] = useState(initialPhase);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationStreak, setCelebrationStreak] = useState(0);

    useEffect(() => {
        getTopics()
            .then(res => {
                setTopics(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch topics", err);
                setLoading(false);
            });
    }, []);

    const handleToggleProblem = async (slug, problemId) => {
        try {
            // Find current completion state before toggling
            const currentTopic = topics.find(t => t.slug === slug);
            const currentProblem = currentTopic?.problems?.find(p => p._id === problemId);
            const wasCompleted = currentProblem?.completed || false;

            const res = await toggleProblemCompletion(slug, problemId);
            // Update local state
            setTopics(prev => prev.map(t => t.slug === slug ? res.data : t));
            if (selectedTopic && selectedTopic.slug === slug) {
                setSelectedTopic(res.data);
            }

            // If streak was updated by the backend, show celebration
            if (!wasCompleted && res.data.streakUpdated) {
                setCelebrationStreak(res.data.newStreak);
                setShowCelebration(true);
            }
        } catch (err) {
            console.error("Failed to toggle problem", err);
        }
    };

    const getPhaseStyles = (phase) => {
        switch (phase) {
            case 1: return { bg: "rgba(255, 42, 133, 0.15)", text: "#ff2a85", border: "rgba(255, 42, 133, 0.3)" }; // Neon Pink
            case 2: return { bg: "rgba(0, 240, 255, 0.15)", text: "#00f0ff", border: "rgba(0, 240, 255, 0.3)" }; // Neon Cyan
            case 3: return { bg: "rgba(255, 234, 0, 0.15)", text: "#ffea00", border: "rgba(255, 234, 0, 0.3)" }; // Neon Yellow
            case 4: return { bg: "rgba(57, 255, 20, 0.15)", text: "#39ff14", border: "rgba(57, 255, 20, 0.3)" }; // Neon Green
            default: return { bg: "rgba(255, 255, 255, 0.05)", text: "#cbd5e1", border: "rgba(255, 255, 255, 0.1)" };
        }
    };



    const getResourceIcon = (type) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('youtube')) return <Youtube size={14} fill="currentColor" strokeWidth={2} />;
        if (lowerType.includes('leetcode')) return <Zap size={14} fill="currentColor" strokeWidth={2} />;
        if (lowerType.includes('gfg')) return <BookOpen size={14} strokeWidth={2.5} />;
        if (lowerType.includes('neetcode')) return <BookOpen size={14} strokeWidth={2.5} />;
        if (lowerType.includes('striver')) return <Youtube size={14} fill="currentColor" strokeWidth={2} />;
        return null;
    };

    const getSortedTopics = (topicsList) => {
        return [...topicsList].sort((a, b) => {
            if (a.phase !== b.phase) return a.phase - b.phase;
            const getStartWeek = (w) => parseInt(w.split('-')[0]) || 0;
            return getStartWeek(a.week) - getStartWeek(b.week);
        });
    };

    const filteredTopics = getSortedTopics(
        activeFilter === "All Topics"
            ? topics
            : topics.filter(t => `Phase ${t.phase}` === activeFilter)
    );

    const filterOptions = ["All Topics", "Phase 1", "Phase 2", "Phase 3", "Phase 4"];

    const totalProblems = topics.reduce((sum, t) => sum + (t.problems ? t.problems.length : 0), 0);
    const totalDone = topics.reduce((sum, t) => sum + (t.problems ? t.problems.filter(p => p.completed).length : 0), 0);
    const overallProgress = totalProblems === 0 ? 0 : Math.round((totalDone / totalProblems) * 100);

    return (
        <div className="learn-container split-layout">
            <Navbar activePage="learn" />

            <main className="learn-split-wrapper">
                {/* LEFT VISUAL PANEL */}
                <div className="learn-split-left">
                    <div className="split-orb"></div>
                    <div className="split-orb-2"></div>
                    <div className="split-grid"></div>

                    <div className="split-left-content">
                        <div className="learn-header-info">
                            <h1 className="learn-title">DSA Learning Path</h1>
                            <p className="learn-subtitle">Structured topics to crack your dream company.</p>
                        </div>

                        <div className="global-progress">
                            <div className="gp-stats">
                                <div className="gp-stat-item">
                                    <span className="gp-val coral">{totalDone} / {totalProblems}</span>
                                    <span className="gp-label">Solved</span>
                                </div>
                                <div className="gp-stat-item">
                                    <span className="gp-val blue">{overallProgress}%</span>
                                    <span className="gp-label">Progress</span>
                                </div>
                            </div>
                            <div className="gp-bar-bg">
                                <div className="gp-bar-fill" style={{ width: `${overallProgress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT INTERACTIVE PANEL */}
                <div className="learn-split-right">
                    <div className="split-right-inner">
                        <div className="filters-section">
                            <div className="filter-row">
                                {filterOptions.map(filter => (
                                    <button
                                        key={filter}
                                        className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
                                        onClick={() => setActiveFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="topic-grid">
                            {loading ? (
                                <div style={{ padding: 20, color: "white" }}>Loading Topics...</div>
                            ) : filteredTopics.map((topic) => {
                                const pStyles = getPhaseStyles(topic.phase);
                                const totalTasks = topic.problems ? topic.problems.length : 0;
                                const completedTasks = topic.problems ? topic.problems.filter(p => p.completed).length : 0;
                                const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

                                return (
                                    <div
                                        key={topic._id}
                                        className="topic-card"
                                        onClick={() => setSelectedTopic(topic)}
                                    >
                                        <div className="tc-header">
                                            <div className="tc-title-area">
                                                <div className="tc-icon-wrap">
                                                    {getTopicIconDetails(topic)}
                                                </div>
                                                <div className="tc-info">
                                                    <h2 className="tc-title">{topic.title}</h2>
                                                    <div className="tc-subtitle">
                                                        PHASE {topic.phase} · WEEK {topic.week}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="tc-phase-badge"
                                                style={{ backgroundColor: pStyles.bg, color: pStyles.text, border: `1px solid ${pStyles.border}` }}
                                            >
                                                Phase {topic.phase}
                                            </div>
                                        </div>

                                        <div className="tc-progress-area">
                                            <div className="tc-progress-labels">
                                                <span className="tasks-count">{completedTasks} / {totalTasks} Tasks</span>
                                                <span className="percent-count">{progress}%</span>
                                            </div>
                                            <div className="tc-progress-bar-bg">
                                                <div className="tc-progress-bar-fill" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>

                                        {topic.resources && (
                                            <div className="tc-actions">
                                                {topic.resources.map((res, idx) => (
                                                    res.link && res.link !== "#" ? (
                                                        <a
                                                            key={idx}
                                                            href={res.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`action-chip ${res.type}`}
                                                        >
                                                            {getResourceIcon(res.type)}
                                                            {res.name}
                                                        </a>
                                                    ) : (
                                                        <span key={idx} className={`action-chip ${res.type}`}>
                                                            {getResourceIcon(res.type)}
                                                            {res.name}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <TopicModal
                topic={selectedTopic}
                onClose={() => setSelectedTopic(null)}
                onToggleProblem={handleToggleProblem}
            />

            {showCelebration && (
                <StreakCelebration
                    streak={celebrationStreak}
                    onComplete={() => setShowCelebration(false)}
                />
            )}
        </div>
    );
};

export default Learn;
