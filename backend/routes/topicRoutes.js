import express from "express";
import {
    getTopics,
    createTopic,
    getTopicBySlug,
    toggleProblemCompletion
} from "../controllers/topicController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTopics);
router.post("/", createTopic);
router.get("/:slug", getTopicBySlug);
router.patch("/:topicSlug/problems/:problemId", protect, toggleProblemCompletion);

export default router;