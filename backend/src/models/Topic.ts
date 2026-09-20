import mongoose, { Schema, Document } from "mongoose";

export interface ITopic extends Document {
  subjectId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  difficulty: string;
}

const topicSchema = new Schema<ITopic>(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITopic>("Topic", topicSchema);