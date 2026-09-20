import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  conceptId: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
}

const questionSchema = new Schema<IQuestion>(
  {
    conceptId: {
      type: Schema.Types.ObjectId,
      ref: "Concept",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correctAnswer: {
      type: Number,
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

export default mongoose.model<IQuestion>("Question", questionSchema);