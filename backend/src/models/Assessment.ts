import mongoose, { Schema, Document } from "mongoose";

export interface IAssessmentAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedAnswer: number;
  correct: boolean;
}

export interface IConceptScore {
  conceptId: mongoose.Types.ObjectId;
  conceptName: string;
  score: number;
  correct: number;
  total: number;
}

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;

  type: "diagnostic" | "reassessment";

  topicId?: mongoose.Types.ObjectId;

  answers: IAssessmentAnswer[];

  conceptScores: IConceptScore[];

  rootGap?: mongoose.Types.ObjectId;

  rootGapName?: string;

  overallScore: number;

  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    // -----------------------------------------
    // Logged-in user who owns this assessment
    // -----------------------------------------
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // -----------------------------------------
    // Assessment type
    // -----------------------------------------
    type: {
      type: String,
      enum: ["diagnostic", "reassessment"],
      required: true,
    },

    // -----------------------------------------
    // Topic
    // -----------------------------------------
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
    },

    // -----------------------------------------
    // Answers
    // -----------------------------------------
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },

        selectedAnswer: {
          type: Number,
          required: true,
        },

        correct: {
          type: Boolean,
          required: true,
        },
      },
    ],

    // -----------------------------------------
    // Concept scores
    // -----------------------------------------
    conceptScores: [
      {
        conceptId: {
          type: Schema.Types.ObjectId,
          ref: "Concept",
          required: true,
        },

        conceptName: {
          type: String,
          required: true,
        },

        score: {
          type: Number,
          required: true,
        },

        correct: {
          type: Number,
          required: true,
        },

        total: {
          type: Number,
          required: true,
        },
      },
    ],

    // -----------------------------------------
    // Root knowledge gap
    // -----------------------------------------
    rootGap: {
      type: Schema.Types.ObjectId,
      ref: "Concept",
    },

    rootGapName: {
      type: String,
    },

    // -----------------------------------------
    // Overall score
    // -----------------------------------------
    overallScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAssessment>(
  "Assessment",
  assessmentSchema
);