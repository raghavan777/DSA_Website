import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Topic from "./models/Topic.js";

dotenv.config();
connectDB();

const topicsData = [
    {
        slug: "arrays-and-strings",
        title: "Arrays & Strings",
        phase: 1,
        week: "1-4",
        icon: "🔢",
        description: "Fundamental data structures for every engineer.",
        resources: [
            { name: "YouTube", type: "youtube", link: "https://www.youtube.com/watch?v=n60Dn0UsbEk" },
            { name: "LeetCode", type: "leetcode", link: "https://leetcode.com/tag/array/" },
            { name: "GFG", type: "gfg", link: "https://www.geeksforgeeks.org/array-data-structure-guide/" }
        ],
        problems: [
            {
                title: "Big O Notation",
                description: "Understand O(1), O(n), O(n²), O(log n). Critical foundation for every interview.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=IR_S8BC8KI0" }]
            },
            {
                title: "Array Traversal, Insertion, Deletion",
                description: "Write arrays from scratch. Understand index access and shifting.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "GFG", type: "gfg", link: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/" }]
            },
            {
                title: "LeetCode #1 — Two Sum",
                description: "Classic array + hashmap. Most asked interview question ever.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/two-sum/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=KLlXCFG5TnA" }
                ]
            },
            {
                title: "LeetCode #121 — Buy & Sell Stock",
                description: "Track running minimum. O(n) greedy. Very common.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=1pkOgXD63yU" }
                ]
            },
            {
                title: "LeetCode #217 — Contains Duplicate",
                description: "One-pass hashset solution.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/contains-duplicate/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=3OamzN90kPg" }
                ]
            },
            {
                title: "LeetCode #242 — Valid Anagram",
                description: "Character frequency comparison using a hashmap.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/valid-anagram/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=9Wt7dK_zKzE" }
                ]
            }
        ]
    },
    {
        slug: "recursion",
        title: "Recursion",
        phase: 1,
        week: "3-4",
        icon: "🔄",
        description: "Mastering the art of self-referential functions.",
        resources: [
            { name: "YouTube", type: "youtube", link: "https://www.youtube.com/watch?v=IJDJ0kBx2LM" },
            { name: "GFG", type: "gfg", link: "https://www.geeksforgeeks.org/dsa/introduction-to-recursion-2/" }
        ],
        problems: [
            {
                title: "Fibonacci Number",
                description: "Classic recursion intro. Understand the recursive tree.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/fibonacci-number/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=pE7kZ57hG9U" }
                ]
            },
            {
                title: "Climbing Stairs",
                description: "Intro DP problem solved recursively with memoization.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/climbing-stairs/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=Y0lT9Fck7qI" }
                ]
            },
            {
                title: "Power of Three",
                description: "Check if a number is a power of three without loops.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/power-of-three/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=LqA4P_s_Kqw" }
                ]
            }
        ]
    },
    {
        slug: "hash-maps",
        title: "Hash Maps & Sets",
        phase: 2,
        week: "5-6",
        icon: "🗂️",
        description: "Optimal lookups and storage. Master key-value pairs and unique collections.",
        resources: [
            { name: "YouTube", type: "youtube", link: "https://www.youtube.com/watch?v=shs0KM3wKv8" },
            { name: "LeetCode", type: "leetcode", link: "https://leetcode.com/tag/hash-table/" }
        ],
        problems: [
            {
                title: "Hash Map Internals",
                description: "Key-value storage, hash function, collision handling, O(1) average.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=shs0KM3wKv8" }]
            },
            {
                title: "LeetCode #49 — Group Anagrams",
                description: "Sort each string as key, group values. Classic hashing.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/group-anagrams/description/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=vzdNOK2oB2E" }
                ]
            },
            {
                title: "LeetCode #347 — Top K Frequent Elements",
                description: "Hashmap + bucket sort. Important medium.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/top-k-frequent-elements/description/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=YPTqKIgVk-k" }
                ]
            },
            {
                title: "LeetCode #128 — Longest Consecutive Sequence",
                description: "O(n) set lookup technique. Excellent for testing set logic.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/longest-consecutive-sequence/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=P6RZZMu_maU" }
                ]
            }
        ]
    },
    {
        slug: "linked-lists",
        title: "Linked Lists",
        phase: 2,
        week: "7-8",
        icon: "🔗",
        description: "Linear data structures with pointers. Master node manipulation and traversals.",
        resources: [
            { name: "YouTube", type: "youtube", link: "https://www.youtube.com/watch?v=Hj_rA0dhr2I" },
            { name: "LeetCode", type: "leetcode", link: "https://leetcode.com/tag/linked-list/" }
        ],
        problems: [
            {
                title: "Build a Linked List from Scratch",
                description: "Node class, insert, delete, traverse. Understand head → next → null.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=Hj_rA0dhr2I" }]
            },
            {
                title: "LeetCode #206 — Reverse Linked List",
                description: "Must know cold. Iterative + recursive both.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/reverse-linked-list/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=G0_I-ZF0S38" }
                ]
            },
            {
                title: "LeetCode #141 — Detect Cycle",
                description: "Floyd's slow & fast pointer. O(1) space.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/linked-list-cycle/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=gBTe7lFR3vc" }
                ]
            },
            {
                title: "LeetCode #21 — Merge Two Sorted Lists",
                description: "Classic merge. Foundation of merge sort.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=XIdigk956u0" }
                ]
            }
        ]
    },
    {
        slug: "stacks-queues",
        title: "Stacks & Queues",
        phase: 2,
        week: "9-10",
        icon: "📚",
        description: "LIFO and FIFO implementation. Master data flow control.",
        resources: [
            { name: "YouTube", type: "youtube", link: "https://www.youtube.com/watch?v=wjI1WNcIntg" },
            { name: "LeetCode", type: "leetcode", link: "https://leetcode.com/tag/stack/" }
        ],
        problems: [
            {
                title: "Stack & Queue Concepts",
                description: "LIFO vs FIFO. Implement both using arrays/lists.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=wjI1WNcIntg" }]
            },
            {
                title: "LeetCode #20 — Valid Parentheses",
                description: "Most common stack problem in interviews.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/valid-parentheses/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=WTzjTskDFMg" }
                ]
            },
            {
                title: "LeetCode #155 — Min Stack",
                description: "Stack that returns min in O(1). Great design problem.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/min-stack/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=WxCuL3jleUA" }
                ]
            }
        ]
    },
    {
        slug: "trees-bst",
        title: "Trees & BST",
        phase: 2,
        week: "11-12",
        icon: "🌳",
        description: "Hierarchical data structures. Master recursion and balanced trees.",
        resources: [
            { name: "YouTube", type: "youtube", link: "https://www.youtube.com/watch?v=fAAZixBzIAI" },
            { name: "LeetCode", type: "leetcode", link: "https://leetcode.com/tag/tree/" },
            { name: "Neetcode", type: "neetcode", link: "https://neetcode.io/roadmap" }
        ],
        problems: [
            {
                title: "BFS & DFS Traversals",
                description: "Inorder, preorder, postorder (DFS). Level order (BFS). Draw on paper first.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=pcKY4hjDrxk" }]
            },
            {
                title: "LeetCode #104 — Max Depth of Binary Tree",
                description: "Simple DFS recursion. Perfect starter.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=hTM3phVI6YQ" }
                ]
            },
            {
                title: "LeetCode #226 — Invert Binary Tree",
                description: "Recursive swap of left and right children.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/invert-binary-tree/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=OnSn2XEQ4MY" }
                ]
            },
            {
                title: "LeetCode #98 — Validate BST",
                description: "Pass min/max bounds through recursion.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/validate-binary-search-tree/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=s6ATEkipzow" }
                ]
            }
        ]
    },
    {
        slug: "graphs",
        title: "Graphs (BFS & DFS)",
        phase: 2,
        week: "15-16",
        icon: "🕸️",
        description: "Complex relationships and traversals. Master connectivity and pathfinding.",
        resources: [
            { name: "YouTube", type: "youtube", link: "https://www.youtube.com/watch?v=tWVWeAqZ0WU" },
            { name: "LeetCode", type: "leetcode", link: "https://leetcode.com/tag/graph/" }
        ],
        problems: [
            {
                title: "Graph Representations",
                description: "Adjacency list vs matrix. Directed vs undirected. Build from scratch.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=tWVWeAqZ0WU" }]
            },
            {
                title: "BFS & DFS Templates",
                description: "Implement both. Memorise the visited-set pattern.",
                difficulty: "Medium",
                completed: false,
                resources: [{ name: "GFG", type: "gfg", link: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" }]
            },
            {
                title: "LeetCode #200 — Number of Islands",
                description: "DFS flood-fill. One of the most popular interview questions ever.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/number-of-islands/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=pV2kpPD66nE" }
                ]
            },
            {
                title: "LeetCode #133 — Clone Graph",
                description: "BFS + hashmap for visited nodes.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/clone-graph/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=mQeF6bN8hMk" }
                ]
            }
        ]
    },
    {
        slug: "binary-search",
        title: "Binary Search",
        phase: 3,
        week: "17-18",
        icon: "🔍",
        description: "Logarithmic time searching. Master the search space reduction.",
        resources: [
            { name: "YouTube", type: "youtube", link: "https://www.youtube.com/watch?v=s4DPM8ct1pI" },
            { name: "LeetCode", type: "leetcode", link: "https://leetcode.com/tag/binary-search/" }
        ],
        problems: [
            {
                title: "Binary Search Template",
                description: "Memorise: lo=0, hi=n-1, mid=(lo+hi)//2. Understand boundary conditions.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=9pD596vj8as" }]
            },
            {
                title: "LeetCode #704 — Binary Search",
                description: "Basic. Iterative AND recursive.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/binary-search/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=s4DPM8ct1pI" }
                ]
            },
            {
                title: "LeetCode #33 — Search in Rotated Sorted Array",
                description: "Modified binary search. Very common interview variant.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=U8XENwh8Oy8" }
                ]
            }
        ]
    },
    {
        slug: "sliding-window",
        title: "Sliding Window & Two Pointers",
        phase: 3,
        week: "21-22",
        icon: "🪟",
        description: "Efficiently processing continuous subarrays and sequences. Master fixed and variable windows.",
        resources: [
            { name: "YouTube", type: "youtube", link: "https://www.youtube.com/watch?v=MK-NZ4hN7rs" },
            { name: "Neetcode", type: "neetcode", link: "https://neetcode.io/roadmap" }
        ],
        problems: [
            {
                title: "Sliding Window Pattern",
                description: "Fixed vs variable window. Very high ROI — shows up everywhere in interviews.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=MK-NZ4hN7rs" }]
            },
            {
                title: "LeetCode #3 — Longest Substring No Repeat",
                description: "Variable window + hashmap. Top 5 most-asked problem.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=wi-b_j-Yp0o" }
                ]
            },
            {
                title: "LeetCode #15 — 3Sum",
                description: "Sort + two pointers. Medium but very common.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/3sum/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=jzZsG8n2R9A" }
                ]
            },
            {
                title: "LeetCode #11 — Container With Most Water",
                description: "Two-pointer greedy. Elegant O(n).",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/container-with-most-water/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=UuiTKBwPgAo" }
                ]
            }
        ]
    },
    {
        slug: "dp",
        title: "Dynamic Programming",
        phase: 4,
        week: "23-24",
        icon: "🧩",
        description: "Solving subproblems to find global optima. Master memoization and tabulation.",
        resources: [
            { name: "YouTube", type: "youtube", link: "https://www.youtube.com/watch?v=oBt53YbR9Kk" },
            { name: "Neetcode", type: "neetcode", link: "https://neetcode.io/roadmap" },
            { name: "LeetCode", type: "leetcode", link: "https://leetcode.com/tag/dynamic-programming/" }
        ],
        problems: [
            {
                title: "DP Fundamentals — Memo vs Tabulation",
                description: "Top-down vs bottom-up. Draw the subproblem tree.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "Video", type: "video", link: "https://www.youtube.com/watch?v=oBt53YbR9Kk" }]
            },
            {
                title: "LeetCode #70 — Climbing Stairs",
                description: "Intro DP. Same recurrence as Fibonacci.",
                difficulty: "Easy",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/climbing-stairs/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=Y0lT9Fck7qI" }
                ]
            },
            {
                title: "LeetCode #198 — House Robber",
                description: "1D DP. Rob max without adjacent houses.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/house-robber/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=7uav70htf7Q" }
                ]
            },
            {
                title: "LeetCode #322 — Coin Change",
                description: "Classic bottom-up DP. One of the most important patterns.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/coin-change/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=H9bfqozjoqs" }
                ]
            },
            {
                title: "LeetCode #1143 — Longest Common Subsequence",
                description: "2D DP. Must-know for string DP.",
                difficulty: "Medium",
                completed: false,
                resources: [
                    { name: "Solve", type: "solve", link: "https://leetcode.com/problems/longest-common-subsequence/" },
                    { name: "Solution", type: "solution", link: "https://www.youtube.com/watch?v=Ua0GhsJSlWM" }
                ]
            }
        ]
    },
    {
        slug: "mock-interviews",
        title: "Mock Interviews & Final Prep",
        phase: 4,
        week: "25-26",
        icon: "🎤",
        description: "Final preparation for the big day. Master communication and behavioral skills.",
        resources: [
            { name: "Neetcode 150", type: "neetcode", link: "https://neetcode.io/practice" },
            { name: "Striver SDE", type: "striver", link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" }
        ],
        problems: [
            {
                title: "Neetcode 150 — Weak Topic Review",
                description: "Resolve 1 problem from each shaky topic.",
                difficulty: "Medium",
                completed: false,
                resources: [{ name: "Practice", type: "practice", link: "https://neetcode.io/practice" }]
            },
            {
                title: "Timed Mock Interview #1",
                description: "2 Easy + 1 Medium randomly. 45-min timer. No hints.",
                difficulty: "Hard",
                completed: false,
                resources: [{ name: "Random", type: "solve", link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" }]
            },
            {
                title: "Timed Mock Interview #2",
                description: "Different problems. Talk through your thinking out loud.",
                difficulty: "Hard",
                completed: false,
                resources: [{ name: "Practice", type: "practice", link: "https://neetcode.io/practice" }]
            },
            {
                title: "Behavioral Questions (STAR format)",
                description: "Prepare: Tell me about yourself, challenges, teamwork, why this company.",
                difficulty: "Easy",
                completed: false,
                resources: [{ name: "Guide", type: "video", link: "https://www.youtube.com/watch?v=PJKYqLP6MRE" }]
            },
            {
                title: "Resume & LinkedIn Update",
                description: "Add your DSA practice, technologies, any projects. Ask for referrals!",
                difficulty: "Easy",
                completed: false,
                resources: []
            }
        ]
    }
];

const seedDB = async () => {
    try {
        await Topic.deleteMany({});
        await Topic.insertMany(topicsData);
        console.log("Database Seeded Successfully! 🌱");
        process.exit();
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();
