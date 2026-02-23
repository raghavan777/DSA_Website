import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: {
        type: Boolean,
        default: false
    },
    difficulty: String,
    link: String,
    resources: [mongoose.Schema.Types.Mixed]
});

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: String,
    content: String,
    phase: Number,
    week: String,
    icon: String,
    resources: [mongoose.Schema.Types.Mixed],
    problems: [problemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Topic", topicSchema);