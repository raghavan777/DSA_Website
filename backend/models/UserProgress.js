import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        completedProblems: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("UserProgress", userProgressSchema);
